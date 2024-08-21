export async function fetchEmails() {
  try {
    const response = await fetch('/api/run_script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ scriptName: 'fetch_emails.py' })
    });

    const result = await response.json();

    if (response.ok) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    throw new Error(`Failed to fetch emails: ${error.message}`);
  }
}
