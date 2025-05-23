document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const challengeId = params.get('id');

  if (!challengeId) {
    window.location.href = 'desafios.html';
    return;
  }

  loadChallengeDetails(challengeId);

  const solutionForm = document.getElementById('solution-form');
  if (solutionForm) {
    solutionForm.addEventListener('submit', (e) => handleSolutionSubmit(e, challengeId));
  }
});

async function loadChallengeDetails(challengeId) {
  const detailsContainer = document.getElementById('challenge-details');
  if (!detailsContainer) return;

  try {
    const challenge = await apiRequest(`/api/problemas/${challengeId}`, {
      method: 'GET'
    });

    if (challenge) {
      renderChallengeDetails(detailsContainer, challenge);
    }
  } catch (error) {
    console.error('Erro ao carregar desafio:', error);
    detailsContainer.innerHTML = '<p class="error-message">Erro ao carregar desafio.</p>';
  }
}

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

async function handleSolutionSubmit(e, challengeId) {
  e.preventDefault();
  if (!requireAuth()) return;

  const userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData || !userData.id || userData === undefined) {
    showNotification('Usuário não identificado.', 'error');
    return;
  }

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
    const response = await fetch('http://localhost:8000/responder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userData.id,
        problem_id: challengeId,
        resposta: solutionText
      }),
    });

    if (response.ok) {
      showNotification('Resposta enviada com sucesso!');
      setTimeout(() => {
        window.location.href = 'desafios.html';
      }, 2000);
    } else {
      showNotification('Erro ao enviar resposta.', 'error');
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

function getDifficultyText(difficulty) {
  const map = {
    'FACIL': 'Fácil',
    'MEDIO': 'Médio',
    'DIFICIL': 'Difícil'
  };
  return map[difficulty] || difficulty;
}
