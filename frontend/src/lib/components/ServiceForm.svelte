<script>
  import { addService } from "$lib/stores/serviceStore";

  let name = "";
  let description = "";
  let variations = [{ name: "", price: 0, duration: 0 }];

  const addVariation = () => {
    variations = [...variations, { name: "", price: 0, duration: 0 }];
  };

  const handleSubmit = () => {
    if (!name || !description) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const validVariations = variations.filter(v => v.name && v.price > 0 && v.duration > 0);

    if (validVariations.length === 0) {
      alert("Adicione pelo menos uma variação válida.");
      return;
    }

    addService({ name, description, variations: validVariations });

    alert("Serviço cadastrado com sucesso!");
    name = "";
    description = "";
    variations = [{ name: "", price: 0, duration: 0 }];
  };
</script>

<div class="bg-white shadow rounded p-6 max-w-lg mx-auto">
  <h2 class="text-xl font-bold mb-4">Cadastrar Serviço</h2>

  <label class="block mb-2 text-sm font-medium">Nome</label>
  <input type="text" bind:value={name} class="border rounded w-full px-3 py-2 mb-4"/>

  <label class="block mb-2 text-sm font-medium">Descrição</label>
  <textarea bind:value={description} class="border rounded w-full px-3 py-2 mb-4"></textarea>

  <h3 class="text-lg font-semibold mb-2">Variações</h3>
  {#each variations as v, i}
    <div class="mb-3 p-3 border rounded">
      <input type="text" placeholder="Nome" bind:value={v.name} class="border rounded px-2 py-1 w-full mb-2"/>
      <input type="number" placeholder="Preço" bind:value={v.price} class="border rounded px-2 py-1 w-full mb-2"/>
      <input type="number" placeholder="Duração (min)" bind:value={v.duration} class="border rounded px-2 py-1 w-full"/>
    </div>
  {/each}
  <button type="button" on:click={addVariation} class="btn btn-secondary mb-4">+ Adicionar Variação</button>

  <button type="button" on:click={handleSubmit} class="btn btn-primary w-full">Salvar Serviço</button>
</div>
