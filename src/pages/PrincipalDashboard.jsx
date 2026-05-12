import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrincipalDashboard(){
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  console.log('PrincipalDashboard render - user:', user);
  
  const [institutionStats] = useState({
    totalFaculty: 45,
    totalDepartments: 5,
    totalStudents: 1200,
    onLeaveToday: 8,
    pendingApprovals: 3,
    approvedThisMonth: 45,
    rejectedThisMonth: 2,
    averageLeavePerFaculty: 12.5
  })
  
  // Clean up old localStorage keys on mount
  React.useEffect(() => {
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser')
    }
    if (localStorage.getItem('profileUser')) {
      localStorage.removeItem('profileUser')
    }
  }, [])

  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== 'principal') {
      navigate('/login')
      return
    }
  }, [navigate, isAuthenticated, user])

  if (!user) return null

  // Get user's first name - handle both fullName and name fields
  const userName = user.name || user.fullName || 'User'
  const firstName = userName.split(' ')[0]

  return (
    <div className="dashboard-layout" style={{ background: '#f7f7f7', minHeight: '100vh', padding: '32px' }}>
      {/* Welcome Header */}
      <div className="page-title" style={{ marginBottom: 32 }}>
        <div>
          <h2 style={{margin:0, fontSize: '32px', fontWeight: '700'}}>Welcome, {firstName}</h2>
          <div style={{color:'var(--muted)', fontSize: '16px'}}>Principal Dashboard - Institution Overview</div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: 32 }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '28px', 
          borderRadius: '20px', 
          color: 'white',
          boxShadow: '0 8px 24px rgba(102,126,234,0.4)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Total Faculty</div>
          <div style={{ fontSize: '42px', fontWeight: '700', marginBottom: '4px' }}>{institutionStats.totalFaculty}</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>Across {institutionStats.totalDepartments} departments</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          padding: '28px', 
          borderRadius: '20px', 
          color: 'white',
          boxShadow: '0 8px 24px rgba(245,87,108,0.4)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>On Leave Today</div>
          <div style={{ fontSize: '42px', fontWeight: '700', marginBottom: '4px' }}>{institutionStats.onLeaveToday}</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>{((institutionStats.onLeaveToday/institutionStats.totalFaculty)*100).toFixed(1)}% of total faculty</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          padding: '28px', 
          borderRadius: '20px', 
          color: 'white',
          boxShadow: '0 8px 24px rgba(79,172,254,0.4)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Pending Approvals</div>
          <div style={{ fontSize: '42px', fontWeight: '700', marginBottom: '4px' }}>{institutionStats.pendingApprovals}</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>Requires your attention</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
          padding: '28px', 
          borderRadius: '20px', 
          color: 'white',
          boxShadow: '0 8px 24px rgba(254,225,64,0.4)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '500' }}>Approved This Month</div>
          <div style={{ fontSize: '42px', fontWeight: '700', marginBottom: '4px' }}>{institutionStats.approvedThisMonth}</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>{institutionStats.rejectedThisMonth} rejected</div>
        </div>
      </div>

      {/* Department Performance */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '32px' }}>
          <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: '#111827' }}>Department Performance & Leave Analytics</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Department</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Coordinator</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Faculty Count</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>On Leave</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Avg. Leave Days</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Utilization</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dept: 'Computer Applications', coord: 'Amit Bora', count: 12, onLeave: 2, avg: 11.5, util: 76 },
                  { dept: 'Computer Science', coord: 'Priya Sharma', count: 15, onLeave: 3, avg: 13.2, util: 88 },
                  { dept: 'Information Technology', coord: 'Rahul Kumar', count: 10, onLeave: 1, avg: 10.8, util: 72 },
                  { dept: 'Electronics', coord: 'Sneha Patel', count: 8, onLeave: 2, avg: 14.5, util: 97 }
                ].map((dept, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '18px 14px', fontWeight: '600', color: '#111827', fontSize: '15px' }}>{dept.dept}</td>
                    <td style={{ padding: '18px 14px', color: '#6b7280', fontSize: '14px' }}>{dept.coord}</td>
                    <td style={{ padding: '18px 14px', fontSize: '14px' }}>{dept.count}</td>
                    <td style={{ padding: '18px 14px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: dept.onLeave > 2 ? '#fee2e2' : '#dcfce7',
                        color: dept.onLeave > 2 ? '#dc2626' : '#16a34a'
                      }}>{dept.onLeave}</span>
                    </td>
                    <td style={{ padding: '18px 14px', fontWeight: '600', fontSize: '14px' }}>{dept.avg} days</td>
                    <td style={{ padding: '18px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          flex: 1, 
                          height: '8px', 
                          background: '#e5e7eb', 
                          borderRadius: '4px', 
                          overflow: 'hidden',
                          maxWidth: '100px'
                        }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${dept.util}%`,
                            background: dept.util > 90 ? '#ef4444' : dept.util > 75 ? '#f59e0b' : '#10b981',
                            transition: 'width 0.3s'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{dept.util}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '18px 14px' }}>
                      <span style={{
                        padding: '5px 12px',
                        borderRadius: '14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: dept.util > 90 ? '#fee2e2' : '#dcfce7',
                        color: dept.util > 90 ? '#dc2626' : '#16a34a'
                      }}>{dept.util > 90 ? 'High' : 'Normal'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* High Priority Approvals */}
      <div>
        <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 26, margin: 0, color: '#111827', fontWeight: '700' }}>High Priority Approvals</h3>
            <span style={{
              padding: '6px 14px',
              background: '#fef3c7',
              color: '#f59e0b',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700'
            }}>
              {institutionStats.pendingApprovals} Pending
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600' }}>Faculty Name</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600' }}>Department</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600' }}>Leave Type</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600' }}>Duration</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600' }}>Reason</th>
                  <th style={{ padding: '14px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', background: '#f9fafb', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { faculty: 'Dr. Anand Verma', dept: 'Computer Science', type: 'Medical Leave', duration: '10-15 Nov (5 days)', reason: 'Medical emergency' },
                  { faculty: user?.fullName || user?.name || 'Faculty Member', dept: user?.department || 'Department', type: 'Personal Leave', duration: '12 Nov (1 day)', reason: 'Personal work' },
                  { faculty: 'Dr. Meera Singh', dept: 'IT', type: 'Conference', duration: '18-20 Nov (3 days)', reason: 'International conference' }
                ].map((req, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '18px 14px', fontWeight: '600', fontSize: '15px', color: '#111827' }}>{req.faculty}</td>
                    <td style={{ padding: '18px 14px', color: '#6b7280' }}>{req.dept}</td>
                    <td style={{ padding: '18px 14px' }}>
                      <span style={{
                        padding: '5px 12px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: '#dbeafe',
                        color: '#2563eb'
                      }}>{req.type}</span>
                    </td>
                    <td style={{ padding: '18px 14px', fontSize: '14px', fontWeight: '500' }}>{req.duration}</td>
                    <td style={{ padding: '18px 14px', color: '#6b7280', fontSize: '14px' }}>{req.reason}</td>
                    <td style={{ padding: '18px 14px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          padding: '8px 16px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >✓ Approve</button>
                        <button style={{
                          padding: '8px 16px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >✗ Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
