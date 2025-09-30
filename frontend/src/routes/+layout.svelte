<script>
  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
  <Navbar />

  <main class="flex-1 max-w-6xl mx-auto p-6 w-full">
    <slot />
  </main>

  <footer class="bg-gray-200 text-gray-600 py-4 text-center text-sm">
    © 2025 Super1 Marketplace
  </footer>
</div>
