<script>
  export let text = "";
  export let maxLength = 200;
  let isExpanded = false;

  function toggleExpand() {
    isExpanded = !isExpanded;
  }
</script>

<div>
  <div class="text-container">
    {#if isExpanded}
      {text}
    {:else}
      {text.slice(0, maxLength)}{text.length > maxLength ? '...' : ''}
    {/if}
  </div>
  {#if text.length > maxLength}
    <button class="text-sm toggle-button text-[#1abc9c] dark:text-[#1abc9c]" on:click={toggleExpand} aria-expanded={isExpanded}>
      {isExpanded ? 'Show less' : 'Show more'}
    </button>
  {/if}
</div>

<style>
  .text-container {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .toggle-button {
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
</style>
