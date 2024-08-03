<script>
  export let size = 20; // Size of the loader in pixels
  export let color = 'primary'; // Color of the loader (primary, secondary, accent)
  export let thickness = 4; // Thickness of the loader ring
</script>

<div 
  class="loader"
  style="
    width: {size}px; 
    height: {size}px; 
    border-width: {thickness}px;
    border-top-color: rgb(var(--color-{color}));
  "
></div>

<style>
  .loader {
    border-radius: 50%;
    border-style: solid;
    border-color: #c0bbbb;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>