import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createLeaveRequest, getLeaveRequests } from '../utils/api-auth';

const leaveTypes = [
  { id: 'casual', name: 'Casual Leave', icon: '☀️', color: '#F59E0B', available: 6 },
  { id: 'sick', name: 'Sick Leave', icon: '🤒', color: '#8B5CF6', available: 3 },
  { id: 'earned', name: 'Earned Leave', icon: '🎯', color: '#EF4444', available: 10.42 },
  { id: 'marriage', name: 'Marriage Leave', icon: '💑', color: '#10B981', available: 5 },
];

export default function LeaveRequest() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    leaveType: '',
    reason: '',
    startDate: '',
    endDate: '',
    halfDay: false,
    emergencyContact: '',
    attachments: null
  });
  
  const [selectedLeaveInfo, setSelectedLeaveInfo] = useState(null);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Load recent leave requests from database
  useEffect(() => {
    loadRecentRequests();
  }, []);

  const loadRecentRequests = async () => {
    try {
      setLoadingRequests(true);
      const leaves = await getLeaveRequests();
      // Sort by date and take last 5
      const sorted = leaves.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      setRecentRequests(sorted);
    } catch (error) {
      console.error('Error loading leave requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCalculatedDays(formData.halfDay ? 0.5 : diffDays);
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate, formData.halfDay]);

  // Update selected leave info
  useEffect(() => {
    if (formData.leaveType) {
      const info = leaveTypes.find(type => type.id === formData.leaveType);
      setSelectedLeaveInfo(info);
    } else {
      setSelectedLeaveInfo(null);
    }
  }, [formData.leaveType]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type';
    if (!formData.reason.trim()) newErrors.reason = 'Please provide a reason';
    if (!formData.startDate) newErrors.startDate = 'Please select start date';
    if (!formData.endDate) newErrors.endDate = 'Please select end date';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (calculatedDays > (selectedLeaveInfo?.available || 0)) {
      newErrors.days = `Insufficient balance. Available: ${selectedLeaveInfo?.available} days`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setSubmitting(true);
        setErrors({});
        
        // Prepare leave request data for API
        // Backend expects: leaveType, startDate, endDate, numberOfDays, reason, attachment (optional)
        const leaveRequestData = {
          leaveType: selectedLeaveInfo.name,
          reason: formData.reason,
          startDate: formData.startDate,
          endDate: formData.endDate,
          numberOfDays: calculatedDays, // Backend expects 'numberOfDays' not 'days'
          attachment: formData.attachment || null
        };

        // Submit to database
        await createLeaveRequest(leaveRequestData);
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
        
        // Reset form
        setFormData({
          leaveType: '',
          reason: '',
          startDate: '',
          endDate: '',
          halfDay: false,
          emergencyContact: '',
          attachments: null
        });
        
        // Reload recent requests
        await loadRecentRequests();
        
      } catch (error) {
        console.error('Error submitting leave request:', error);
        setErrors({ submit: error.message || 'Failed to submit leave request. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    padding: '32px',
    marginBottom: '24px',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '15px',
    background: '#f9fafb',
    color: '#111827',
    transition: 'all 0.3s ease',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#374151',
    fontSize: '14px',
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background */}
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

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 800,
            color: 'white',
            marginBottom: '8px',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            animation: 'slideDown 0.6s ease-out'
          }}>
            📝 New Leave Request
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: '16px',
            fontWeight: 500,
            animation: 'slideDown 0.6s ease-out 0.1s backwards'
          }}>
            Submit your leave application quickly and easily
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            textAlign: 'center',
            padding: '20px',
            animation: 'slideDown 0.3s ease-out',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '32px', marginRight: '12px' }}>✓</span>
            <strong>Leave request submitted successfully! Your request is pending approval.</strong>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            textAlign: 'center',
            padding: '20px',
            animation: 'slideDown 0.3s ease-out',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '32px', marginRight: '12px' }}>⚠️</span>
            <strong>{errors.submit}</strong>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Leave Type Selection Cards */}
          <div style={cardStyle}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '20px',
              color: '#111827'
            }}>
              Select Leave Type
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {leaveTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setFormData(prev => ({ ...prev, leaveType: type.id }))}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: formData.leaveType === type.id ? `3px solid ${type.color}` : '2px solid #e5e7eb',
                    background: formData.leaveType === type.id ? `${type.color}15` : '#f9fafb',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: formData.leaveType === type.id ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = formData.leaveType === type.id ? 'scale(1.05)' : 'scale(1)'}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{type.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#374151', marginBottom: '4px' }}>{type.name}</div>
                  <div style={{ fontSize: '12px', color: type.color, fontWeight: 600 }}>
                    Available: {type.available} days
                  </div>
                </div>
              ))}
            </div>
            {errors.leaveType && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{errors.leaveType}</div>}
          </div>

          {/* Leave Balance Info */}
          <div style={cardStyle}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '20px',
              color: '#111827'
            }}>
              {selectedLeaveInfo ? `${selectedLeaveInfo.icon} ${selectedLeaveInfo.name}` : 'Leave Balance'}
            </h3>
            {selectedLeaveInfo ? (
              <div>
                <div style={{
                  background: `linear-gradient(135deg, ${selectedLeaveInfo.color}20 0%, ${selectedLeaveInfo.color}10 100%)`,
                  padding: '20px',
                  borderRadius: '12px',
                  border: `2px solid ${selectedLeaveInfo.color}40`,
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '48px', fontWeight: 800, color: selectedLeaveInfo.color, marginBottom: '8px' }}>
                    {selectedLeaveInfo.available}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>
                    Days Available
                  </div>
                </div>
                {calculatedDays > 0 && (
                  <div style={{
                    background: '#f9fafb',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>Requesting:</span>
                      <span style={{ fontWeight: 700, color: selectedLeaveInfo.color, fontSize: '16px' }}>{calculatedDays} days</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>Remaining:</span>
                      <span style={{ fontWeight: 700, color: '#111827', fontSize: '16px' }}>
                        {Math.max(0, selectedLeaveInfo.available - calculatedDays)} days
                      </span>
                    </div>
                  </div>
                )}
                {errors.days && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px', fontWeight: 600 }}>⚠️ {errors.days}</div>}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
                <div style={{ fontSize: '14px' }}>Select a leave type to view balance</div>
              </div>
            )}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div style={cardStyle}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '24px',
              color: '#111827'
            }}>
              Leave Details
            </h3>

            {/* Reason */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Reason for Leave *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide a detailed reason for your leave request..."
                rows="4"
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              {errors.reason && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{errors.reason}</div>}
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={inputStyle}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{errors.startDate}</div>}
              </div>
              <div>
                <label style={labelStyle}>End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={inputStyle}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
                {errors.endDate && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{errors.endDate}</div>}
              </div>
            </div>

            {/* Half Day Toggle */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '16px',
                background: formData.halfDay ? '#3b82f620' : '#f9fafb',
                borderRadius: '12px',
                border: formData.halfDay ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="checkbox"
                  name="halfDay"
                  checked={formData.halfDay}
                  onChange={handleChange}
                  style={{ marginRight: '12px', width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 600, color: '#374151' }}>
                  This is a half-day leave request
                </span>
              </label>
            </div>

            {/* Emergency Contact */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Emergency Contact (Optional)</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                style={inputStyle}
              />
            </div>

            {/* Attachments */}
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Supporting Documents (Optional)</label>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                background: '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              onClick={() => document.getElementById('fileInput').click()}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📎</div>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  {formData.attachments ? formData.attachments.name : 'Click to upload or drag and drop'}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                  PDF, DOC, JPG up to 10MB
                </div>
                <input
                  id="fileInput"
                  type="file"
                  name="attachments"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '12px',
                background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                transition: 'all 0.3s ease',
                opacity: submitting ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(59,130,246,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.4)';
                }
              }}
            >
              {submitting ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '8px' }}>⏳</span>
                  Submitting...
                </>
              ) : (
                'Submit Leave Request'
              )}
            </button>
          </div>
        </form>

        {/* Recent Requests */}
        <div style={cardStyle}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '20px',
            color: '#111827'
          }}>
            📋 Recent Leave Requests
          </h3>
          {loadingRequests ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 2s linear infinite' }}>⏳</div>
              <div>Loading requests...</div>
            </div>
          ) : recentRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
              <div>No leave requests yet. Submit your first request above!</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {recentRequests.map((request) => {
                const statusColor = 
                  request.status === 'approved' ? '#10b981' :
                  request.status === 'rejected' ? '#ef4444' :
                  '#f59e0b';
                
                const statusBg = 
                  request.status === 'approved' ? '#10b98120' :
                  request.status === 'rejected' ? '#ef444420' :
                  '#f59e0b20';

                return (
                  <div
                    key={request._id || request.id}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        {request.leaveType}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()} ({request.days} {request.days === 1 ? 'day' : 'days'})
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: statusBg,
                      color: statusColor,
                      textTransform: 'capitalize'
                    }}>
                      {request.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
