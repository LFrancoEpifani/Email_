<script>
  import { format, isToday } from 'date-fns';
  import ExpandableText from './ExpandableText.svelte';
  import { onMount } from 'svelte';
  import { selectedEmails, selectedCheckboxes, selectedTag, searchQuery, notesStore, loadNotes, addNoteToEmail, deleteNoteFromEmail } from '../store/store.js';
  
  let errorMessage = '';
  let tableElement;
  let emails = [];
  let isDateAsc = false;
  let openNoteDropdown = {}; 
  export let handleAnalyzeEmail = [];
  let noteInput = '';

  onMount(() => {
    if (localStorage.getItem("isDateAsc") !== null) {
      isDateAsc = JSON.parse(localStorage.getItem("isDateAsc"));
    }
    fetchEmails(); 
    if (tableElement) tableElement.classList.remove('hidden');
    emails.forEach(email => loadNotes(email.id)); 
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
      emails = [];
    }
  }

  function toggleDropdown(emailId) {
    openNoteDropdown[emailId] = !openNoteDropdown[emailId];
    if (openNoteDropdown[emailId]) {
      loadNotes(emailId); 
    }
  }

  async function handleAddNote(emailId, noteInput) {
    if (noteInput.trim() !== '') {
      await addNoteToEmail(emailId, noteInput.trim());
      noteInput = '';
    }
  }

  async function handleDeleteNote(emailId, noteId) {
    await deleteNoteFromEmail(emailId, noteId);
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
      TechRequest: 'bg-purple-100 text-purple-800 border-purple-300',
      Certificate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Forwarded: 'bg-green-100 text-green-800 border-green-300',
      Registration: 'bg-orange-100 text-orange-800 border-orange-300'
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

<main class="h-full w-full overflow-hidden bg-white dark:bg-black text-black dark:text-white">
  <div class="hidden md:block overflow-y-auto h-full w-full">
    <table class="bg-white dark:bg-gray-900 w-full hidden" bind:this={tableElement}>
      <thead class="text-black dark:text-white dark:bg-[#1C1E21] border-b border-gray-300 dark:border-gray-700 bg-[#F3F4F6]">
        <tr class="text-[17px]">
          <th class="p-3"><input type="checkbox" on:change={toggleAllCheckboxSelections} class="cursor-pointer"></th>
          <th class="w-2/12 p-3 text-left">From</th>
          <th class="w-3/12 p-3 text-left">Subject</th>
          <th class="w-3/12 p-3 text-left">Text</th>
          <th class="w-2/12 p-3 text-left">Tags</th>
          <th class="w-1/12 p-3 text-left">
            <div class="flex items-center cursor-pointer">
              Date
              <button on:click={toggleDateSort} class="ml-2 focus:outline-none">
                <i class={`fa-solid text-sm text-gray-800 dark:text-white ${isDateAsc ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>
            </div>
          </th>
          <th class="w-2/12 p-3 text-left">Notes</th>
          <th class="w-2/12 p-3 text-left"></th>
        </tr>
      </thead>
      <tbody class="text-gray-700 dark:text-gray-300">
        {#if sortedEmails.length > 0}
          {#each sortedEmails as email}
            <tr class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 hover:dark:bg-gray-800 transition-all">
              <td class="p-2"><input type="checkbox" checked={selectedCheckboxIds.includes(email.id)} on:change={() => toggleCheckboxSelection(email.id)} class="cursor-pointer"></td>
              <td class="text-[15px] font-bold px-2 truncate">{email.emlFrom}</td>
              <td class="text-[16px] font-medium text-black dark:text-white px-2 truncate">{email.emlSubject}</td>
              <td class="text-[14px] py-2 truncate"><ExpandableText text={email.automaticComments} maxLength={60} /></td>
              <td class="px-2">{#each (email.manualTags && email.manualTags.length > 0 ? email.manualTags.split(',') : []) as tag}<span class="p-1.5 text-xs border m-1 rounded-sm {getTagStyles(tag)}">{tag}</span>{/each}</td>
              <td class="px-4 text-sm font-bold">{formatDate(email.emlDate)}</td>
              <td class="px-2">
                <div class="relative">
                  <input 
                    class="text-sm w-[140px] border-b py-2 border-gray-300 bg-transparent focus:outline-none dark:border-gray-700" 
                    type="text" 
                    placeholder="Add a note..." 
                    bind:this={noteInput}
                    on:keydown={(e) => { if (e.key === 'Enter') { handleAddNote(email.id, e.target.value); e.target.value=''; } }}
                  />
                  <button 
                    class="absolute right-0 top-0 mt-1 mr-2"
                    on:click={() => toggleDropdown(email.id)}
                  >
                    <i class="text-xs fa-solid fa-chevron-down"></i>
                  </button>
                  {#if openNoteDropdown[email.id]}
                    <ul class="text-sm absolute bg-white rounded-lg dark:bg-gray-900 dark:border-gray-700 mt-1 w-full z-10">
                      {#if $notesStore[email.id]}
                        {#each $notesStore[email.id] as note (note.id)}
                          <li class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
                            <ExpandableText text={note.note} maxLength={35} />
                            <button on:click={() => handleDeleteNote(email.id, note.id)} class="text-red-600 hover:text-red-800">
                              <i class="fa-solid fa-trash cursor-pointer"></i>
                            </button>
                          </li>
                        {/each}
                      {:else}
                        <li class="text-gray-500 dark:text-gray-400">No notes available</li>
                      {/if}
                    </ul>
                  {/if}
                </div>
              </td>
              <td class="px-4 py-2"><div class="flex gap-2 text-md items-center"><button class:btn-red={selectedEmailIds.includes(email.id)} on:click={() => toggleFlagSelection(email.id)} class=""><i class="fa-solid fa-flag cursor-pointer"></i></button><button on:click={() => { handleAnalyzeEmail(email.id)}} class="text-gray-400"><i class="fa-solid fa-refresh"></i></button>{#if errorMessage}<p class="error-message text-red-600 mt-2">{errorMessage}</p>{/if}</div></td>
            </tr>
          {/each}
        {:else}
          <tr><td colspan="8" class="text-center p-5 text-gray-500 dark:text-gray-400">No emails found</td></tr>
        {/if}
      </tbody>
    </table>
  </div>

  <div class="block md:hidden overflow-y-auto h-full w-full p-4 space-y-4">
    {#each sortedEmails as email}
      <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
        <div class="flex justify-between items-center">
          <div class="text-[15px] font-bold truncate">{email.emlFrom}</div>
          <div class="text-sm font-bold">{formatDate(email.emlDate)}</div>
        </div>
        <div class="mt-2">
          <div class="text-[16px] font-medium text-black dark:text-white truncate">{email.emlSubject}</div>
          <div class="text-[14px] mt-1 text-gray-600 dark:text-gray-400 truncate">
            <ExpandableText text={email.automaticComments} maxLength={100} />
          </div>
        </div>
        <div class="mt-2 flex flex-wrap gap-1">
          {#each (email.manualTags && email.manualTags.length > 0 ? email.manualTags.split(',') : []) as tag}
            <span class="p-1 text-xs border rounded-sm {getTagStyles(tag)}">{tag}</span>
          {/each}
        </div>
        <div class="mt-2">
          <div class="relative">
            <input 
              class="text-sm w-full border-b py-2 border-gray-300 bg-transparent focus:outline-none dark:border-gray-700" 
              type="text" 
              placeholder="Add a note..."
              bind:this={noteInput}
              on:keydown={(e) => { if (e.key === 'Enter') { handleAddNote(email.id, e.target.value); e.target.value=''; } }}
            />
            <button 
              class="absolute right-0 top-0 mt-1 mr-2"
              on:click={() => toggleDropdown(email.id)}
            >
              <i class="text-sm fa-solid fa-chevron-down"></i>
            </button>
            {#if openNoteDropdown[email.id]}
              <ul class="absolute bg-whiterounded-lg text-sm dark:bg-gray-900 dark:border-gray-700 mt-1 w-full z-10">
                {#if $notesStore[email.id]}
                  {#each $notesStore[email.id] as note (note.id)}
                    <li class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
                      <ExpandableText text={note.note} maxLength={50} />
                      <button on:click={() => handleDeleteNote(email.id, note.id)} class="text-red-600 hover:text-red-800">
                        <i class="fa-solid fa-trash cursor-pointer"></i>
                      </button>
                    </li>
                  {/each}
                {:else}
                  <li class="p-2 text-gray-500 dark:text-gray-400">No notes available</li>
                {/if}
              </ul>
            {/if}
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <button class:btn-red={selectedEmailIds.includes(email.id)} on:click={() => toggleFlagSelection(email.id)} class="">
            <i class="fa-solid fa-flag cursor-pointer"></i>
          </button>
          <button on:click={() => { handleAnalyzeEmail(email.id)}} class="text-gray-400">
            <i class="fa-solid fa-refresh"></i>
          </button>
        </div>
      </div>
    {/each}
  </div>
</main>
