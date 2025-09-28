<script>
  import ServiceCard from '$lib/components/ServiceCard.svelte';
  import ServiceFilter from '$lib/components/ServiceFilter.svelte';

  // Mock inicial
  let services = [
    { id: 1, name: "Manicure", description: "Profissional com 20 anos", variations: [
      { name: "Pé", price: 20, duration: 30 },
      { name: "Mão", price: 25, duration: 30 }
    ]},
    { id: 2, name: "Pintura", description: "Pintor experiente", variations: [
      { name: "Quarto", price: 300, duration: 240 }
    ]}
  ];
</script>

<h1 class="text-2xl font-bold mb-4">Serviços disponíveis</h1>
<ServiceFilter />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
  {#each services as service}
    <ServiceCard {service} />
  {/each}
</div>


