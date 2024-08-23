<script>
  import { theme } from '../store/store.js';
  import { selectedTag, searchQuery } from '../store/store.js';
  import Paxis from '../static/paxis.png';

  function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  }
</script>

<header class="bg-[#033031] dark:bg-[#007A7B]">
  <div class="flex justify-between items-center px-4 py-2">
    <a href="/" class="flex-shrink-0">
      <img class="w-8 h-8" src={Paxis} alt="Paxis Logo">
    </a>
    <form class="flex items-center space-x-2 ml-auto">
      <div class="relative w-96">
        <input 
          type="search" 
          id="default-search" 
          class="w-96 py-2 text-end text-white bg-[#115858] rounded-md text-sm dark:text-white focus:outline-none" 
          placeholder="Search..." 
          bind:value={$searchQuery} 
          aria-label="Search through emails"
        />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i class="fa-solid fa-magnifying-glass text-gray-200"></i>
        </div>
      </div>
      <select bind:value={$selectedTag} class="rounded-md bg-[#115858] text-white text-sm py-2 pl-1 pr-10">
        <option class="bg-[#063132]" value="">All</option>
        <option class="bg-[#063132]" value="TechRequest">TechRequest</option>
        <option class="bg-[#063132]" value="Certificate">Certificate</option>
        <option class="bg-[#063132]" value="Registration">Registration</option>
        <option class="bg-[#063132]" value="Forwarded">Forwarded</option>
      </select>
      
      <div class="bg-[#053B3F] rounded-md py-2 px-5 flex gap-8">
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
    </form>
  </div>
</header>

<style>
  ::placeholder {
    color: white;
    opacity: 1;
  }

  ::-ms-input-placeholder { 
    color: white;
  }
  

</style>
