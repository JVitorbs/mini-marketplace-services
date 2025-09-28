<script>
  let name = "";
  let email = "";
  let password = "";
</script>

<h1 class="text-2xl font-bold mb-4">Cadastrar-se</h1>
<form class="space-y-4">
  <input type="text" placeholder="Nome" bind:value={name} class="border p-2 w-full"/>
  <input type="email" placeholder="Email" bind:value={email} class="border p-2 w-full"/>
  <input type="password" placeholder="Senha" bind:value={password} class="border p-2 w-full"/>
  <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Criar conta</button>
</form>
