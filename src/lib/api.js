export async function fetchEmails() {
  try {
    const response = await fetch('/emails'); 

    if (!response.ok) {
      throw new Error(`Failed to fetch emails: ${response.statusText}`);
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    throw new Error(`Failed to fetch emails: ${error.message}`);
  }
}
