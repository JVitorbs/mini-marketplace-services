<script>
  let email = "";
  let password = "";
</script>

<h1 class="text-2xl font-bold mb-4">Login</h1>
<form class="space-y-4 max-w-md mx-auto bg-white shadow p-6 rounded">
  <input type="email" placeholder="Email" bind:value={email} class="border rounded px-3 py-2 w-full"/>
  <input type="password" placeholder="Senha" bind:value={password} class="border rounded px-3 py-2 w-full"/>
  <button type="submit" class="btn btn-primary w-full">Entrar</button>
</form>

