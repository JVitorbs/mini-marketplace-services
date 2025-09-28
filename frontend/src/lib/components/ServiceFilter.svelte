<script>
  export let onFilter = (filter) => {};

  let search = "";
  let category = ""; // precisa estar aqui para o bind funcionar
</script>

<div class="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-3">
  <input 
    type="text"
    placeholder="Buscar serviço..."
    bind:value={search}
    class="border rounded px-3 py-2 flex-1"
  />

  <select bind:value={category} class="border rounded px-3 py-2">
    <option value="">Todas as categorias</option>
    <option value="manicure">Manicure</option>
    <option value="pintura">Pintura</option>
    <option value="eletrica">Elétrica</option>
  </select>

  <button class="btn btn-primary" on:click={() => onFilter({search, category})}>
    Filtrar
  </button>
</div>
