/**
 * Login page functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Redirect if already logged in
  const token = localStorage.getItem('authToken');
  if (token) {
    window.location.href = 'desafios.html';
  }
});

/**
 * Handle login form submission
 * @param {Event} e - Form submission event
 */
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!email || !password) {
    showNotification('Preencha todos os campos', 'error');
    return;
  }
  
  // Disable form during submission
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Entrando...';
  
  try {
    // Call login API
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    
    if (response) {
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      showNotification('Login realizado com sucesso!');
      
      // Redirect to challenges page
      setTimeout(() => {
        window.location.href = 'desafios.html';
      }, 1000);
    }
  } catch (error) {
    console.error('Login Error:', error);
  } finally {
    // Re-enable form
    submitBtn.disabled = false;
    submitBtn.textContent = 'Entrar';
  }
}