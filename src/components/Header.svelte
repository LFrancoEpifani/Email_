<script>
  import { theme } from '../store/store.js';
  import { selectedTag, searchQuery } from '../store/store.js';
  import Paxis from '../static/paxis.png';

  function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  }
</script>

<header class="bg-[#033031] dark:bg-[#007A7B]">
  <div class="relative flex flex-col md:flex-row justify-between items-center px-4 py-2 space-y-4 md:space-y-0">
    <a href="/" class="flex justify-start items-start">
      <img class="w-8 h-8" src={Paxis} alt="Paxis Logo">
    </a>
    <form class="py-2 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2 w-full md:w-auto">
      <div class="relative w-full md:w-96">
        <input 
          type="search" 
          id="default-search" 
          class="w-full md:w-96 py-2 text-end text-white bg-[#115858] rounded-md text-sm dark:text-white focus:outline-none" 
          placeholder="Search..." 
          bind:value={$searchQuery} 
          aria-label="Search through emails"
        />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i class="fa-solid fa-magnifying-glass text-gray-200"></i>
        </div>
      </div>

      <select bind:value={$selectedTag} class="rounded-md bg-[#115858] text-white text-sm py-2 pl-1 pr-10 w-full md:w-auto">
        <option class="bg-[#063132]" value="">All</option>
        <option class="bg-[#063132]" value="TechRequest">TechRequest</option>
        <option class="bg-[#063132]" value="Certificate">Certificate</option>
        <option class="bg-[#063132]" value="Registration">Registration</option>
        <option class="bg-[#063132]" value="Forwarded">Forwarded</option>
      </select>
    </form>

  
    <div class="absolute top-0 right-4 md:static md:ml-auto bg-[#053B3F] rounded-md py-2 px-5 flex gap-4">
      <button 
        class="text-white dark:text-white focus:outline-none"
        aria-label="User Profile"
      >
        <i class="fa-solid fa-user"></i>
      </button>
      <button 
        on:click={toggleTheme} 
        class="text-white dark:text-white focus:outline-none"
        aria-label="Toggle Theme"
      >
        {#if $theme === 'light'}
          <i class="fa-regular fa-sun text-yellow-500"></i>
        {:else}
          <i class="fa-regular fa-moon text-blue-500"></i>
        {/if}
      </button>
    </div>
  </div>
</header>
