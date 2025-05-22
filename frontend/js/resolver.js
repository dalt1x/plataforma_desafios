/**
 * Challenge solver page functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get challenge ID from URL
  const params = new URLSearchParams(window.location.search);
  const challengeId = params.get('id');

  if (!challengeId) {
    window.location.href = 'desafios.html';
    return;
  }

  console.log('Carregando desafio ID:', challengeId); // depuração

  // Carrega detalhes do desafio
  loadChallengeDetails(challengeId);

  // Set up solution form
  const solutionForm = document.getElementById('solution-form');
  if (solutionForm) {
    solutionForm.addEventListener('submit', (e) => handleSolutionSubmit(e, challengeId));
  }
});

/**
 * Carrega detalhes do desafio da API
 * @param {string} challengeId - Challenge ID
 */
async function loadChallengeDetails(challengeId) {
  console.log(">> Chamando loadChallengeDetails com ID:", challengeId);

  const detailsContainer = document.getElementById('challenge-details');
  if (!detailsContainer) {
    console.warn(">> Container não encontrado");
    return;
  }

  try {
    console.log(">> Fazendo requisição para /api/problemas/" + challengeId);

    const challenge = await apiRequest(`/api/problemas/${challengeId}`, {
      method: 'GET'
    });

    console.log(">> Resposta recebida:", challenge);

    if (challenge) {
      renderChallengeDetails(detailsContainer, challenge);
    } else {
      console.warn(">> Nenhum desafio retornado");
    }
  } catch (error) {
    console.error('Erro ao carregar desafio:', error);
    detailsContainer.innerHTML = '<p class="error-message">Erro ao carregar desafio. Tente novamente mais tarde.</p>';
  }
}

/**
 * Render challenge details in container
 * @param {HTMLElement} container - Container element
 * @param {Object} challenge - Challenge data
 */
function renderChallengeDetails(container, challenge) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = challenge.titulo;

  const difficultyBadge = document.createElement('span');
  difficultyBadge.className = `badge difficulty-${challenge.nivel.toLowerCase()}`;
  difficultyBadge.textContent = getDifficultyText(challenge.nivel);

  const description = document.createElement('div');
  description.className = 'challenge-description';
  description.innerHTML = `<h3>Descrição</h3><p>${challenge.enunciado}</p>`;

  container.appendChild(title);
  container.appendChild(difficultyBadge);
  container.appendChild(description);

}

/**
 * Handle solution submission
 * @param {Event} e - Form submission event
 * @param {string} challengeId - Challenge ID
 */
async function handleSolutionSubmit(e, challengeId) {
  e.preventDefault();

  if (!requireAuth()) return;

  const solutionText = document.getElementById('solution').value;

  if (!solutionText) {
    showNotification('Por favor, insira sua solução', 'error');
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
  }

  try {
    const response = await apiRequest('/responder', {
      method: 'POST',
      body: JSON.stringify({
        desafio_id: challengeId,
        resposta: solutionText
      }),
    });

    if (response) {
      showNotification('Resposta enviada com sucesso!');
      setTimeout(() => {
        window.location.href = 'desafios.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Erro ao enviar resposta:', error);
    showNotification('Erro ao enviar resposta. Tente novamente.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Resposta';
    }
  }
}

/**
 * Get difficulty text from code
 * @param {string} difficulty - Difficulty code
 * @returns {string} Difficulty text
 */
function getDifficultyText(difficulty) {
  const map = {
    'FACIL': 'Fácil',
    'MEDIO': 'Médio',
    'DIFICIL': 'Difícil'
  };
  return map[difficulty] || difficulty;
}
