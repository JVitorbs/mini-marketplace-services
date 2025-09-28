<script>
  import { bookings, cancelBooking } from "$lib/stores/bookingStore";
</script>

<h1 class="text-2xl font-bold mb-4">Minhas Contratações</h1>

{#if $bookings.length === 0}
  <p>Nenhuma contratação até agora.</p>
{:else}
  <ul class="space-y-3">
    {#each $bookings as booking}
      <li class="p-4 border rounded bg-white shadow flex justify-between items-center">
        <div>
          <p class="font-semibold">{booking.clientName} contratou {booking.variation}</p>
          <p class="text-sm text-gray-500">
            {booking.date} às {booking.time} ({booking.serviceName})
          </p>
        </div>
        <button on:click={() => cancelBooking(booking.id)} class="btn btn-secondary">
          Cancelar
        </button>
      </li>
    {/each}
  </ul>
{/if}
