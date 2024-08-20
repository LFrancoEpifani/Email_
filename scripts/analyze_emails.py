import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import sys 

load_dotenv()

def create_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASS'),
            database=os.getenv('DB_NAME')
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to database: {e}")
        return None

def fetch_email_by_id(connection, email_id):
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM email WHERE id = %s', (email_id,))
        return cursor.fetchone()
    except Error as e:
        print(f"Error fetching email: {e}")
        return None
    finally:
        if cursor:
            cursor.close()

def analyze_email_comments(email):
    tags = email['manualTags'].split(',') if email['manualTags'] else []
    comments = email['automaticComments'].lower() if email['automaticComments'] else ''

    rules = {
        'techrequest': 'TechRequest',
        'certificate': 'Certificate',
        'forwarded': 'Forwarded',
        'registration': 'Registration'
    }

    updated = False
    for keyword, tag in rules.items():
        if keyword in comments and tag not in tags:
            tags.append(tag)
            updated = True

    return tags if updated else None

def update_email_tags(connection, email_id, tags):
    try:
        cursor = connection.cursor()
        cursor.execute(
            'UPDATE email SET manualTags = %s WHERE id = %s',
            (','.join(tags), email_id)
        )
        connection.commit()
    except Error as e:
        print(f"Error updating email tags for email_id {email_id}: {e}")
    finally:
        if cursor:
            cursor.close()

def analyze_email(email_id):
    connection = create_db_connection()
    if connection:
        email = fetch_email_by_id(connection, email_id)
        if email:
            new_tags = analyze_email_comments(email)
            if new_tags:
                update_email_tags(connection, email_id, new_tags)
                print(f"Email ID {email_id} updated with tags: {new_tags}")
            else:
                print(f"No changes for Email ID {email_id}")
        else:
            print(f"Email ID {email_id} not found.")
        connection.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        email_id = sys.argv[1]
        analyze_email(email_id)
    else:
        print("No email ID provided.")