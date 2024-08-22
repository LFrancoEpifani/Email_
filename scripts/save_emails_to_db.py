import os
import json
import msal
import mysql.connector
from mysql.connector import Error
import html
from dotenv import load_dotenv
import re
import requests
from datetime import datetime

load_dotenv()

def slugify(str_):
    slug = re.sub(r"[^A-z0-9-]", "_", str_)
    return slug

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

def convert_datetime_format(dt_str):
    try:
        
        dt = datetime.strptime(dt_str, '%Y-%m-%dT%H:%M:%SZ')
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except ValueError as e:
        print(f"Error converting datetime: {e}")
        return None

def save_email_to_db(connection, mail):
    try:
        cursor = connection.cursor()
        sql = """
        INSERT INTO email (emlMessageId, emlFrom, emlSubject, emlDate, automaticComments)
        VALUES (%s, %s, %s, %s, %s)
        """
        eml_date = convert_datetime_format(mail["receivedDateTime"])
        if eml_date:
            values = (
                mail["id"],  
                mail["from"]["emailAddress"]["address"],
                mail["subject"],
                eml_date,  
                html.unescape(mail["body"]["content"])
            )
            cursor.execute(sql, values)
            connection.commit()
        else:
            print(f"Skipped email due to date conversion error: {mail['subject']}")
    except Error as e:
        print(f"Error saving email to database: {e}")
    finally:
        if cursor:
            cursor.close()

def main():
   
    script_dir = os.path.dirname(__file__)
    config_path = os.path.join(script_dir, 'parameters.json')
    
    
    config = json.load(open(config_path))

    app = msal.ConfidentialClientApplication(
        config["client_id"],
        authority=config["authority"],
        client_credential=config["secret"],
    )

    result = app.acquire_token_silent(config["scope"], account=None)

    if not result:
        print("No suitable token exists in cache. Let's get a new one from AAD.")
        result = app.acquire_token_for_client(scopes=config["scope"])

    if "access_token" in result:
        response = requests.get(
            config["endpoint"] + "/mobile@Paxis.org/messages?$top=15",
            headers={"Authorization": "Bearer " + result["access_token"]}
        )

        if response.status_code == 200:
            graph_data = response.json()
            connection = create_db_connection()

            if connection:
                for mail in graph_data["value"]:
                    save_email_to_db(connection, mail)
                connection.close()
            else:
                print("Failed to connect to the database.")
        else:
            print("Failed to retrieve emails:", response.status_code, response.text)
    else:
        print(result.get("error"))
        print(result.get("error_description"))
        print(result.get("correlation_id"))

if __name__ == "__main__":
    main()
