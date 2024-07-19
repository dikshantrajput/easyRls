<script>
  import { theme } from "$lib/stores/theme";
</script>

<div class="p-4 bg-background-light rounded-lg">
  <h1 class="text-2xl font-bold text-primary">Welcome to my app</h1>
  <p class="text-text-muted mt-2">
    This text adapts to both light and dark modes.
  </p>
  <button
    class="mt-4 px-4 py-2 bg-secondary text-background rounded hover:bg-secondary-dark transition-colors"
  >
    Get Started
  </button>
</div>

<p>Current theme: {$theme}</p>
