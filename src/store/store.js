import { writable } from "svelte/store";

function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

export const emails = writable([]);  
export const selectedTag = writable(''); 
export const searchQuery = writable('');
export const notesStore = writable({});

export async function loadNotes(emailId) {
  try {
    const response = await fetch(`/api/notes?emailId=${emailId}`);
    const result = await response.json();
    notesStore.update(notes => ({
      ...notes,
      [emailId]: result.notes || []
    }));
  } catch (error) {
    console.error(`Error loading notes for emailId ${emailId}:`, error);
  }
}

export async function addNoteToEmail(emailId, note) {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailId, note })
    });
    const result = await response.json();
    if (result.success) {
      await loadNotes(emailId); 
    }
  } catch (error) {
    console.error(`Error adding note to emailId ${emailId}:`, error);
  }
}

export async function deleteNoteFromEmail(emailId, noteId) {
  try {
    const response = await fetch(`/api/notes?noteId=${noteId}`, { method: 'DELETE' });
    const result = await response.json();
    if (result.success) {
      await loadNotes(emailId); 
    }
  } catch (error) {
    console.error(`Error deleting note from emailId ${emailId}:`, error);
  }
}

export const selectedEmails = writable(
  isLocalStorageAvailable() ? JSON.parse(localStorage.getItem("selectedEmails")) || [] : []
);

selectedEmails.subscribe(value => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem("selectedEmails", JSON.stringify(value));
  }
});

export const selectedCheckboxes = writable(
  isLocalStorageAvailable() ? JSON.parse(localStorage.getItem("selectedCheckboxes")) || [] : []
);

selectedCheckboxes.subscribe(value => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem("selectedCheckboxes", JSON.stringify(value));
  }
});

export const theme = writable(
  isLocalStorageAvailable() ? localStorage.getItem('theme') || 'light' : 'light'
);

theme.subscribe(value => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem('theme', value);
    document.documentElement.classList.toggle('dark', value === 'dark');
  }
});

let isDateAsc = isLocalStorageAvailable() ? JSON.parse(localStorage.getItem("isDateAsc")) || false : false;

function toggleDateSort() {
  isDateAsc = !isDateAsc;
  localStorage.setItem("isDateAsc", JSON.stringify(isDateAsc));
  sortedEmails = sortEmailsDate(filteredEmails);
}
