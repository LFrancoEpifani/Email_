export async function fetchEmails() {
  try {
    const response = await fetch('/emails');

    if (!response.ok) {
      throw new Error(`Failed to fetch emails: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch emails: ${error.message}`);
  }
}
