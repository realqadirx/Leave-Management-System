import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CircleProgress from '../components/CircleProgress'
import { useAuth } from '../contexts/AuthContext'

const leaveTypes = [
  { id: 'cl', name: 'Casual Leave', available: 6, used: 4, total: 10, color: '#f59e0b' },
  { id: 'el', name: 'Earned Leave', available: 10.42, used: 10, total: 15, color: '#ef4444' },
  { id: 'ml', name: 'Marriage Leave', available: 5, used: 0, total: 5, color: '#06b6d4' },
  { id: 'sl', name: 'Sick Leave', available: 3, used: 3, total: 6, color: '#8b5cf6' }
]

export default function Dashboard(){
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [profileImage, setProfileImage] = React.useState(null)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchText, setSearchText] = useState('')
  

  const [leaveHistory] = useState([
    {
      id: 1,
      dates: '23 Oct - 24 Oct 2025',
      days: '2 Days',
      type: 'Earned Leave',
      requestDate: '29 Sep 2025',
      status: 'Approved',
      approver: 'Amit Bora',
      requestedBy: 'Himanshu Gola',
      actionOn: '06 Oct 2025',
      note: 'Taking leave for family commitment'
    },
    {
      id: 2,
      dates: '01 Oct 2025',
      days: '1 Day',
      type: 'Floater Leave',
      requestDate: '24 Sep 2025',
      status: 'Approved',
      approver: 'Amit Bora',
      requestedBy: 'Himanshu Gola',
      actionOn: '25 Sep 2025',
      note: 'Floater Leave'
    },
    {
      id: 3,
      dates: '26 Sept 2025',
      days: '1 Day',
      type: 'Sick Leave',
      requestDate: '26 Sep 2025',
      status: 'Approved',
      approver: 'Amit Bora',
      requestedBy: 'Himanshu Gola',
      actionOn: '29 Sep 2025',
      note: 'Not well today'
    }
    ,
    {
      id: 4,
      dates: '12 Nov 2025',
      days: '1 Day',
      type: 'Earned Leave',
      requestDate: '01 Nov 2025',
      status: 'Approved',
      approver: 'Amit Bora',
      requestedBy: 'Kritika Yadav',
      actionOn: '05 Nov 2025',
      note: 'Personal work'
    },
    {
      id: 5,
      dates: '03 Dec 2025',
      days: '2 Days',
      type: 'Floater Leave',
      requestDate: '20 Nov 2025',
      status: 'Pending',
      approver: '',
      requestedBy: 'Aditya Singh',
      actionOn: '',
      note: 'Attending a short course'
    },
    {
      id: 6,
      dates: '18 Oct 2025',
      days: '1 Day',
      type: 'Sick Leave',
      requestDate: '17 Oct 2025',
      status: 'Rejected',
      approver: 'Amit Bora',
      requestedBy: 'Harsimar',
      actionOn: '18 Oct 2025',
      note: 'Not well'
    },
    {
      id: 7,
      dates: '05 Jan 2026',
      days: '3 Days',
      type: 'Marriage Leave',
      requestDate: '20 Dec 2025',
      status: 'Approved',
      approver: 'Amit Bora',
      requestedBy: 'Manan Kumar',
      actionOn: '28 Dec 2025',
      note: 'Family event'
    },
    {
      id: 8,
      dates: '22 Feb 2026',
      days: '1 Day',
      type: 'Unpaid Leave',
      requestDate: '10 Feb 2026',
      status: 'Pending',
      approver: '',
      requestedBy: 'Rohit Sharma',
      actionOn: '',
      note: 'Personal'
    }
  ])

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('profileUser')
      if (raw) setProfile(JSON.parse(raw))
      const img = localStorage.getItem('profileImage')
      if (img) setProfileImage(img)
    } catch (err) {
      // ignore
    }
  }, [])

  // filteredLeaves is derived from leaveHistory + filters
  const [filteredLeaves, setFilteredLeaves] = useState(leaveHistory)

  useEffect(() => {
    const t = selectedType
    const s = selectedStatus
    const q = searchText.trim().toLowerCase()

    const results = leaveHistory.filter(item => {
      if (t !== 'all' && item.type !== t) return false
      if (s !== 'all' && item.status.toLowerCase() !== s.toLowerCase()) return false
      if (q) {
        const hay = [item.type, item.requestedBy, item.note, item.approver, item.dates, item.actionOn, item.requestDate].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    setFilteredLeaves(results)
  }, [selectedType, selectedStatus, searchText, leaveHistory])

  return (
    <div className="dashboard-layout" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '32px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background shapes */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>
      
      <div style={{position: 'relative', zIndex: 1}}>
        {/* Welcome Header */}
        <div className="page-title" style={{marginBottom: 32, animation: 'slideDown 0.6s ease-out'}}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 800,
              color: 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
            </h2>
            <div style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: 16,
              fontWeight: 500,
              marginTop: 8
            }}>
              {user?.role ? user.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Dashboard' : 'Faculty Dashboard'}
            </div>

          </div>
        </div>

        {/* Top Row: Profile Card and Leave Summary */}
        <div className="dashboard-row top" style={{
          display: 'flex',
          gap: '32px',
          marginBottom: 32,
          flexWrap: 'wrap'
        }}>
          {/* Profile Card */}
          <div className="dashboard-card profile-card" style={{
            flex: '0 0 340px',
            minHeight: '420px',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 220,
            transition: 'all 0.4s ease',
            animation: 'fadeInUp 0.8s ease-out 0.1s backwards',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{
              position: 'relative',
              marginBottom: 24
            }}>
              <img 
                src={user?.profileImage || "https://i.pravatar.cc/150?img=12"} 
                alt="Profile" 
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }} 
              />
              <div style={{
                position: 'absolute',
                bottom: 5,
                right: 5,
                width: 24,
                height: 24,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}></div>
            </div>
            <div className="profile-meta" style={{textAlign: 'center'}}>
              <h2 className="profile-name" style={{
                fontSize: 28,
                margin: 0,
                fontWeight: 800,
                color: '#1a1a1a',
                marginBottom: 8
              }}>
                {user?.name || 'User'}
              </h2>
              <p className="profile-role" style={{
                margin: '8px 0',
                color: '#667eea',
                fontSize: 16,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {user?.role ? user.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Faculty'}
              </p>
              <p className="profile-dept" style={{
                margin: 0,
                color: '#666',
                fontSize: 15,
                fontWeight: 500
              }}>
                {user?.department || 'Not specified'}
              </p>
              <p className="profile-email" style={{
                margin: '8px 0 0 0',
                color: '#888',
                fontSize: 13,
                fontWeight: 400
              }}>
                {user?.email || ''}
              </p>
            </div>
          </div>

          {/* Leave Summary (Graphical) */}
          <div className="dashboard-card" style={{
            flex: 1,
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderRadius: '24px',
            padding: '32px',
            minWidth: 280,
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
          }}>
            <h3 className="card-title" style={{
              fontSize: 28,
              marginBottom: 24,
              fontWeight: 800,
              color: '#1a1a1a',
              textAlign: 'center'
            }}>
              📊 Leave Summary
            </h3>
            <div className="leave-summary-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
              width: '100%'
            }}>
              {leaveTypes.map((leave, index) => (
                <div 
                  key={leave.id} 
                  className="leave-summary-item" 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: `linear-gradient(135deg, ${leave.color}10 0%, ${leave.color}05 100%)`,
                    borderRadius: '20px',
                    border: `2px solid ${leave.color}30`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    padding: '24px 16px',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    cursor: 'pointer',
                    animation: `fadeInUp 0.6s ease-out ${0.1 * index}s backwards`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)'
                    e.currentTarget.style.boxShadow = `0 12px 32px ${leave.color}40`
                    e.currentTarget.style.background = `linear-gradient(135deg, ${leave.color}20 0%, ${leave.color}10 100%)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                    e.currentTarget.style.background = `linear-gradient(135deg, ${leave.color}10 0%, ${leave.color}05 100%)`
                  }}
                >
                  <CircleProgress
                    percentage={(leave.available / leave.total) * 100}
                    color={leave.color}
                    size={70}
                    strokeWidth={7}
                  />
                  <div className="progress-info" style={{
                    fontWeight: 800,
                    fontSize: 28,
                    margin: '12px 0 8px 0',
                    color: leave.color
                  }}>
                    {leave.available}
                  </div>
                  <div className="leave-details" style={{textAlign: 'center'}}>
                    <div className="leave-name" style={{
                      fontWeight: 700,
                      fontSize: 16,
                      marginBottom: 8,
                      color: '#1a1a1a'
                    }}>
                      {leave.name}
                    </div>
                    <div className="leave-mini-stats" style={{
                      fontSize: 13,
                      color: '#666',
                      display: 'flex',
                      gap: 12,
                      justifyContent: 'center'
                    }}>
                      <span className="stat-label">Total: <strong style={{color: '#1a1a1a'}}>{leave.total}</strong></span>
                      <span>•</span>
                      <span className="stat-label">Used: <strong style={{color: '#1a1a1a'}}>{leave.used}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>      {/* Leave Balance Section */}
      <div className="dashboard-row" style={{ marginBottom: 32 }}>
        <div className="dashboard-card leave-balance-section" style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '40px 32px', width: '100%' }}>
          <h3 className="card-title" style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, textAlign: 'center', letterSpacing: 1 }}>Leave Balance</h3>
          <div className="leave-balance-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', width: '100%' }}>
            {leaveTypes.map(type => (
              <div key={type.id} className="balance-card" style={{background:'#f9f9f9', padding:24, borderRadius:16, border:'1px solid #eee', boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontSize:20, fontWeight:700, marginBottom:4, color:'#1a2236'}}>{type.name}</div>
                    {type.available === 0 && !type.used && (
                      <div style={{fontSize:15, color:'#888'}}>No data to display</div>
                    )}
                  </div>
                  <button className="btn btn-ghost" style={{fontSize:15, border:'1px solid #ddd', borderRadius:8, padding:'6px 16px', background:'#fff', cursor:'pointer'}}>View details</button>
                </div>

                {(type.available > 0 || type.used > 0) && (
                  <>
                    <div style={{display:'flex', justifyContent:'center', margin:'20px 0'}}>
                      <CircleProgress
                        percentage={(type.available / (type.total || 1)) * 100}
                        color={type.color}
                        size={64}
                        strokeWidth={8}
                      />
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, fontSize:15}}>
                      <div>
                        <div style={{color:'#888'}}>Available</div>
                        <div style={{fontWeight:600}}>{type.available} days</div>
                      </div>
                      <div>
                        <div style={{color:'#888'}}>Consumed</div>
                        <div style={{fontWeight:600}}>{type.used} days</div>
                      </div>
                      {type.total && (
                        <div>
                          <div style={{color:'#888'}}>Annual Quota</div>
                          <div style={{fontWeight:600}}>{type.total} days</div>
                        </div>
                      )}
                      {type.accruedSoFar && (
                        <div>
                          <div style={{color:'#888'}}>Accrued so far</div>
                          <div style={{fontWeight:600}}>{type.accruedSoFar} days</div>
                        </div>
                      )}
                      {type.carryOver && (
                        <div>
                          <div style={{color:'#888'}}>Carry Over</div>
                          <div style={{fontWeight:600}}>{type.carryOver} days</div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leave History Section */}
      <div className="dashboard-row">
        <div className="dashboard-card leave-history-section" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '32px' }}>
          <h3 className="card-title" style={{ fontSize: 28, marginBottom: 24, color: '#111827', fontWeight: '600' }}>Leave History</h3>
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {/* Leave Type Filter */}
            <div style={{ position: 'relative', minWidth: '180px' }}>
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '6px', 
                    appearance: 'none', 
                    background: 'white',
                    paddingRight: '28px' // Space for the custom arrow
                  }}
                >
                  <option value="all">Leave Type</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Floater Leave">Floater Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Marriage Leave">Marriage Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                  <option value="Special Leave">Special Leave</option>
                </select>
                <div style={{ 
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#6b7280'
                }}>▼</div>
              </div>
            </div>

            {/* Status Filter */}
            <div style={{ position: 'relative', minWidth: '180px' }}>
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '6px', 
                    appearance: 'none', 
                    background: 'white',
                    paddingRight: '28px'
                  }}
                >
                  <option value="all">Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <div style={{ 
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#6b7280'
                }}>▼</div>
              </div>
            </div>

            {/* Search Box */}
            <div style={{ flex: '1', maxWidth: '300px' }}>
              <input 
                type="text" 
                value={searchText}
                placeholder="Search" 
                onChange={(e) => setSearchText(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '6px',
                  background: 'white'
                }} 
              />
            </div>
          </div>

          <div className="table-container">
            <table className="leave-history-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', color: '#111827', fontWeight: '600' }}>Leave Dates</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', color: '#111827', fontWeight: '600' }}>Leave Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', color: '#111827', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', color: '#111827', fontWeight: '600' }}>Requested By</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', color: '#111827', fontWeight: '600' }}>Action Taken On</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', color: '#111827', fontWeight: '600' }}>Leave Note</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', color: '#111827', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(filteredLeaves.length > 0 ? filteredLeaves : leaveHistory).map((leave, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ fontWeight: '500' }}>{leave.dates}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{leave.days}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Requested on {leave.requestDate}</div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ color: '#2563eb', fontWeight: '500' }}>{leave.type}</div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ color: '#059669', fontWeight: '500' }}>{leave.status}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>by {leave.approver}</div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>{leave.requestedBy}</td>
                    <td style={{ padding: '16px 12px' }}>{leave.actionOn}</td>
                    <td style={{ padding: '16px 12px' }}>{leave.note}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <button style={{ 
                        padding: '6px 12px', 
                        background: '#f3f4f6', 
                        border: 'none', 
                        borderRadius: '4px',
                        color: '#374151',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 0',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <div>Showing 1-3 of 3 entries</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ 
                padding: '4px 8px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                color: '#374151'
              }}>&lt;</button>
              <button style={{ 
                padding: '4px 8px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                color: '#374151'
              }}>&gt;</button>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}