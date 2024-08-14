<script>
  import { format, isToday, isThisWeek, isYesterday } from 'date-fns';
  import ExpandableText from './ExpandableText.svelte';
  import { onMount } from 'svelte';
  import { selectedEmails } from '../store/store.js';
  
  export let handleAnalyzeEmails;
  let errorMessage = '';
  export let data = { data: [] }; 
  let tableElement;
  let notes = {};

  let isDateAsc = false; // Estado para controlar el orden de la fecha

  async function fetchNotes(emailId) {
    try {
      const response = await fetch(`/api/notes?emailId=${emailId}`);
      const result = await response.json();
      notes = {
        ...notes,
        [emailId]: result.notes || []
      };
    } catch (error) {
      console.error(`Error fetching notes for emailId ${emailId}:`, error);
    }
  }

  async function addNoteToEmail(emailId, note) {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId, note })
      });
      const result = await response.json();
      if (result.success) {
        notes = {
          ...notes,
          [emailId]: [...(notes[emailId] || []), result.note]
        };
      }
    } catch (error) {
      console.error(`Error adding note to emailId ${emailId}:`, error);
    }
  }

  async function deleteNoteFromEmail(emailId, noteId) {
    try {
      const response = await fetch(`/api/notes?noteId=${noteId}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        notes = {
          ...notes,
          [emailId]: notes[emailId].filter(note => note.id !== noteId)
        };
      }
    } catch (error) {
      console.error(`Error deleting note from emailId ${emailId}:`, error);
    }
  }

  function sortEmailsDate(emails) {
    return emails.sort((a, b) => {
      if (isDateAsc) {
        return new Date(a.emlDate) - new Date(b.emlDate); // Ascendente
      } else {
        return new Date(b.emlDate) - new Date(a.emlDate); // Descendente
      }
    });
  }

  function toggleDateSort() {
    isDateAsc = !isDateAsc;
    sortedEmails = sortEmailsDate(data.data || []);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isToday(date)) return `Today ${format(date, 'HH:mm')}`;
    if (isYesterday(date)) return `Yesterday ${format(date, 'HH:mm')}`;
    if (isThisWeek(date)) return format(date, 'EEEE HH:mm');
    return format(date, 'MMM dd');
  }

  function getTagStyles(tag) {
    const styles = {
      TechRequest: 'bg-[#E6E4FB] text-[#463C86] border-[#A79CF1]',
      Certificate: 'bg-[#FBF6D8] text-[#C2A520] border-[#EBD968]',
      Forwarded: 'bg-[#a4e5c6] text-[#2B8E28] border-[#DCF7E9]',
      Registration: 'bg-[#FFDDCC] text-[#D47528] border-[#F3B180]'
    };
    return styles[tag] || 'bg-gray-300 text-black border-gray-500'; 
  }

  let sortedEmails = data && data.data ? sortEmailsDate(data.data) : []; 

  function toggleEmailSelection(id) {
    selectedEmails.update(selected => selected.includes(id) ? selected.filter(emailId => emailId !== id) : [...selected, id]);
  }

  $: selectedEmailIds = $selectedEmails;

  onMount(() => {
    if (tableElement) tableElement.classList.remove('hidden');
    sortedEmails.forEach(email => fetchNotes(email.id));
  });
</script>

<main class="h-full w-full overflow-hidden">
  <div class="overflow-y-auto h-full w-full ">
    <table class="bg-white dark:bg-gradient-to-b from-[#083153] to-[#082038] w-full hidden rounded-lg" bind:this={tableElement}>
      <thead class="text-black dark:text-white border-b w-auto">
        <tr class="text-xl">
          <th class="w-2/12 p-4 text-left">From</th>
          <th class="w-3/12 p-4 text-left">Subject</th>
          <th class="w-3/12 p-4 text-left">Text</th>
          <th class="w-2/12 p-4 text-left">Tags</th>
          <th class="w-1/12 p-4 text-left">
            <div class="flex items-center">
              Date
              <button on:click={toggleDateSort} class="ml-2 focus:outline-none">
                <i class={`fa-solid ${isDateAsc ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
              </button>
            </div>
          </th>
          <th class="w-1/12 p-4 text-left">Notes</th>
          <th class="w-1/12 p-4 text-left"></th>
        </tr>
      </thead>
      <tbody class="text-gray-700 dark:text-white">
        {#each sortedEmails as email}
          <tr class="border-b border-gray-200 hover:bg-gray-100 hover:dark:bg-gray-700">
            <td class="px-4 py-2 text-lg font-bold">{email.emlFrom}</td>
            <td class="px-4 py-2 text-xl font-regular text-[#4b89f4]">{email.emlSubject}</td>
            <td class="px-4 py-2 text-lg">
              <ExpandableText text={email.automaticComments} maxLength={35} />
            </td>
            <td class="px-4 py-2">
              {#each email.manualTags.split(',') as tag}
                <span class="tag {getTagStyles(tag)}">{tag}</span>
              {/each}
            </td>
            <td class="px-4 py-2 text-lg">{formatDate(email.emlDate)}</td>
            <td class="px-4 py-2">
              <input 
                class="p-2 mx-3 border-b border-gray-300 bg-transparent focus:outline-none dark:border-gray-700" 
                type="text" 
                on:keydown={(e) => { if (e.key === 'Enter' && e.target.value.trim() !== '') { addNoteToEmail(email.id, e.target.value.trim()); e.target.value=''; } }}
              />
              <ul>
                {#if notes[email.id]}
                  {#each notes[email.id] as note (note.id)}
                    <li class="flex m-3 gap-3">
                      <p>{note.note}</p>
                      <button on:click={() => deleteNoteFromEmail(email.id, note.id)}>
                        <i class="fa-solid fa-trash cursor-pointer"></i>
                      </button>
                    </li>
                  {/each}
                {/if}
              </ul>
            </td>
            <td class="px-4 py-2">
              <div class="flex gap-2 text-xl items-center">
                <button class:btn-red={selectedEmailIds.includes(email.id)} on:click={() => toggleEmailSelection(email.id)}>
                  <i class="fa-solid fa-flag cursor-pointer"></i>
                </button>
                <button on:click="{handleAnalyzeEmails}" class="">
                  <i class="fa-solid fa-refresh"></i>
                </button>
                {#if errorMessage}
                  <p class="error-message">{errorMessage}</p>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>

<style>
  .inbox {
    padding: 1rem;
  }

  .inbox-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .email-list {
    margin-top: 1rem;
    list-style-type: none;
    padding: 0;
  }

  .email-item {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .tag {
    display: inline-block;
    margin-right: 0.5rem;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    border: 1px solid;
  }

  .error-message {
    color: red;
    margin-bottom: 1rem;
  }
</style>
