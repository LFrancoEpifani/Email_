<script>
  import { format, isToday } from 'date-fns';
  import ExpandableText from './ExpandableText.svelte';
  import { onMount } from 'svelte';
  import { selectedEmails, selectedCheckboxes, selectedTag, searchQuery } from '../store/store.js';

  let errorMessage = '';
  let tableElement;
  let notes = {};
  let emails = [];
  let isDateAsc = false;
  let handleAnalyzeEmail = [];

  onMount(() => {
    if (localStorage.getItem("isDateAsc") !== null) {
      isDateAsc = JSON.parse(localStorage.getItem("isDateAsc"));
    }
    fetchEmails(); 
    if (tableElement) tableElement.classList.remove('hidden');
    sortedEmails.forEach(email => fetchNotes(email.id)); 
  });

  $: filteredEmails = emails.filter(email => {
    const matchesTag = $selectedTag ? email.manualTags.includes($selectedTag) : true;
    const matchesQuery = $searchQuery ? email.emlSubject.toLowerCase().includes($searchQuery.toLowerCase()) : true;
    return matchesTag && matchesQuery;
  });

  $: sortedEmails = sortEmailsDate(filteredEmails);

  async function fetchEmails() {
    try {
      const response = await fetch('/emails'); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      emails = data;
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      emails = [];
    }
  }

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
        return new Date(a.emlDate) - new Date(b.emlDate); 
      } else {
        return new Date(b.emlDate) - new Date(a.emlDate); 
      }
    });
  }

  function toggleDateSort() {
    isDateAsc = !isDateAsc;
    localStorage.setItem("isDateAsc", JSON.stringify(isDateAsc));
    sortedEmails = sortEmailsDate(filteredEmails);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'HH:mm a'); 
    }
    return format(date, 'MMM dd');
  }

  function getTagStyles(tag) {
    const styles = {
      TechRequest: 'bg-[#E6E4FB] text-[#463C86] border-[#A79CF1]',
      Certificate: 'bg-[#FBF6D8] text-[#8b7514] border-[#e1cf59]',
      Forwarded: 'bg-[#baf1d6] text-[#2B8E28] border-[#3f976a]',
      Registration: 'bg-[#FFDDCC] text-[#D47528] border-[#F3B180]'
    };
    return styles[tag] || 'bg-gray-300 text-black border-gray-500'; 
  }

  function toggleFlagSelection(id) {
    selectedEmails.update(selected => 
      selected.includes(id) ? selected.filter(emailId => emailId !== id) : [...selected, id]
    );
  }

  function toggleCheckboxSelection(id) {
    selectedCheckboxes.update(selected => 
      selected.includes(id) ? selected.filter(emailId => emailId !== id) : [...selected, id]
    );
  }

  function toggleAllCheckboxSelections(event) {
    const isChecked = event.target.checked;
    selectedCheckboxes.update(() => isChecked ? sortedEmails.map(email => email.id) : []);
  }

  $: selectedCheckboxIds = $selectedCheckboxes;
  $: selectedEmailIds = $selectedEmails;

</script>
<main class="h-full w-full overflow-hidden">
  <div class="overflow-y-auto h-full w-full ">
    <table class="bg-white dark:bg-[#212121] w-full hidden" bind:this={tableElement}>
      <thead class="text-black dark:text-white border-b border-black dark:border-white w-auto">
        <tr class="text-[17px]">
          <th class=""> 
            <input type="checkbox" on:change={toggleAllCheckboxSelections}>
          </th>
          <th class="w-2/12 p-3 text-left">From</th>
          <th class="w-3/12 p-3 text-left">Subject</th>
          <th class="w-3/12 p-3 text-left">Text</th>
          <th class="w-2/12 p-3 text-left">Tags</th>
          <th class="w-1/12 p-3 text-left">
            <div class="flex items-center">
              Date
              <button on:click={toggleDateSort} class="ml-2 focus:outline-none">
                <i class={`fa-solid text-sm text-gray-800 dark:text-white ${isDateAsc ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>
            </div>
          </th>
          <th class="w-1/12 p-3 text-left">Notes</th>
          <th class="w-2/12 p-3 text-left"></th>
        </tr>
      </thead>
      <tbody class="text-gray-700 dark:text-white">
        {#if sortedEmails.length > 0}
          {#each sortedEmails as email}
            <tr class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 hover:dark:bg-gray-700">
              <td class="p-2">
                <input class="" type="checkbox" checked={selectedCheckboxIds.includes(email.id)} on:change={() => toggleCheckboxSelection(email.id)}>
              </td>
              <td class="text-[15px] font-bold px-2">{email.emlFrom}</td>
              <td class="text-[16px] font-medium text-[#000000] dark:text-[#FFFFFF] px-2">{email.emlSubject}</td>
              <td class="text-[14px] py-2">
                <ExpandableText text={email.automaticComments} maxLength={60} />
              </td>
              <td class="">
                {#each (email.manualTags && email.manualTags.length > 0 ? email.manualTags.split(',') : []) as tag}
                  <span class="p-1.5 text-sm border m-2 rounded-sm {getTagStyles(tag)}">{tag}</span>
                {/each}
              </td>
              <td class="px-4 text-sm font-bold">{formatDate(email.emlDate)}</td>
              <td class="">
                <input 
                  class="text-lg w-[180px] p-2 border-b border-gray-300 bg-transparent focus:outline-none dark:border-gray-700" 
                  type="text" 
                  on:keydown={(e) => { if (e.key === 'Enter' && e.target.value.trim() !== '') { addNoteToEmail(email.id, e.target.value.trim()); e.target.value=''; } }}
                />
                <ul>
                  {#if notes[email.id]}
                    {#each notes[email.id] as note (note.id)}
                      <li class="flex m-3 gap-3 items-start">
                        <ExpandableText text={note.note} maxLength={35} />
                        <button on:click={() => deleteNoteFromEmail(email.id, note.id)}>
                          <i class="fa-solid fa-trash cursor-pointer"></i>
                        </button>
                      </li>
                    {/each}
                  {/if}
                </ul>
              </td>
              <td class="px-4 py-2">
                <div class="flex gap-2 text-md items-center">
                  <button class:btn-red={selectedEmailIds.includes(email.id)} on:click={() => toggleFlagSelection(email.id)}>
                    <i class="fa-solid fa-flag cursor-pointer"></i>
                  </button>
                  <button  on:click={() => { handleAnalyzeEmail(email.id)}} class="">
                    <i class="fa-solid fa-refresh"></i>
                  </button>
                  {#if errorMessage}
                    <p class="error-message">{errorMessage}</p>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="8" class="text-center p-5">No emails found</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</main>

<style>

</style>
