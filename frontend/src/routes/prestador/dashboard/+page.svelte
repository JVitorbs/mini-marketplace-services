<script>
  import AvailabilityCalendar from '$lib/components/AvailabilityCalendar.svelte';
  import BookingForm from '$lib/components/BookingForm.svelte';

  export let params;
  // Mock inicial (depois busca no backend)
  let service = {
    id: params.id,
    name: "Manicure",
    description: "Profissional com 20 anos de experiência",
    variations: [
      { name: "Pé", price: 20, duration: 30 },
      { name: "Mão", price: 25, duration: 30 }
    ]
  };
</script>

<h1 class="text-2xl font-bold">{service.name}</h1>
<p class="mb-4">{service.description}</p>

<h3 class="font-bold">Variações</h3>
<ul>
  {#each service.variations as v}
    <li>{v.name} - R$ {v.price} ({v.duration} min)</li>
  {/each}
</ul>

<AvailabilityCalendar />
<BookingForm {service}/>
