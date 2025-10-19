<script>
  import { onMount } from 'svelte';
  import ServiceCard from '$lib/components/ServiceCard.svelte';
  import ServiceFilter from '$lib/components/ServiceFilter.svelte';

  let services = [];
  let filtered = [];
  let loading = false;
  let error = null;

  const API_BASE = import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_SERVER_API_BASE ?? 'http://localhost:3000';

  async function loadServices() {
    loading = true;
    error = null;
    try {
      const res = await fetch(`${API_BASE}/servicos`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // DEBUG: inspecione o payload bruto no console
      console.debug('GET /servicos ->', data);

      // normaliza nomes de campos do backend para o esperado no frontend
      services = (data || []).map(s => ({
        id: s.id,
        name: s.nome ?? s.name,
        description: s.descricao ?? s.description,
        tipo: s.tipo,
        prestador: s.prestador ? {
          id: s.prestador.id,
          nome: s.prestador.nome,
          email: s.prestador.email
        } : null,
        variations: (s.variacoes || s.variations || []).map(v => ({
          id: v.id,
          name: v.nome ?? v.name,
          price: Number(v.preco ?? v.price ?? 0),
          durationMin: v.duracaoMin ?? v.duration ?? 0
        }))
      }));
      filtered = services.slice();
    } catch (err) {
      console.error('Erro carregando serviços', err);
      error = err.message || String(err);
    } finally {
      loading = false;
    }
  }

  function handleFilter({ search, category }) {
    const q = (search || '').toLowerCase().trim();
    const cat = (category || '').toLowerCase().trim();
    filtered = services.filter(s => {
      const matchesSearch = !q || (s.name && s.name.toLowerCase().includes(q)) || (s.description && s.description.toLowerCase().includes(q));
      const matchesCategory = !cat || (s.tipo && s.tipo.toLowerCase().includes(cat));
      return matchesSearch && matchesCategory;
    });
  }

  onMount(() => {
    loadServices();
  });
</script>

<h1 class="text-2xl font-bold mb-4">Serviços disponíveis</h1>
<ServiceFilter onFilter={handleFilter} />

{#if loading}
  <p>Carregando serviços...</p>
{:else if error}
  <p class="text-red-600">Erro ao carregar serviços: {error}</p>
{:else}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    {#each filtered as service}
      <ServiceCard {service} />
    {/each}
  </div>
{/if}


