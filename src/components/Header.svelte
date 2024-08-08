<script>
  import { theme } from '../store/store.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  let showDropdown = false;
  let tagFilter = '';

  function applyFilter(tag) {
    tagFilter = tag;
    const params = new URLSearchParams();
    if (tagFilter) {
      params.set('tagFilter', tagFilter);
    }
    window.location.href = `?${params.toString()}`; 
  }

  $: tagFilter = $page.url.searchParams.get('tagFilter') || '';
</script>

<header class="bg-white dark:bg-gray-800 shadow-md">
  <div class="flex justify-between items-center p-4">
    <button class="text-2xl font-bold text-gray-900 dark:text-white px-4 py-2 focus:outline-none">
   <a href="/">Email Manager</a>
    </button>
    <form class="w-[800px]">
      <div class="flex">
        <div class="relative w-full max-w-2xl mr-4">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <i class="fa-solid fa-magnifying-glass text-gray-600"></i>
          </div>
          <input 
            type="search" 
            id="default-search" 
            class="w-full py-3 pl-12 text-lg text-gray-900 border border-gray-300 rounded-lg bg-transparent dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:outline-none" 
            placeholder="Search..." 
            required
          />
        </div>
        <div class="relative">
          <button type="button" on:click={() => showDropdown = !showDropdown} class="flex items-center justify-between gap-2 w-[150px] py-3 text-lg text-gray-900 border border-gray-300 rounded-lg px-4 bg-transparent dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:outline-none">
            <span>Filter</span>
            <i class="fa-solid fa-angle-down"></i>
          </button>
          {#if showDropdown}
            <ul class="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
              <li>
                <button type="button" on:click={() => applyFilter('')} class="block text-lg w-full text-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">All tags</button>
              </li>
              <li>
                <button type="button" on:click={() => applyFilter('TechRequest')} class="block text-lg w-full text-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">TechRequest</button>
              </li>
              <li>
                <button type="button" on:click={() => applyFilter('Certificate')} class="block text-lg w-full text-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">Certificate</button>
              </li>
              <li>
                <button type="button" on:click={() => applyFilter('Forwarded')} class="block text-lg w-full text-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">Forwarded</button>
              </li>
              <li>
                <button type="button" on:click={() => applyFilter('Registration')} class="block text-lg w-full text-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">Registration</button>
              </li>
            </ul>
          {/if}
        </div>
      </div>
    </form>
    <div class="flex gap-3 items-center">
      <button 
        on:click={toggleTheme} 
        class="text-2xl text-gray-900 dark:text-white focus:outline-none"
        aria-label="Toggle Theme"
      >
        {#if $theme === 'light'}
          <i class="fa-solid fa-sun text-yellow-500"></i>
        {:else}
          <i class="fa-solid fa-moon text-blue-500"></i>
        {/if}
      </button>
      <button 
        class="text-5xl text-gray-900 dark:text-white focus:outline-none"
        aria-label="User Profile"
      >
        <i class="fa-solid fa-user-circle"></i>
      </button>
    </div>
  </div>
</header>

<style>

</style>
