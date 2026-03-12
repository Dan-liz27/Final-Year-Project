"""
Database migration script to add onboarding fields to user_profiles table.
Run this script if you're upgrading from an older version without onboarding fields.
"""

import sqlite3
import os

# Database path
DB_PATH = "skin_classifier.db"

def migrate_database():
    """Add onboarding_completed and onboarding_completed_at columns to user_profiles table"""
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at {DB_PATH}")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(user_profiles)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'onboarding_completed' in columns:
            print("✅ onboarding_completed column already exists")
        else:
            print("Adding onboarding_completed column...")
            cursor.execute("""
                ALTER TABLE user_profiles 
                ADD COLUMN onboarding_completed BOOLEAN DEFAULT 0
            """)
            print("✅ Added onboarding_completed column")
        
        if 'onboarding_completed_at' in columns:
            print("✅ onboarding_completed_at column already exists")
        else:
            print("Adding onboarding_completed_at column...")
            cursor.execute("""
                ALTER TABLE user_profiles 
                ADD COLUMN onboarding_completed_at DATETIME
            """)
            print("✅ Added onboarding_completed_at column")
        
        conn.commit()
        print("\n🎉 Migration completed successfully!")
        
    except sqlite3.Error as e:
        print(f"❌ Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔄 Starting database migration...\n")
    migrate_database()
