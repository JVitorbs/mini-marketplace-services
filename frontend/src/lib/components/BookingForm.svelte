<script>
  import { user } from "$lib/stores/userStore";
  import { addBooking } from "$lib/stores/bookingStore";

  export let service;

  let selectedVariation = "";
  let selectedDate = "";
  let selectedTime = "";

  const handleSubmit = () => {
    if (!selectedVariation || !selectedDate || !selectedTime) {
      alert("Preencha todos os campos para contratar o serviço.");
      return;
    }

    if (!$user) {
      alert("Você precisa estar logado como cliente para contratar.");
      return;
    }

    addBooking({
      serviceId: service.id,
      serviceName: service.name,
      variation: selectedVariation,
      clientName: $user.name,
      clientId: $user.id,
      date: selectedDate,
      time: selectedTime,
    });

    alert(`Reserva confirmada: ${selectedVariation} em ${selectedDate} às ${selectedTime}`);
    
    // resetar form
    selectedVariation = "";
    selectedDate = "";
    selectedTime = "";
  };
</script>

<div class="bg-white shadow rounded p-4 mt-4">
  <h3 class="text-lg font-bold mb-2">Contratar serviço</h3>

  <label class="block mb-2 text-sm">Escolha uma variação</label>
  <select bind:value={selectedVariation} class="border rounded px-3 py-2 w-full mb-4">
    <option value="">Selecione...</option>
    {#each service?.variations ?? [] as v}
      <option value={v.name}>{v.name} - R$ {v.price} ({v.duration} min)</option>
    {/each}
  </select>

  <label class="block mb-2 text-sm">Data</label>
  <input type="date" bind:value={selectedDate} class="border rounded px-3 py-2 w-full mb-4"/>

  <label class="block mb-2 text-sm">Hora</label>
  <input type="time" bind:value={selectedTime} class="border rounded px-3 py-2 w-full mb-4"/>

  <button on:click={handleSubmit} class="btn btn-primary w-full">
    Confirmar Contratação
  </button>
</div>
