<script>
  import logogrande from '$lib/assets/logo_grande.png';
  let name = "";
  let email = "";
  let password = "";
</script>

<h1 class="text-2xl font-bold mb-4">Cadastrar-se</h1>

<div class="flex justify-center mb-6">
  <img
    src={logogrande}
    alt="Logo Mini Marketplace"
    class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 transition-all duration-300"
  />
</div>

<form class="space-y-4 max-w-md mx-auto bg-white shadow p-6 rounded">
  <input type="text" placeholder="Nome" bind:value={name} class="border p-2 w-full"/>
  <input type="email" placeholder="Email" bind:value={email} class="border p-2 w-full"/>
  <input type="password" placeholder="Senha" bind:value={password} class="border p-2 w-full"/>
  <button type="submit" class="btn btn-primary w-full">Criar conta</button>
</form>
