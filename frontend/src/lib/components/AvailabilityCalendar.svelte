<script>
  let selectedDate = null;
  let availableSlots = ["09:00", "10:00", "14:00", "16:00"];
</script>

<div>
  <h3 class="font-bold">Agenda</h3>
  <input type="date" bind:value={selectedDate} class="border p-2"/>
  {#if selectedDate}
    <div class="grid grid-cols-3 gap-2 mt-2">
      {#each availableSlots as slot}
        <button class="border p-2 hover:bg-blue-100">{slot}</button>
      {/each}
    </div>
  {/if}
</div>
