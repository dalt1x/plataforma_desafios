export { API_BASE_URL }

const API_BASE_URL = 'https://plataforma-desafios.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('active') && !e.target.closest('.navbar')) {
      navLinks.classList.remove('active');
    }
  });

  checkAuthStatus();
});

function checkAuthStatus() {
  const token = localStorage.getItem('authToken');
  const navLinks = document.querySelector('.nav-links');

  if (token && navLinks) {
    const existingLogout = navLinks.querySelector('#logout-link');
    if (!existingLogout) {
      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.id = 'logout-link';
      logoutLink.textContent = 'Sair';
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
      navLinks.appendChild(logoutLink);
    }

    const loginLink = navLinks.querySelector('a[href="login.html"]');
    if (loginLink) {
      loginLink.href = '#';
      loginLink.textContent = 'Meu Perfil';
    }
  } else {
    const logoutLink = document.querySelector('#logout-link');
    if (logoutLink) logoutLink.remove();
  }
}

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    const contentType = response.headers.get('Content-Type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Erro inesperado da API');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    showNotification(error.message || 'Erro de conexão com o servidor', 'error');
    return null;
  }
}

function showNotification(message, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = `notification ${type}`;
  div.textContent = message;
  document.body.appendChild(div);

  setTimeout(() => div.classList.add('show'), 10);
  setTimeout(() => {
    div.classList.remove('show');
    setTimeout(() => div.remove(), 300);
  }, 3000);
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  showNotification('Logout realizado com sucesso!');
  setTimeout(() => window.location.href = 'login.html', 1000);
}

function requireAuth() {
  const token = localStorage.getItem('authToken');
  if (!token && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
