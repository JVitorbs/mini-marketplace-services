<script>
  import { user, logout, loginFake } from "$lib/stores/userStore";
  import { page } from "$app/stores";
  
</script>

<nav class="bg-primary text-white shadow">
  <div class="max-w-6xl mx-auto flex justify-between items-center p-4">
    <a href="/" class="text-xl font-bold">Super1 Marketplace</a>

    <div class="space-x-4 flex items-center">
      <a href="/services" class="hover:underline">Serviços</a>

      {#if $user}
        {#if $user.role === "prestador"}
          <a href="/prestador/dashboard" class="hover:underline">Painel</a>
        {/if}

        <button on:click={logout} class="btn btn-secondary">Sair</button>
      {:else}
        <button on:click={() => loginFake("cliente")} class="btn btn-primary">Entrar como Cliente</button>
        <button on:click={() => loginFake("prestador")} class="btn btn-secondary">Entrar como Prestador</button>
      {/if}
    </div>
  </div>
</nav>
