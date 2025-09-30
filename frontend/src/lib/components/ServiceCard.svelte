<script>
  export let service;
</script>

<div class="bg-white border rounded-lg shadow hover:shadow-lg transition p-4">
  <h2 class="text-lg font-bold text-primary">{service.name}</h2>
  <p class="text-gray-600 mt-1">{service.description}</p>

  <div class="mt-3 space-y-1">
    {#each service.variations as v}
      <p class="text-sm text-gray-700">
        {v.name} — <span class="font-semibold text-secondary">R$ {v.price}</span> 
        ({v.duration} min)
      </p>
    {/each}
  </div>

  <a href={`/services/${service.id}`}
     class="btn btn-primary block text-center mt-4">
    Ver detalhes
  </a>
</div>
