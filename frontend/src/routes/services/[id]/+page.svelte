<script>
  import { onMount } from "svelte";
  import BookingForm from "$lib/components/BookingForm.svelte";
  import AvailabilityCalendar from "$lib/components/AvailabilityCalendar.svelte";

  export let params;

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  let service = null;
  let loading = false;
  let error = null;

  const normalize = (s) => ({
    id: s.id ?? params.id,
    name: s.nome || s.name || "Serviço sem nome",
    description: s.descricao || s.description || "Sem descrição disponível.",
    variations: (s.variacoes || s.variations || []).map((v) => ({
      name: v.nome || v.name || "Padrão",
      price: v.preco ?? v.price ?? v.valor ?? 0,
      duration: v.duracaoMin ?? v.duration ?? v.duracao ?? 0,
    })),
  });

  async function loadService() {
    loading = true;
    error = null;

    try {
      // 1️⃣ Tenta buscar diretamente pelo ID
      const res = await fetch(`${API_BASE}/servicos/${params.id}`);

      if (res.ok) {
        service = normalize(await res.json());
        return;
      }

      // 2️⃣ Se falhar, busca todos e tenta encontrar correspondência
      console.warn(
        `GET /servicos/${params.id} retornou ${res.status}, tentando lista completa...`
      );
      const listRes = await fetch(`${API_BASE}/servicos`);
      if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);

      const list = await listRes.json();
      const found = list.find(
        (item) =>
          String(item.id) === String(params.id) ||
          item.slug === params.id ||
          (item.nome &&
            item.nome.toLowerCase() === String(params.id).toLowerCase()) ||
          (item.name &&
            item.name.toLowerCase() === String(params.id).toLowerCase())
      );

      if (!found) throw new Error("Serviço não encontrado");
      service = normalize(found);
    } catch (err) {
      console.error("Erro carregando serviço:", err);
      error = err.message || "Falha desconhecida ao carregar serviço";
    } finally {
      loading = false;
    }
  }

  onMount(loadService);
</script>

<!-- 🧭 Layout -->
<div class="max-w-3xl mx-auto px-4 py-8">
  {#if loading}
    <p class="text-gray-600 text-center animate-pulse">Carregando serviço...</p>

  {:else if error}
    <p class="text-red-600 text-center">⚠️ Erro ao carregar serviço: {error}</p>

  {:else if service}
    <h1 class="text-3xl font-bold mb-2 text-gray-800">{service.name}</h1>
    <p class="mb-6 text-gray-700">{service.description}</p>

    <div class="space-y-8">
      <AvailabilityCalendar />
      <BookingForm {service} />
    </div>

  {:else}
    <p class="text-gray-500 text-center">Serviço não encontrado.</p>
  {/if}
</div>
