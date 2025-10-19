<script>
  import logogrande from '$lib/assets/logo_grande.png';
  let email = "";
  let password = "";
</script>

<h1 class="text-2xl font-bold mb-4">Login</h1>

<div class="flex justify-center mb-6">
  <img
    src={logogrande}
    alt="Logo Mini Marketplace"
    class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 transition-all duration-300"
  />
</div>

<form class="space-y-4 max-w-md mx-auto bg-white shadow p-6 rounded">
  <input type="email" placeholder="Email" bind:value={email} class="border rounded px-3 py-2 w-full"/>
  <input type="password" placeholder="Senha" bind:value={password} class="border rounded px-3 py-2 w-full"/>
  <button type="submit" class="btn btn-primary w-full">Entrar</button>
</form>

