import React, { useState, useEffect } from 'react'

export default function RequestDrawer({ open, onClose }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [type, setType] = useState('')
  const [note, setNote] = useState('')
  const [notify, setNotify] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!open) {
      // reset form when drawer closed
      setFrom('')
      setTo('')
      setType('')
      setNote('')
      setNotify('')
      setShowModal(false)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e) => {
    e && e.preventDefault && e.preventDefault()
    // Simulate submission: persist small record in localStorage
    try {
      const recent = JSON.parse(localStorage.getItem('leaveRequests') || '[]')
      recent.unshift({ id: Date.now(), from, to, type, note, notify, status: 'Pending' })
      localStorage.setItem('leaveRequests', JSON.stringify(recent))
    } catch (err) {
      // ignore
    }
    setShowModal(true)
    // optionally auto close drawer after a short delay
    setTimeout(() => {
      setShowModal(false)
      onClose()
    }, 2200)
  }

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="drawer" onClick={e => e.stopPropagation()} style={{
        background: 'white',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 30px 90px rgba(0,0,0,0.4)',
        animation: 'slideUpScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        zIndex: 10000
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h3 style={{
            marginTop: 0,
            marginBottom: 0,
            fontSize: '28px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ✨ Request Leave
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(102,126,234,0.15)',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#667eea',
              padding: 0,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#667eea'
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.transform = 'rotate(90deg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(102,126,234,0.15)'
              e.currentTarget.style.color = '#667eea'
              e.currentTarget.style.transform = 'rotate(0deg)'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 20,
            background: 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)',
            padding: '20px',
            borderRadius: '16px',
            border: '2px solid rgba(102,126,234,0.2)'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                fontSize: 13,
                color: '#667eea',
                fontWeight: 600,
                display: 'block',
                marginBottom: 8
              }}>From</label>
              <input
                value={from}
                onChange={e=>setFrom(e.target.value)}
                type="date"
                required
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  border: '2px solid #e5e7eb',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={{
              width: 80,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#667eea',
                background: 'white',
                padding: '8px 12px',
                borderRadius: 8,
                border: '2px solid rgba(102,126,234,0.2)'
              }}>
                {(from && to) ? Math.max(1, (new Date(to)-new Date(from))/(1000*60*60*24)+1) + ' days' : '0 days'}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                fontSize: 13,
                color: '#667eea',
                fontWeight: 600,
                display: 'block',
                marginBottom: 8
              }}>To</label>
              <input
                value={to}
                onChange={e=>setTo(e.target.value)}
                type="date"
                required
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  border: '2px solid #e5e7eb',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{
              fontSize: 13,
              color: '#667eea',
              fontWeight: 600,
              display: 'block',
              marginBottom: 8
            }}>Select type of leave you want to apply</label>
            <select
              value={type}
              onChange={e=>setType(e.target.value)}
              required
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                borderRadius: 10,
                border: '2px solid #e5e7eb',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <option value="">Select</option>
              <option>Comp Offs - Not Available</option>
              <option>Earned Leave - 10.42 days available</option>
              <option>Floater Leave - Not Available</option>
              <option>Marriage Leave - 5 days available</option>
              <option>Paternity Leave - 5 days available</option>
              <option>Shared Leave - Not Available</option>
            </select>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{
              fontSize: 13,
              color: '#667eea',
              fontWeight: 600,
              display: 'block',
              marginBottom: 8
            }}>Note</label>
            <textarea
              value={note}
              onChange={e=>setNote(e.target.value)}
              placeholder="Type your reason here..."
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                borderRadius: 10,
                border: '2px solid #e5e7eb',
                minHeight: 100,
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{
              fontSize: 13,
              color: '#667eea',
              fontWeight: 600,
              display: 'block',
              marginBottom: 8
            }}>Notify</label>
            <input
              value={notify}
              onChange={e=>setNotify(e.target.value)}
              placeholder="Search employee"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                borderRadius: 10,
                border: '2px solid #e5e7eb',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div className="drawer-footer" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 28,
            paddingTop: 20,
            borderTop: '2px solid #f1f5f9'
          }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                border: '2px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9'
                e.currentTarget.style.borderColor = '#667eea'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '12px 32px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(102,126,234,0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,0.4)'
              }}
            >
              ✓ Request
            </button>
          </div>
        </form>

        {showModal && (
          <div className="modal-backdrop" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div className="modal-box" style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 30px 90px rgba(0,0,0,0.5)',
              animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 64,
                marginBottom: 16,
                animation: 'bounce 0.6s ease-out'
              }}>✓</div>
              <div style={{
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 12,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Request Submitted!
              </div>
              <div style={{
                color: '#6b7280',
                marginBottom: 24,
                fontSize: 15
              }}>
                Your leave request has been submitted successfully.
              </div>
              <button
                className="btn btn-primary"
                onClick={()=>{setShowModal(false); onClose()}}
                style={{
                  padding: '12px 32px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102,126,234,0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,0.4)'
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUpScale {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.5);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}</style>
      </div>
    </div>
  )
}