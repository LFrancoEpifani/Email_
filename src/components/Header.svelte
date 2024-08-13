<script>
  import { theme } from '../store/store.js';
  let showDropdown = false;

  function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }
</script>

<header class="bg-white dark:bg-[#083153] shadow-md">
  <div class="flex justify-between items-center p-4">
    <a href="/" class="text-2xl font-bold text-gray-900 dark:text-white px-4 py-2 focus:outline-none">Email Manager</a>

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
            aria-label="Search through emails"
          />
        </div>
        <div class="relative">
          <button type="button" on:click={toggleDropdown} class="flex items-center justify-between gap-2 w-[150px] py-3 text-lg text-gray-900 border border-gray-300 rounded-lg px-4 bg-transparent dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:outline-none">
            <span>Filter</span>
            <i class="fa-solid fa-angle-down"></i>
          </button>
          
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
