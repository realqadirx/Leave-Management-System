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
  
  // Get user data from AuthContext (MongoDB) - derive directly, no local state
  const profile = {
    name: user?.name || user?.fullName || 'User',
    email: user?.email || '',
    department: user?.department || 'Computer Applications',
    role: user?.role || 'faculty',
    profileImage: user?.avatar || user?.profileImage || null
  }
  
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchText, setSearchText] = useState('')
  
  // Clean up old localStorage keys on mount
  useEffect(() => {
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser')
    }
    if (localStorage.getItem('profileUser')) {
      localStorage.removeItem('profileUser')
    }
  }, [])

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
    },
    {
      id: 4,
      dates: '12 Nov 2025',
      days: '1 Day',
      type: 'Earned Leave',
      requestDate: '01 Nov 2025',
      status: 'Approved',
      approver: 'Amit Bora',
      requestedBy: user?.name || user?.fullName || 'User',
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

  // Don't override profile with old cached data from localStorage
  // The profile is already set correctly from currentUser above

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
    <div className="dashboard-layout" style={{ background: '#f7f7f7', minHeight: '100vh', padding: '32px' }}>
      {/* Welcome Header */}
      <div className="page-title" style={{ marginBottom: 32 }}>
        <div>
          <h2 style={{margin:0}}>Welcome, {profile.name.split(' ')[0]}</h2>
          <div style={{color:'var(--muted)'}}>Faculty Dashboard</div>
        </div>
      </div>

      {/* Top Row: Profile Card and Leave Summary */}
      <div className="dashboard-row top" style={{ display: 'flex', gap: '32px', marginBottom: 32 }}>
        {/* Profile Card */}
        <div className="dashboard-card profile-card" style={{ flex: '0 0 340px', height: '420px', background: '#fff', borderRadius: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 220 }}>
          <img src={profileImage || profile.avatar || "https://i.pravatar.cc/150?img=12"} alt="Profile" style={{ width: 96, height: 96, borderRadius: '50%', marginBottom: 24, objectFit: 'cover' }} />
          <div className="profile-meta" style={{ textAlign: 'center' }}>
            <h2 className="profile-name" style={{ fontSize: 26, margin: 0, fontWeight: 700 }}>{profile.name}</h2>
            <p className="profile-role" style={{ margin: '8px 0', color: '#888', fontSize: 18 }}>{profile.role || 'Teacher'}</p>
            <p className="profile-dept" style={{ margin: 0, color: '#444', fontSize: 18 }}>{profile.department}</p>
          </div>
        </div>

        {/* Leave Summary (Graphical) */}
        <div className="dashboard-card" style={{ flex: 1, background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1px 0 8px 0', minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 className="card-title" style={{ fontSize: 30, marginBottom: 12, width: '100%', textAlign: 'center', paddingLeft: 24 }}>Leave Summary</h3>
          <div className="leave-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px', width: '100%', justifyItems: 'center', alignItems: 'start', padding: '0 24px', justifyContent: 'center' }}>
            {leaveTypes.map(leave => (
              <div key={leave.id} className="leave-summary-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f9f9f9', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '16px 8px', minWidth: '140px', marginBottom: 0, width: '100%' }}>
                <CircleProgress
                  percentage={(leave.available / leave.total) * 100}
                  color={leave.color}
                  size={56}
                  strokeWidth={6}
                />
                <div className="progress-info" style={{ fontWeight: 700, fontSize: 20, margin: '6px 0 2px 0', color: leave.color }}>{leave.available}</div>
                <div className="leave-details" style={{ textAlign: 'center' }}>
                  <div className="leave-name" style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{leave.name}</div>
                  <div className="leave-mini-stats" style={{ fontSize: 15, color: '#444', marginTop: 2 }}>
                    <span className="stat-label">Total: <strong>{leave.total}</strong></span>
                    <span className="stat-label" style={{ marginLeft: 8 }}>Used: <strong>{leave.used}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leave Balance Section */}
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
  )
}