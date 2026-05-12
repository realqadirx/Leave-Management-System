import React, { useState, useMemo } from 'react'

const holidays2024 = [
  { date: '2024-01-26', name: 'Republic Day', type: 'national', day: 'Friday' },
  { date: '2024-03-08', name: 'Maha Shivaratri', type: 'religious', day: 'Friday' },
  { date: '2024-03-25', name: 'Holi', type: 'religious', day: 'Monday' },
  { date: '2024-03-29', name: 'Good Friday', type: 'religious', day: 'Friday' },
  { date: '2024-04-11', name: 'Eid ul-Fitr', type: 'religious', day: 'Thursday' },
  { date: '2024-04-17', name: 'Ram Navami', type: 'religious', day: 'Wednesday' },
  { date: '2024-04-21', name: 'Mahavir Jayanti', type: 'religious', day: 'Sunday' },
  { date: '2024-05-01', name: 'May Day', type: 'national', day: 'Wednesday' },
  { date: '2024-05-23', name: 'Buddha Purnima', type: 'religious', day: 'Thursday' },
  { date: '2024-06-17', name: 'Eid ul-Adha', type: 'religious', day: 'Monday' },
  { date: '2024-07-17', name: 'Muharram', type: 'religious', day: 'Wednesday' },
  { date: '2024-08-15', name: 'Independence Day', type: 'national', day: 'Thursday' },
  { date: '2024-08-26', name: 'Janmashtami', type: 'religious', day: 'Monday' },
  { date: '2024-09-16', name: 'Milad un-Nabi', type: 'religious', day: 'Monday' },
  { date: '2024-10-02', name: 'Gandhi Jayanti', type: 'national', day: 'Wednesday' },
  { date: '2024-10-12', name: 'Dussehra', type: 'religious', day: 'Saturday' },
  { date: '2024-10-31', name: 'Diwali', type: 'religious', day: 'Thursday' },
  { date: '2024-11-01', name: 'Diwali (Day 2)', type: 'religious', day: 'Friday' },
  { date: '2024-11-15', name: 'Guru Nanak Jayanti', type: 'religious', day: 'Friday' },
  { date: '2024-12-25', name: 'Christmas', type: 'religious', day: 'Wednesday' }
]

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Holidays() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [viewType, setViewType] = useState('calendar') // 'calendar' or 'list'
  const [filterType, setFilterType] = useState('all') // 'all', 'national', 'religious'

  const filteredHolidays = useMemo(() => {
    return holidays2024.filter(holiday => {
      if (filterType === 'all') return true
      return holiday.type === filterType
    })
  }, [filterType])

  const holidaysByMonth = useMemo(() => {
    const grouped = {}
    filteredHolidays.forEach(holiday => {
      const month = new Date(holiday.date).getMonth()
      if (!grouped[month]) grouped[month] = []
      grouped[month].push(holiday)
    })
    return grouped
  }, [filteredHolidays])

  const currentMonthHolidays = holidaysByMonth[selectedMonth] || []
  
  const upcomingHolidays = useMemo(() => {
    const today = new Date()
    return filteredHolidays
      .filter(h => new Date(h.date) >= today)
      .slice(0, 5)
  }, [filteredHolidays])

  const stats = useMemo(() => {
    const total = filteredHolidays.length
    const national = filteredHolidays.filter(h => h.type === 'national').length
    const religious = filteredHolidays.filter(h => h.type === 'religious').length
    const longWeekends = filteredHolidays.filter(h => 
      h.day === 'Monday' || h.day === 'Friday'
    ).length
    return { total, national, religious, longWeekends }
  }, [filteredHolidays])

  const typeColors = {
    national: '#3b82f6',
    religious: '#8b5cf6'
  }

  return (
    <div style={{padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: 'calc(100vh - 64px)'}}>
      {/* Header */}
      <div style={{marginBottom: 32}}>
        <h2 style={{margin: 0, fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 8}}>
          🎉 Holidays 2024
        </h2>
        <div style={{color: 'rgba(255,255,255,0.9)', fontSize: 15}}>
          Plan your year with our comprehensive holiday calendar
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{fontSize: 13, color: '#666', marginBottom: 4}}>Total Holidays</div>
          <div style={{fontSize: 32, fontWeight: 700, color: '#667eea'}}>{stats.total}</div>
        </div>
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{fontSize: 13, color: '#666', marginBottom: 4}}>National</div>
          <div style={{fontSize: 32, fontWeight: 700, color: '#3b82f6'}}>{stats.national}</div>
        </div>
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{fontSize: 13, color: '#666', marginBottom: 4}}>Religious</div>
          <div style={{fontSize: 32, fontWeight: 700, color: '#8b5cf6'}}>{stats.religious}</div>
        </div>
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{fontSize: 13, color: '#666', marginBottom: 4}}>Long Weekends</div>
          <div style={{fontSize: 32, fontWeight: 700, color: '#10b981'}}>{stats.longWeekends}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        background: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'}}>
          <label style={{fontSize: 14, fontWeight: 600, color: '#333'}}>Filter:</label>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: filterType === 'all' ? '#667eea' : '#f1f5f9',
              color: filterType === 'all' ? 'white' : '#64748b',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 13
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('national')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: filterType === 'national' ? '#3b82f6' : '#f1f5f9',
              color: filterType === 'national' ? 'white' : '#64748b',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 13
            }}
          >
            National
          </button>
          <button
            onClick={() => setFilterType('religious')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: filterType === 'religious' ? '#8b5cf6' : '#f1f5f9',
              color: filterType === 'religious' ? 'white' : '#64748b',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 13
            }}
          >
            Religious
          </button>
        </div>

        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          <button
            onClick={() => setViewType('calendar')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: viewType === 'calendar' ? '#667eea' : '#f1f5f9',
              color: viewType === 'calendar' ? 'white' : '#64748b',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 13
            }}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setViewType('list')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: viewType === 'list' ? '#667eea' : '#f1f5f9',
              color: viewType === 'list' ? 'white' : '#64748b',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 13
            }}
          >
            📋 List
          </button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24}}>
        {/* Main Content */}
        <div>
          {viewType === 'calendar' ? (
            <div style={{
              background: 'white',
              padding: 24,
              borderRadius: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {/* Month Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: '2px solid #f1f5f9'
              }}>
                <button
                  onClick={() => setSelectedMonth(prev => (prev === 0 ? 11 : prev - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 24,
                    cursor: 'pointer',
                    color: '#667eea',
                    padding: '4px 12px'
                  }}
                >
                  ‹
                </button>
                <h3 style={{margin: 0, fontSize: 24, fontWeight: 700, color: '#333'}}>
                  {monthNames[selectedMonth]} 2024
                </h3>
                <button
                  onClick={() => setSelectedMonth(prev => (prev === 11 ? 0 : prev + 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 24,
                    cursor: 'pointer',
                    color: '#667eea',
                    padding: '4px 12px'
                  }}
                >
                  ›
                </button>
              </div>

              {/* Holidays for selected month */}
              {currentMonthHolidays.length > 0 ? (
                <div style={{display: 'grid', gap: 12}}>
                  {currentMonthHolidays.map((holiday, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        padding: 20,
                        borderRadius: 12,
                        border: `2px solid ${typeColors[holiday.type]}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(8px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{
                        background: typeColors[holiday.type],
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: 10,
                        textAlign: 'center',
                        minWidth: 70
                      }}>
                        <div style={{fontSize: 24, fontWeight: 700}}>
                          {new Date(holiday.date).getDate()}
                        </div>
                        <div style={{fontSize: 11, opacity: 0.9}}>
                          {monthNames[new Date(holiday.date).getMonth()].slice(0, 3)}
                        </div>
                      </div>
                      <div style={{flex: 1}}>
                        <div style={{fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 4}}>
                          {holiday.name}
                        </div>
                        <div style={{fontSize: 13, color: '#666', display: 'flex', gap: 12}}>
                          <span>{holiday.day}</span>
                          <span>•</span>
                          <span style={{
                            background: `${typeColors[holiday.type]}20`,
                            color: typeColors[holiday.type],
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            {holiday.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: 60,
                  color: '#999',
                  fontSize: 16
                }}>
                  <div style={{fontSize: 48, marginBottom: 16}}>📅</div>
                  No holidays in {monthNames[selectedMonth]}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              background: 'white',
              padding: 24,
              borderRadius: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <h3 style={{margin: '0 0 20px 0', fontSize: 24, fontWeight: 700, color: '#333'}}>
                All Holidays 2024
              </h3>
              <div style={{display: 'grid', gap: 12}}>
                {filteredHolidays.map((holiday, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      padding: 16,
                      borderRadius: 12,
                      border: `2px solid ${typeColors[holiday.type]}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16
                    }}
                  >
                    <div style={{
                      background: typeColors[holiday.type],
                      color: 'white',
                      padding: '10px 14px',
                      borderRadius: 10,
                      textAlign: 'center',
                      minWidth: 70
                    }}>
                      <div style={{fontSize: 20, fontWeight: 700}}>
                        {new Date(holiday.date).getDate()}
                      </div>
                      <div style={{fontSize: 10, opacity: 0.9}}>
                        {monthNames[new Date(holiday.date).getMonth()]}
                      </div>
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 2}}>
                        {holiday.name}
                      </div>
                      <div style={{fontSize: 12, color: '#666'}}>
                        {holiday.day}
                      </div>
                    </div>
                    <div style={{
                      background: `${typeColors[holiday.type]}20`,
                      color: typeColors[holiday.type],
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {holiday.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Upcoming Holidays */}
          <div style={{
            background: 'white',
            padding: 24,
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            marginBottom: 24
          }}>
            <h3 style={{margin: '0 0 16px 0', fontSize: 18, fontWeight: 700, color: '#333'}}>
              🎯 Upcoming Holidays
            </h3>
            <div style={{display: 'grid', gap: 12}}>
              {upcomingHolidays.map((holiday, idx) => (
                <div
                  key={idx}
                  style={{
                    background: `linear-gradient(135deg, ${typeColors[holiday.type]}15 0%, ${typeColors[holiday.type]}05 100%)`,
                    padding: 12,
                    borderRadius: 10,
                    borderLeft: `4px solid ${typeColors[holiday.type]}`
                  }}
                >
                  <div style={{fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 4}}>
                    {holiday.name}
                  </div>
                  <div style={{fontSize: 12, color: '#666'}}>
                    {new Date(holiday.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })} • {holiday.day}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: 24,
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            color: 'white'
          }}>
            <h3 style={{margin: '0 0 16px 0', fontSize: 18, fontWeight: 700}}>
              💡 Did You Know?
            </h3>
            <div style={{fontSize: 14, lineHeight: 1.6, opacity: 0.95}}>
              You have <strong>{stats.longWeekends} long weekends</strong> this year! 
              Perfect opportunities to plan mini-vacations or spend quality time with family.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
