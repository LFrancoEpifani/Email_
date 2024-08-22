<script>
  import { theme } from '../store/store.js';
  import { selectedTag, searchQuery } from '../store/store.js';
  import Paxis from '../static/paxis.png'


  function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  }


  
</script>

<header class="bg-[#063132] dark:bg-[#063132]">
  <div class="flex justify-between items-center">
    <a href="/" class="font-bold text-white dark:text-white px-4 focus:outline-none">
    <img class="w-6" src={Paxis} alt="">
    </a>
    <form class="flex items-center justify-center">
      <div class="w-[800px] flex items-center justify-center m-2">
        <div class="relative w-full max-w-lg mr-4">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-xs">
            <i class="fa-solid fa-magnifying-glass text-gray-200"></i>
          </div>
          <input 
            type="search" 
            id="default-search" 
            class="w-full py-1 pl-8 text-xs text-white bg-[#305E5A] rounded-md dark:text-white focus:outline-none" 
            placeholder="Search..." 
            bind:value={$searchQuery} 
            aria-label="Search through emails"
          />
        </div>
        <div class="flex justify-between items-center">
          <select bind:value={$selectedTag} class="rounded-md bg-[#305E5A] text-white text-sm px-1">
            <option class="bg-[#063132]" value="">All</option>
            <option class="bg-[#063132]" value="TechRequest">TechRequest</option>
            <option class="bg-[#063132]" value="Certificate">Certificate</option>
            <option class="bg-[#063132]" value="Registration">Registration</option>
            <option class="bg-[#063132]" value="Forwarded">Forwarded</option>
          </select>
        </div>
      </div>
    </form>
    <div class="flex gap-2 items-center">
      <button 
        on:click={toggleTheme} 
        class="text-md text-white dark:text-white focus:outline-none"
        aria-label="Toggle Theme"
      >
        {#if $theme === 'light'}
          <i class="fa-solid fa-sun text-yellow-500"></i>
        {:else}
          <i class="fa-solid fa-moon text-blue-500"></i>
        {/if}
      </button>
      <button 
        class="text-2xl text-white dark:text-white focus:outline-none"
        aria-label="User Profile"
      >
        <i class="fa-solid fa-user-circle"></i>
      </button>
    </div>
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
