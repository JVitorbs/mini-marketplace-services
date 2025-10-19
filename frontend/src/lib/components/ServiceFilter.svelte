<script>
  export let onFilter = (filter) => {};
  export let categories = [];

  let search = "";
  let category = ""; // precisa estar aqui para o bind funcionar

  // chama o filtro ao digitar/selecionar para experiência reativa
  function apply() {
    onFilter({ search, category });
  }
</script>

<div class="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-3">
  <input 
    type="text"
    placeholder="Buscar serviço..."
    bind:value={search}
    on:input={apply}
    class="border rounded px-3 py-2 flex-1"
  />

  <select bind:value={category} on:change={apply} class="border rounded px-3 py-2">
    <option value="">Todas as categorias</option>
    {#each categories as c}
      <option value={c.toLowerCase()}>{c}</option>
    {/each}
  </select>

  <button class="btn btn-primary" on:click={apply}>
    Filtrar
  </button>
</div>
