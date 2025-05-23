  document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (!loginForm) {
    alert("⚠️ Formulário de login não encontrado!");
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');

    if (!emailInput || !senhaInput) {
      alert("⚠️ Campos de email ou senha não encontrados!");
      return;
    }

    const email = emailInput.value;
    const senha = senhaInput.value;

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', senha);

      const res = await fetch(`https://plataforma-desafios.onrender.com/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!res.ok) throw new Error("Login falhou");

      const data = await res.json();
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('userData', JSON.stringify(data.usuario));

      alert("Login bem-sucedido!");
      window.location.href = 'desafios.html';
    } catch (err) {
      alert("Erro: " + err.message);
    }
  });
});
