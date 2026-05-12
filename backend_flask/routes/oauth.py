"""
OAuth routes for Google and GitHub authentication
"""
from flask import Blueprint, request, jsonify, redirect, url_for, session
from flask_jwt_extended import create_access_token
from authlib.integrations.flask_client import OAuth
from models.user import User
from extensions import db
import os
import secrets

oauth_bp = Blueprint('oauth', __name__)

# Initialize OAuth
oauth = OAuth()

def init_oauth(app):
    """Initialize OAuth with app configuration"""
    oauth.init_app(app)
    
    # Register Google OAuth
    oauth.register(
        name='google',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )
    
    return oauth

# @route   GET /api/auth/google
# @desc    Initiate Google OAuth login
# @access  Public
@oauth_bp.route('/google', methods=['GET'])
def google_login():
    """Redirect to Google OAuth consent screen"""
    try:
        # Get the frontend URL for redirect after auth
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        
        # Store frontend URL in session for callback
        session['frontend_url'] = frontend_url
        
        # Generate redirect URI
        redirect_uri = url_for('oauth.google_callback', _external=True)
        
        # Redirect to Google for authentication
        return oauth.google.authorize_redirect(redirect_uri)
        
    except Exception as e:
        print(f'Google login error: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Failed to initiate Google authentication',
            'error': str(e)
        }), 500

# @route   GET /api/auth/google/callback
# @desc    Google OAuth callback
# @access  Public
@oauth_bp.route('/google/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback"""
    try:
        # Get the OAuth token from Google
        token = oauth.google.authorize_access_token()
        
        # Get user info from Google
        user_info = token.get('userinfo')
        
        if not user_info:
            # If userinfo is not in token, fetch it
            resp = oauth.google.get('https://www.googleapis.com/oauth2/v3/userinfo')
            user_info = resp.json()
        
        print(f'Google user info: {user_info}')
        
        # Extract user data
        google_id = user_info.get('sub')
        email = user_info.get('email')
        name = user_info.get('name')
        profile_image = user_info.get('picture')
        
        if not google_id or not email:
            return redirect(f"{session.get('frontend_url', 'http://localhost:5173')}/login?error=missing_user_info")
        
        # Check if user exists
        user = User.query.filter_by(email=email.lower()).first()
        
        if user:
            # User exists - update Google ID and profile image if not set
            if not user.google_id:
                user.google_id = google_id
            if not user.profile_image and profile_image:
                user.profile_image = profile_image
            db.session.commit()
            print(f'✅ Google login successful for existing user: {email}')
        else:
            # User doesn't exist - redirect to signup with error
            frontend_url = session.get('frontend_url', 'http://localhost:5173')
            error_msg = 'no_account_found'
            return redirect(f"{frontend_url}/login?error={error_msg}&message=Please sign up first before using Google login")
        
        # Generate JWT token
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={'role': user.role}
        )
        
        # Get frontend URL from session
        frontend_url = session.get('frontend_url', 'http://localhost:5173')
        
        # Redirect to frontend with token
        redirect_url = f"{frontend_url}/auth/callback?token={access_token}"
        
        return redirect(redirect_url)
        
    except Exception as e:
        print(f'Google callback error: {str(e)}')
        import traceback
        traceback.print_exc()
        
        frontend_url = session.get('frontend_url', 'http://localhost:5173')
        return redirect(f"{frontend_url}/login?error={str(e)}")

# @route   POST /api/auth/google/signup
# @desc    Complete Google OAuth signup with role selection
# @access  Public
@oauth_bp.route('/google/signup', methods=['POST'])
def google_signup_complete():
    """
    Complete Google signup by allowing user to select role and add additional info.
    This is called from frontend after initial Google authentication.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('role'):
            return jsonify({
                'success': False,
                'message': 'Email and role are required'
            }), 400
        
        email = data['email'].lower().strip()
        role = data['role']
        
        # Validate role
        valid_roles = ['faculty', 'coordinator', 'chief_coordinator', 'principal']
        if role not in valid_roles:
            return jsonify({
                'success': False,
                'message': 'Invalid role'
            }), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found. Please sign in with Google first.'
            }), 404
        
        # Update user with additional information
        user.role = role
        
        if data.get('department'):
            user.department = data['department'].strip()
        if data.get('employeeId'):
            user.employee_id = data['employeeId'].strip()
        if data.get('phoneNumber'):
            user.phone_number = data['phoneNumber'].strip()
        
        db.session.commit()
        
        # Generate new JWT token with updated role
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={'role': user.role}
        )
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f'Google signup complete error: {str(e)}')
        return jsonify({
            'success': False,
            'message': 'Server error',
            'error': str(e)
        }), 500
