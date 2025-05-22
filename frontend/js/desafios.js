/**
 * Challenges page functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  loadChallenges();
});

/**
 * Load challenges from API
 */
async function loadChallenges() {
  const challengesContainer = document.getElementById('desafios-list');

  if (!challengesContainer) return;

  try {
    // Call challenges API
    const challenges = await apiRequest('/api/problemas', {
      method: 'GET'
    });

    if (challenges && Array.isArray(challenges) && challenges.length > 0) {
      // Clear loading spinner
      challengesContainer.innerHTML = '';

      // Render challenges
      challenges.forEach(challenge => {
        challengesContainer.appendChild(createChallengeCard(challenge));
      });
    } else {
      challengesContainer.innerHTML = '<p class="no-data">Nenhum desafio disponível no momento.</p>';
    }
  } catch (error) {
    console.error('Load Challenges Error:', error);
    challengesContainer.innerHTML = '<p class="error-message">Erro ao carregar desafios. Tente novamente mais tarde.</p>';
  }
}

/**
 * Create challenge card element
 * @param {Object} challenge - Challenge data
 * @returns {HTMLElement} Challenge card element
 */
function createChallengeCard(challenge) {
  const card = document.createElement('div');
  card.className = 'challenge-card';

  const title = document.createElement('h3');
  title.textContent = challenge?.titulo || 'Sem título';

  const description = document.createElement('p');
  description.textContent = challenge?.tema || 'Sem descrição disponível.';

  const dificuldade = typeof challenge?.nivel === 'string' ? challenge.nivel : 'DESCONHECIDO';
  const difficulty = document.createElement('span');
  difficulty.className = `badge difficulty-${dificuldade.toLowerCase()}`;
  difficulty.textContent = getDifficultyText(dificuldade);

  const solveButton = document.createElement('a');
  
  if (challenge?.id !== undefined && challenge?.id !== null) {
  solveButton.href = `/resolver?id=${challenge.id}`;
} else {
  solveButton.href = '#';
  solveButton.classList.add('disabled');
  solveButton.textContent = 'Indisponível';
}
  solveButton.className = 'btn btn-primary';
  solveButton.textContent = 'Resolver';

  card.appendChild(title);
  card.appendChild(difficulty);
  card.appendChild(description);
  card.appendChild(solveButton);

  return card;
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
  return map[difficulty?.toUpperCase()] || 'Desconhecida';
}
