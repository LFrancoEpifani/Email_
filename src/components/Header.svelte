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
    <img class="w-8" src={Paxis} alt="">
    </a>
    <form class="flex items-center justify-center">
      <div class="w-[800px] flex items-center justify-center m-2">
        <div class="relative w-full max-w-2xl mr-4">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-lg">
            <i class="fa-solid fa-magnifying-glass text-gray-200"></i>
          </div>
          <input 
            type="search" 
            id="default-search" 
            class="w-full pt-[6px] pb-[2px] pl-10 text-md text-white bg-[#305E5A] rounded-lg dark:text-white focus:outline-none" 
            placeholder="Search..." 
            bind:value={$searchQuery} 
            aria-label="Search through emails"
          />
        </div>
        <div class="flex justify-between items-center">
          <select bind:value={$selectedTag} class="p-[4px] rounded-lg bg-[#305E5A] text-white">
            <option class="bg-[#063132] text-lg" value="">All</option>
            <option class="bg-[#063132] text-lg" value="TechRequest">TechRequest</option>
            <option class="bg-[#063132] text-lg" value="Certificate">Certificate</option>
            <option class="bg-[#063132] text-lg" value="Registration">Registration</option>
            <option class="bg-[#063132] text-lg" value="Forwarded">Forwarded</option>
          </select>
        </div>
      </div>
    </form>
    <div class="flex gap-2 items-center">
      <button 
        on:click={toggleTheme} 
        class="text-xl text-white dark:text-white focus:outline-none"
        aria-label="Toggle Theme"
      >
        {#if $theme === 'light'}
          <i class="fa-solid fa-sun text-yellow-500"></i>
        {:else}
          <i class="fa-solid fa-moon text-blue-500"></i>
        {/if}
      </button>
      <button 
        class="text-3xl text-white dark:text-white focus:outline-none"
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
