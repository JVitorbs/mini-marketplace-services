<script>
  import { onMount } from "svelte";
  import BookingForm from "$lib/components/BookingForm.svelte";
  import AvailabilityCalendar from "$lib/components/AvailabilityCalendar.svelte";

  export let params;

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  let service = null;
  let loading = false;
  let error = null;

  async function loadService() {
    loading = true;
    error = null;

    function normalize(s) {
      return {
        id: s.id ?? params.id,
        name: s.nome || s.name || "Serviço",
        description: s.descricao || s.description || "",
        variations: (s.variacoes || s.variations || []).map(v => ({
          name: v.nome || v.name || "",
          price: v.preco ?? v.price ?? v.valor ?? 0,
          duration: v.duracaoMin ?? v.duration ?? v.duracao ?? 0
        }))
      };
    }

    try {
      // tenta buscar por id diretamente
      let res = await fetch(`${API_BASE}/servicos/${params.id}`);
      if (res.ok) {
        const s = await res.json();
        service = normalize(s);
        return;
      }

      // se deu 404 ou outra resposta, tenta buscar todos e procurar pelo id/slug/nome
      console.warn(`GET /servicos/${params.id} returned ${res.status}, falling back to list`);
      const listRes = await fetch(`${API_BASE}/servicos`);
      if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);
      const list = await listRes.json();

      const found = list.find(item =>
        String(item.id) === String(params.id) ||
        item.slug === params.id ||
        (item.nome && item.nome.toLowerCase() === String(params.id).toLowerCase()) ||
        (item.name && item.name.toLowerCase() === String(params.id).toLowerCase())
      );

      if (found) {
        service = normalize(found);
      } else {
        throw new Error('Serviço não encontrado');
      }
    } catch (err) {
      console.error("Erro carregando serviço", err);
      error = err.message || String(err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadService();
  });
</script>

{#if loading}
  <p>Carregando serviço...</p>
{:else if error}
  <p class="text-red-600">Erro ao carregar serviço: {error}</p>
{:else if service}
  <h1 class="text-2xl font-bold mb-2">{service.name}</h1>
  <p class="mb-4">{service.description}</p>

  <AvailabilityCalendar />
  <BookingForm {service} />
{:else}
  <p>Serviço não encontrado.</p>
{/if}
