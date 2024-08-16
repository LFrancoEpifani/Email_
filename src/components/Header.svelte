<script>
  import { theme } from '../store/store.js';
  import { selectedTag, searchQuery } from '../store/store.js';
  function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  }


  
</script>

<header class="bg-[#063132] dark:bg-[#063132]">
  <div class="flex justify-between items-center">
    <a href="/" class="text-2xl font-bold text-white dark:text-white px-4 py-2 focus:outline-none">Email Manager</a>
    <form class="flex items-center justify-center">
      <div class="w-[800px] flex items-center justify-center m-4">
        <div class="relative w-full max-w-2xl mr-4">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <i class="fa-solid fa-magnifying-glass text-gray-200"></i>
          </div>
          <input 
            type="search" 
            id="default-search" 
            class="w-full py-3 pl-12 text-lg text-white border border-gray-300 rounded-lg bg-transparent dark:text-white focus:outline-none" 
            placeholder="Search..." 
            bind:value={$searchQuery} 
            aria-label="Search through emails"
          />
        </div>
        <div class="flex justify-between items-center">
          <select bind:value={$selectedTag} class="border p-3 rounded-lg bg-transparent text-white">
            <option class="bg-[#063132] text-lg" value="">All</option>
            <option class="bg-[#063132] text-lg" value="TechRequest">TechRequest</option>
            <option class="bg-[#063132] text-lg" value="Certificate">Certificate</option>
            <option class="bg-[#063132] text-lg" value="Registration">Registration</option>
            <option class="bg-[#063132] text-lg" value="Forwarded">Forwarded</option>
          </select>
        </div>
      </div>
    </form>
    <div class="flex gap-3 items-center">
      <button 
        on:click={toggleTheme} 
        class="text-2xl text-white dark:text-white focus:outline-none"
        aria-label="Toggle Theme"
      >
        {#if $theme === 'light'}
          <i class="fa-solid fa-sun text-yellow-500"></i>
        {:else}
          <i class="fa-solid fa-moon text-blue-500"></i>
        {/if}
      </button>
      <button 
        class="text-5xl text-white dark:text-white focus:outline-none"
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
  opacity: 1; /* Firefox */
}

::-ms-input-placeholder { /* Edge 12 -18 */
  color: white;
}
</style>
