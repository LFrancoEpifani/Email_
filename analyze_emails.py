import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

load_dotenv()

def analyze_emails():
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

            for email in emails:
                new_tags = email['manualTags'].split(',') if email['manualTags'] else []
                updated = False

                comments = email['automaticComments'].lower() if email['automaticComments'] else ''

                if 'techrequest' in comments and 'TechRequest' not in new_tags:
                    new_tags.append('TechRequest')
                    updated = True
                if 'certificate' in comments and 'Certificate' not in new_tags:
                    new_tags.append('Certificate')
                    updated = True
                if 'forwarded' in comments and 'Forwarded' not in new_tags:
                    new_tags.append('Forwarded')
                    updated = True
                if 'registration' in comments and 'Registration' not in new_tags:
                    new_tags.append('Registration')
                    updated = True

                if updated:
                    cursor.execute(
                        'UPDATE email SET manualTags = %s WHERE id = %s',
                        (','.join(new_tags), email['id'])
                    )
            connection.commit()

    except Error as e:
        print(f"Error analyzing emails: {e}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    analyze_emails()
