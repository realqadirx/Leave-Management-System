from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import mysql.connector
import os

app = Flask(__name__)
# Use environment variables for secrets in dev/production. Fall back to a local key.
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev-secret-key')


# Database connection helper. Wrap in try/except so app can still run without DB
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get('DB_HOST', 'localhost'),
            user=os.environ.get('DB_USER', 'root'),
            password=os.environ.get('DB_PASSWORD', 'Simar#9445'),
            database=os.environ.get('DB_NAME', 'login_page')
        )
        return conn
    except mysql.connector.Error:
        return None


def get_cursor():
    conn = get_db_connection()
    if conn:
        return conn, conn.cursor()
    return None, None

@app.route('/')
def home():
    # Fallback to a simple message if template is missing
    try:
        return render_template('login.html')
    except Exception:
        return "<p>Login page (template missing). Navigate to /signup or /login</p>"

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn, cursor = get_cursor()
        if not cursor:
            flash("⚠️ Database not available. Signup disabled.")
            return redirect(url_for('signup'))

        try:
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            existing_user = cursor.fetchone()

            if existing_user:
                flash("⚠️ Username already exists!")
                return redirect(url_for('signup'))

            cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
            conn.commit()

            flash("✅ Signup successful! You can now login.")
            return redirect(url_for('login'))
        except Exception:
            flash("❌ An error occurred during signup. Try again later.")
            return redirect(url_for('signup'))
        finally:
            try:
                cursor.close()
                conn.close()
            except Exception:
                pass

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn, cursor = get_cursor()
        if not cursor:
            flash("⚠️ Database not available. Login disabled.")
            return redirect(url_for('login'))

        try:
            cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s", (username, password))
            user = cursor.fetchone()

            if user:
                try:
                    return render_template('dashboard.html', username=username)
                except Exception:
                    # Fallback dashboard when template missing
                    return f"<h2>Welcome, {username}</h2>"
            else:
                flash("❌ Invalid username or password!")
                return redirect(url_for('login'))
        except Exception:
            flash("❌ An error occurred during login. Try again later.")
            return redirect(url_for('login'))
        finally:
            try:
                cursor.close()
                conn.close()
            except Exception:
                pass

    return render_template('login.html')

@app.route('/health')
def health():
    conn, cursor = get_cursor()
    if conn:
        try:
            cursor.execute('SELECT 1')
            return jsonify({'status': 'ok'})
        except Exception:
            return jsonify({'status': 'db-error'}), 500
        finally:
            try:
                cursor.close()
                conn.close()
            except Exception:
                pass
    return jsonify({'status': 'no-db'}), 500


if __name__ == '__main__':
    app.run(debug=True)
