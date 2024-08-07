import mysql.connector
from mysql.connector import Error
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

def fetch_emails():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASS'),
            database=os.getenv('DB_NAME')
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute('SELECT * FROM email')
            emails = cursor.fetchall()

            # Convert datetime fields to strings
            for email in emails:
                for key, value in email.items():
                    if isinstance(value, datetime):
                        email[key] = value.isoformat()

    except Error as e:
        print(json.dumps({"message": f"Error fetching emails: {e}"}))

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    fetch_emails()
