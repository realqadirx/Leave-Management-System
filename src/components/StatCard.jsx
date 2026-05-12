import React from 'react'

export default function StatCard({title, value, hint}){
  return (
    <div className="stat-card card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {hint && <div style={{color:'var(--muted)',marginTop:8,fontSize:13}}>{hint}</div>}
    </div>
  )
}
