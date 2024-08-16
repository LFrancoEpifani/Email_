import mysql.connector
from mysql.connector import Error
from datetime import datetime
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
            database=os.getenv('DB_NAME'),
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
        emails = cursor.fetchall()

        for email in emails:
            email = format_email_dates(email)
        return emails

    except Error as e:
        print(f"Error fetching emails: {e}")
        return []

    finally:
        if cursor:
            cursor.close()

def format_email_dates(email):
    for key, value in email.items():
        if isinstance(value, datetime):
            email[key] = value.isoformat()
    return email

def run_current_script():
    python_exe = os.getenv('PYTHON_EXE')
    script_path = __file__  

    try:
        subprocess.run(f"{python_exe} {script_path}", shell=True, check=True, text=True, encoding='utf-8')
    except subprocess.CalledProcessError as e:
        print(f"Error executing script: {e}")

def main():
    connection = create_db_connection()
    if connection:
        emails = fetch_emails(connection)
        connection.close()

if __name__ == "__main__":
    main()

