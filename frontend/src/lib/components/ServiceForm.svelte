<script>
  let name = '';
  let description = '';
  let variations = [{ name: '', price: 0, duration: 30 }];
</script>

<form class="space-y-4">
  <input type="text" placeholder="Nome do serviço" bind:value={name} class="border p-2 w-full"/>
  <textarea placeholder="Descrição" bind:value={description} class="border p-2 w-full"></textarea>
  
  <h3 class="font-bold">Variações</h3>
  {#each variations as v, i}
    <div class="flex space-x-2">
      <input type="text" placeholder="Nome" bind:value={v.name} class="border p-2 flex-1"/>
      <input type="number" placeholder="Preço" bind:value={v.price} class="border p-2 w-24"/>
      <input type="number" placeholder="Duração (min)" bind:value={v.duration} class="border p-2 w-32"/>
    </div>
  {/each}

  <button type="button" on:click={() => variations.push({name:'', price:0, duration:30})}>
    + Adicionar variação
  </button>

  <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
</form>
