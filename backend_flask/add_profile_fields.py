"""
Migration script to add new profile fields to users table
Run this script to add qualification, specialization, gender, and joining_date columns
"""
from app import app, db
from sqlalchemy import text

def add_profile_fields():
    with app.app_context():
        try:
            print("Adding new profile fields to users table...")
            
            # Check if columns already exist
            result = db.session.execute(text("SHOW COLUMNS FROM users LIKE 'qualification'"))
            if result.fetchone():
                print("✓ Column 'qualification' already exists")
            else:
                db.session.execute(text("ALTER TABLE users ADD COLUMN qualification VARCHAR(100)"))
                print("✓ Added column 'qualification'")
            
            result = db.session.execute(text("SHOW COLUMNS FROM users LIKE 'specialization'"))
            if result.fetchone():
                print("✓ Column 'specialization' already exists")
            else:
                db.session.execute(text("ALTER TABLE users ADD COLUMN specialization VARCHAR(100)"))
                print("✓ Added column 'specialization'")
            
            result = db.session.execute(text("SHOW COLUMNS FROM users LIKE 'gender'"))
            if result.fetchone():
                print("✓ Column 'gender' already exists")
            else:
                db.session.execute(text("ALTER TABLE users ADD COLUMN gender VARCHAR(20)"))
                print("✓ Added column 'gender'")
            
            result = db.session.execute(text("SHOW COLUMNS FROM users LIKE 'joining_date'"))
            if result.fetchone():
                print("✓ Column 'joining_date' already exists")
            else:
                db.session.execute(text("ALTER TABLE users ADD COLUMN joining_date DATE"))
                print("✓ Added column 'joining_date'")
            
            db.session.commit()
            print("\n✅ Migration completed successfully!")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Migration failed: {str(e)}")
            raise

if __name__ == '__main__':
    add_profile_fields()
