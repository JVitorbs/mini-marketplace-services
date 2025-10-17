<script>
  import BookingForm from "$lib/components/BookingForm.svelte";
  import AvailabilityCalendar from "$lib/components/AvailabilityCalendar.svelte";

  export let params;

  let service = {
    id: params.id,
    name: "Manicure",
    description: "Profissional com 20 anos de experiência",
    variations: [
      { name: "Pé", price: 50, duration: 30 },
      { name: "Mão", price: 25, duration: 30 }
    ]
  };
</script>

<h1 class="text-2xl font-bold mb-2">{service.name}</h1>
<p class="mb-4">{service.description}</p>

<AvailabilityCalendar />
<BookingForm {service} />
