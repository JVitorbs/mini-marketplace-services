<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import logoPequena from '$lib/assets/logo_pequena.png';

  let open = false;
  let root;

  // Fecha o menu ao navegar
  $: if ($page) open = false;

  // Fecha ao clicar fora
  function handleClickOutside(e) {
    if (open && root && !root.contains(e.target)) open = false;
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<nav
  bind:this={root}
  class="bg-brand-dark  text-white shadow-md"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      <!-- Logo e nome -->
      <div class="flex items-center">
        <a href="/" class="flex items-center gap-3">
          <span class="sr-only">Mini Marketplace</span>
          <img
            src={logoPequena}
            alt="Logo"
            class="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300"
          />
          <span class="text-lg font-semibold hidden sm:inline">
            Mini Marketplace
          </span>
        </a>
      </div>

      <!-- Navegação desktop -->
      <div class="hidden sm:flex sm:items-center sm:space-x-6">
        <a href="/register" class="hover:bg-white/10 px-3 py-2 rounded-md transition">
          Cadastrar
        </a>
        <a href="/login" class="hover:bg-white/10 px-3 py-2 rounded-md transition">
          Entrar
        </a>
      </div>

      <!-- Botão mobile -->
      <div class="flex items-center sm:hidden">
        <button
          type="button"
          class="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-expanded={open}
          aria-label="Abrir menu"
          on:click={() => (open = !open)}
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {#if !open}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            {:else}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Menu mobile -->
  {#if open}
    <div class="sm:hidden border-t border-white/10 bg-gradient-to-r from-brand-dark to-primary-dark">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a href="/" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Início</a>
        <a href="/register" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Cadastrar</a>
        <a href="/login" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Entrar</a>
      </div>
    </div>
  {/if}
</nav>

<style>
  /* evita flicker no SSR quando usa classes conditionais */
  :global(.hidden-sm) { display: none; }
</style>
