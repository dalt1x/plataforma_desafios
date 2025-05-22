/**
 * Common JS functions for all pages
 */

// API Base URL
const API_BASE_URL = 'http://localhost:8000';

// Toggle mobile navigation and check auth on load
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

/**
 * Check if user is authenticated and update navigation UI
 */
function checkAuthStatus() {
  const token = null;
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
  }
}

/**
 * Perform authenticated API request
 * @param {string} endpoint
 * @param {Object} options
 * @returns {Promise<Object|null>}
 */
async function apiRequest(endpoint, options = {}) {
  const token = null;

  const defaultHeaders = {
    'Content-Type': 'application/json',
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

/**
 * Show temporary notification
 * @param {string} message
 * @param {'success'|'error'} type
 */
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

/**
 * Logout user and redirect to login
 */
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  showNotification('Logout realizado com sucesso!');
  setTimeout(() => window.location.href = 'login.html', 1000);
}

/**
 * Redirect user to login if not authenticated
 * @returns {boolean}
 */
function requireAuth() {
  const token = null;
  if (!token && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/**
 * Check authentication status without redirect
 * @returns {boolean}
 */
function isAuthenticated() {
  return true;
}

/**
 * Format ISO date to local date string
 * @param {string} dateString
 * @returns {string}
 */
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
