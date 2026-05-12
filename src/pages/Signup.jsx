import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../utils/api-auth'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState('faculty')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    employeeId: '',
    phoneNumber: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const roles = [
    { id: 'faculty', name: 'Faculty', icon: '👨‍🏫', color: '#667eea', description: 'Teachers and professors' },
    { id: 'coordinator', name: 'Coordinator', icon: '👔', color: '#f093fb', description: 'Department coordinators' },
    { id: 'chief_coordinator', name: 'Chief Coordinator', icon: '👨‍💼', color: '#4facfe', description: 'Head of coordinators' },
    { id: 'principal', name: 'Principal', icon: '🎓', color: '#fa709a', description: 'Institution head' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('') // Clear error on input change
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!formData.email.trim()) {
      setError('Please enter your email')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (!formData.department.trim()) {
      setError('Please enter your department')
      return false
    }
    return true
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    try {
      setLoading(true)
      
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: selectedRole,
        department: formData.department.trim(),
        employeeId: formData.employeeId.trim() || undefined,
        phoneNumber: formData.phoneNumber.trim() || undefined
      }

      const { token, user } = await registerUser(userData)
      
      // Use AuthContext to manage user state (not localStorage)
      await login(user, token)
      
      // Navigate based on role
      switch(user.role) {
        case 'faculty':
          navigate('/dashboard')
          break
        case 'coordinator':
          navigate('/dashboard')
          break
        case 'chief_coordinator':
          navigate('/dashboard')
          break
        case 'principal':
          navigate('/dashboard')
          break
        default:
          navigate('/dashboard')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError(error.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = () => {
    // Redirect to GitHub OAuth - Use environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const backendUrl = API_URL.replace('/api', '') // Remove /api suffix if present
    window.location.href = `${backendUrl}/api/auth/github`
  }

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth - Use environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const backendUrl = API_URL.replace('/api', '') // Remove /api suffix if present
    window.location.href = `${backendUrl}/api/auth/google`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '150px',
        height: '150px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '520px',
        textAlign: 'center'
      }}>
        {/* Logo and Title */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <span style={{ fontSize: '40px', color: 'white' }}>📚</span>
        </div>

        <h1 style={{
          color: 'white',
          fontSize: '36px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          textShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>Join TeachTimeOff</h1>
        
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '16px',
          margin: '0 0 32px 0'
        }}>Create your account and start managing leaves</p>

        {/* Signup Card */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.95)',
          borderRadius: '24px',
          padding: '40px 32px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>Create Account</h2>
          
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            margin: '0 0 24px 0'
          }}>Fill in your details to get started</p>

          {/* OAuth Buttons */}
          <button onClick={handleGitHubLogin} type="button" style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #24292e 0%, #000000 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span>📱</span> Continue with GitHub
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
            <span style={{ padding: '0 12px' }}>or sign up with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
          </div>

          {/* Role Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px',
              marginBottom: '12px',
              fontWeight: '500',
              textAlign: 'left'
            }}>Select Your Role *</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    padding: '16px 12px',
                    background: selectedRole === role.id 
                      ? `linear-gradient(135deg, ${role.color} 0%, ${role.color}dd 100%)`
                      : 'rgba(255,255,255,0.1)',
                    border: selectedRole === role.id 
                      ? `2px solid ${role.color}`
                      : '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transform: selectedRole === role.id ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedRole === role.id 
                      ? `0 8px 20px ${role.color}40`
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRole !== role.id) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRole !== role.id) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{role.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>{role.name}</span>
                  <span style={{ fontSize: '10px', opacity: 0.8, textAlign: 'center' }}>{role.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>Full Name *</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.5)'
                }}>👤</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.5)'
                }}>✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@jims.edu"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Department */}
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>Department *</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.5)'
                }}>🏢</span>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., Computer Applications"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Employee ID (Optional) */}
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>Employee ID (Optional)</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.5)'
                }}>🆔</span>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="e.g., FAC001"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Phone Number (Optional) */}
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.5)'
                }}>📱</span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.5)'
                }}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.5)'
                }}>🔒</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '10px',
                marginBottom: '16px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '8px',
                color: '#fca5a5',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading 
                  ? 'rgba(167, 139, 250, 0.5)'
                  : 'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.transform = 'translateY(0)'
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>→</span> Create Account
                </>
              )}
            </button>
          </form>

          {/* OAuth Buttons - Removed Google, kept GitHub */}
          <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={handleGitHubLogin}
              style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.3s, transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              <span>🫆</span> Sign up with GitHub
            </button>
          </div>

          <p style={{
            marginTop: '24px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px'
          }}>
            Already have an account? <Link
              to="/login" 
              style={{ 
                color: '#a78bfa', 
                textDecoration: 'none', 
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >Sign in</Link>
          </p>
        </div>

        <p style={{
          marginTop: '24px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '13px'
        }}>
          By creating an account, you agree to our{' '}
          <a href="#" style={{ color: '#a78bfa', textDecoration: 'none' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: '#a78bfa', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
