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