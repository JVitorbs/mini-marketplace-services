<script>
  import ServiceForm from "$lib/components/ServiceForm.svelte";
  import { services, removeService } from "$lib/stores/serviceStore";
</script>

<h1 class="text-2xl font-bold mb-4">Meus Serviços</h1>

<ServiceForm />

<h2 class="text-xl font-semibold mt-6 mb-3">Lista de Serviços</h2>

{#if $services.length === 0}
  <p>Nenhum serviço cadastrado.</p>
{:else}
  <ul class="space-y-3">
    {#each $services as service}
      <li class="p-4 border rounded bg-white shadow flex justify-between items-center">
        <div>
          <p class="font-semibold">{service.name}</p>
          <p class="text-sm text-gray-500">{service.description}</p>
          <ul class="mt-2 text-sm text-gray-700 list-disc ml-5">
            {#each service.variations as v}
              <li>{v.name} - R$ {v.price} ({v.duration} min)</li>
            {/each}
          </ul>
        </div>
        <button on:click={() => removeService(service.id)} class="btn btn-secondary">
          Remover
        </button>
      </li>
    {/each}
  </ul>
{/if}
