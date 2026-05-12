from flask import Flask, request, jsonify

app = Flask(__name__)

# --- Substitute faculty map ---
substitute_map = {
    '101': 'Prof. Verma',
    '102': 'Dr. Sharma',
    '103': 'Prof. Singh',
    '104': 'Dr. Gupta'
}

# --- AI-style reason scoring function ---
def reason_score(reason: str) -> int:
    reason = (reason or '').lower()
    if any(word in reason for word in ['emergency', 'hospital', 'sick', 'death']):
        return 2  # High severity
    if any(word in reason for word in ['family', 'personal', 'appointment']):
        return 1  # Medium severity
    return 0  # Low severity

# --- AI-style prediction function ---
def predict_leave(leave_type: str, reason: str, duration: int, past_leave: int):
    # Encode leave type simply
    leave_map = {'sick': 0, 'casual': 1, 'annual': 2}
    leave_type_encoded = leave_map.get(leave_type.lower(), 0)

    # Calculate reason score
    reason_score_val = reason_score(reason)

    # AI prediction logic
    if reason_score_val >= 2 or duration > 7:
        approval = 1  # Approved
    else:
        approval = 0  # Rejected

    return approval, leave_type_encoded, reason_score_val

# --- Homepage for testing ---
@app.route('/')
def home():
    return '''
    <h2>Leave Prediction AI Assistant</h2>
    <form method="post" action="/predict">
      Faculty ID: <input name="faculty_id" value="101"><br>
      Leave Type: <input name="leave_type" value="sick"><br>
      Reason: <input name="reason" value="family emergency"><br>
      Duration (days): <input name="duration" value="3"><br>
      Past Leaves: <input name="past_leave" value="1"><br>
      <input type="submit" value="Predict">
    </form>
    '''

# --- Prediction route ---
@app.route('/predict', methods=['POST'])
def predict():
    faculty_id = request.form.get('faculty_id', '').strip()
    leave_type = request.form.get('leave_type', '').strip()
    reason = request.form.get('reason', '').strip()
    try:
        duration = int(request.form.get('duration', 0))
    except ValueError:
        duration = 0
    try:
        past_leave = int(request.form.get('past_leave', 0))
    except ValueError:
        past_leave = 0

    # AI prediction
    result, leave_type_encoded, reason_score_val = predict_leave(
        leave_type, reason, duration, past_leave
    )

    approval_status = 'Approved' if result == 1 else 'Rejected'
    substitute = substitute_map.get(faculty_id) if result == 1 else None

    return jsonify({
        'approval_status': approval_status,
        'substitute_faculty': substitute,
        'reason_score': reason_score_val,
        'leave_type_encoded': leave_type_encoded
    })

# --- Run the app ---
if __name__ == '__main__':
    app.run(debug=True)
