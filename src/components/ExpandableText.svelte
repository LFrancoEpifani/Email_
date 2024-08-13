<script>
  export let text = "";
  export let maxLength = 100;
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
    <button class="toggle-button text-[#2848BA] dark:text-[#e5efa3]" on:click={toggleExpand} aria-expanded={isExpanded}>
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
