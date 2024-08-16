import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import subprocess

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

def fetch_emails(connection):
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM email')
        return cursor.fetchall()

    except Error as e:
        print(f"Error fetching emails: {e}")
        return []

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

def run_current_script():
    python_exe = os.getenv('PYTHON_EXE')
    script_path = __file__  


    if os.getenv('RUNNING_SCRIPT') == '1':
        print("Script already running, avoiding recursion.")
        return

    print(f"Ejecutable de Python: {python_exe}")
    print(f"Ejecutando el script: {script_path}")

    try:
       
        os.environ['RUNNING_SCRIPT'] = '1'
        subprocess.run(f"{python_exe} {script_path}", shell=True, check=True, text=True, encoding='utf-8')
    except subprocess.CalledProcessError as e:
        print(f"Error executing script: {e}")

def analyze_emails():
    connection = create_db_connection()
    if connection:
        emails = fetch_emails(connection)
        for email in emails:
            new_tags = analyze_email_comments(email)
            if new_tags:
                update_email_tags(connection, email['id'], new_tags)
        connection.close()

if __name__ == "__main__":
    analyze_emails()
   
