
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
});

/**
 * @param {Event} e - Form submission event
 */
async function handleRegister(e) {
  e.preventDefault();
  
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim() ;
  const senha = document.getElementById('senha').value;
  
  if (!nome || !email || !senha) {
    showNotification('Preencha todos os campos', 'error');
    return;
  }
  
  if (senha.length < 6) {
    showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Criando conta...';
  
  try {
    const response = await apiRequest('/usuarios', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    });

    console.log('Resposta da API:', response);
    
    if (response) {
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('userData', JSON.stringify(response/*.usuario*/));
      
      showNotification('Conta criada com sucesso!');
      
      setTimeout(() => {
        window.location.href = 'desafios.html';
      }, 1000);
    }
  } catch (error) {
    console.error('Register Error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Criar conta';
  }
}