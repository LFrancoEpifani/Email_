<script>
  import Header from '../components/Header.svelte';
  import Inbox from '../components/Inbox.svelte';
  import { theme } from '../store/store.js';
  import { onMount } from 'svelte';

  let emails = [];
  let errorMessage = '';

  export let data;

  onMount(() => {
    if (typeof document !== 'undefined') {
      if ($theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });

  $: {
    if (typeof document !== 'undefined') {
      if ($theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
</script>

<main class="contenedor bg-white dark:bg-[#424242] text-black dark:text-white">
  <Header />
  <section class="inbox-container flex-grow overflow-hidden">
    {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
    {/if}
    <Inbox {data}/>
  </section>
</main>

<style>
  .contenedor {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .inbox-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .error-message {
    color: red;
    margin-bottom: 1rem;
  }
</style>
