import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar({open, onClose}){
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
      onClose()
    }
  }

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'Faculty'
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <aside
      className="sidebar"
      style={{
        position: 'fixed',
        top: 0,
        left: open ? 0 : -260,
        height: '100vh',
        width: '260px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '24px',
        transition: 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        borderRight: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        background: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.25)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
        e.currentTarget.style.transform = 'scale(1.02)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
        e.currentTarget.style.transform = 'scale(1)'
      }}>
        <img 
          src={user?.profileImage || "https://i.pravatar.cc/80?img=12"} 
          alt="Profile"
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            objectFit: 'cover'
          }}
        />
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{
            fontWeight: 800, 
            color: 'white', 
            fontSize: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {user?.name || 'User'}
          </div>
          <div style={{
            fontSize: 11, 
            opacity: 0.9, 
            color: 'rgba(255,255,255,0.8)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {formatRole(user?.role)}
          </div>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 22,
            cursor: 'pointer',
            display: 'none',
          }}
          className="sidebar-close-btn"
          aria-label="Close sidebar"
        >×</button>
      </div>
      {/* Close button for sidebar */}
      {open && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 25,
            right: 18,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 24,
            cursor: 'pointer',
            zIndex: 102,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
            e.currentTarget.style.transform = 'rotate(90deg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.transform = 'rotate(0deg)'
          }}
          aria-label="Close sidebar"
        >×</button>
      )}
      <div className="nav-section">
        <NavLink to="/dashboard" className={({isActive})=> isActive? 'active':''} style={({isActive}) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 10,
          textDecoration: 'none',
          color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
          background: isActive ? 'linear-gradient(135deg, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.8) 100%)' : 'transparent',
          fontWeight: isActive ? 700 : 500,
          transition: 'all 0.3s ease',
          border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
          boxShadow: isActive ? '0 4px 12px rgba(102,126,234,0.3)' : 'none'
        })}>
          <span className="icon" style={{fontSize: 20}}>🏠</span>
          Dashboard
        </NavLink>
        <NavLink to="/profile" className={({isActive})=> isActive? 'active':''} style={({isActive}) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 10,
          textDecoration: 'none',
          color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
          background: isActive ? 'linear-gradient(135deg, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.8) 100%)' : 'transparent',
          fontWeight: isActive ? 700 : 500,
          transition: 'all 0.3s ease',
          border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
          boxShadow: isActive ? '0 4px 12px rgba(102,126,234,0.3)' : 'none'
        })}>
          <span className="icon" style={{fontSize: 20}}>👤</span>
          Profile
        </NavLink>
        <NavLink to="/leave-request" className={({isActive})=> isActive? 'active':''} style={({isActive}) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 10,
          textDecoration: 'none',
          color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
          background: isActive ? 'linear-gradient(135deg, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.8) 100%)' : 'transparent',
          fontWeight: isActive ? 700 : 500,
          transition: 'all 0.3s ease',
          border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
          boxShadow: isActive ? '0 4px 12px rgba(102,126,234,0.3)' : 'none'
        })}>
          <span className="icon" style={{fontSize: 20}}>📄</span>
          Leave Requests
        </NavLink>
        <NavLink to="/leave-balance" className={({isActive})=> isActive? 'active':''} style={({isActive}) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 10,
          textDecoration: 'none',
          color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
          background: isActive ? 'linear-gradient(135deg, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.8) 100%)' : 'transparent',
          fontWeight: isActive ? 700 : 500,
          transition: 'all 0.3s ease',
          border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
          boxShadow: isActive ? '0 4px 12px rgba(102,126,234,0.3)' : 'none'
        })}>
          <span className="icon" style={{fontSize: 20}}>📊</span>
          Leave Balance
        </NavLink>
        <NavLink to="/holidays" className={({isActive})=> isActive? 'active':''} style={({isActive}) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 10,
          textDecoration: 'none',
          color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
          background: isActive ? 'linear-gradient(135deg, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.8) 100%)' : 'transparent',
          fontWeight: isActive ? 700 : 500,
          transition: 'all 0.3s ease',
          border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
          boxShadow: isActive ? '0 4px 12px rgba(102,126,234,0.3)' : 'none'
        })}>
          <span className="icon" style={{fontSize: 20}}>📅</span>
          Holidays
        </NavLink>
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 10,
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.8)',
            background: 'transparent',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            border: '1px solid transparent',
            marginTop: 'auto',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(220,53,69,0.2)'
            e.currentTarget.style.color = '#ff6b6b'
            e.currentTarget.style.borderColor = 'rgba(220,53,69,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
            e.currentTarget.style.borderColor = 'transparent'
          }}>
          <span className="icon" style={{fontSize: 20}}>⏻</span>
          Logout
        </button>
      </div>
    </aside>
  )
}
