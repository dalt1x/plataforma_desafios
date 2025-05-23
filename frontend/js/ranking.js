
document.addEventListener('DOMContentLoaded', () => {
  loadRanking();
});

async function loadRanking() {
  const rankingTable = document.getElementById('ranking-table');
  const loadingSpinner = document.querySelector('.loading-spinner');
  
  if (!rankingTable || !loadingSpinner) return;
  
  try {
    const rankingData = await apiRequest('/api/ranking', {
      method: 'GET'
    });
    
    if (rankingData && rankingData.length > 0) {
      loadingSpinner.style.display = 'none';
      
      renderRanking(rankingTable, rankingData);
    } else if (rankingData && rankingData.length === 0) {
      loadingSpinner.style.display = 'none';
      
      const tbody = rankingTable.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="4" class="no-data">Não há dados de ranking disponíveis no momento.</td>
          </tr>
        `;
      }
    }
  } catch (error) {
    console.error('Load Ranking Error:', error);
    
    loadingSpinner.style.display = 'none';
    
    const tbody = rankingTable.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="error-message">Erro ao carregar ranking. Tente novamente mais tarde.</td>
        </tr>
      `;
    }
  }
}

/**
 * @param {HTMLElement} table - Table element
 * @param {Array} rankingData - Ranking data
 */
function renderRanking(table, rankingData) {
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  rankingData.forEach((user, index) => {
    const position = index + 1;
    const row = document.createElement('tr');
    
    if (position <= 3) {
      row.classList.add('top-3');
    }
    
    const positionCell = document.createElement('td');
    positionCell.className = 'position';
    positionCell.textContent = position;
    
    const nameCell = document.createElement('td');
    nameCell.textContent = user.nome;
    
    const scoreCell = document.createElement('td');
    scoreCell.textContent = user.score;
    
    row.appendChild(positionCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    
    tbody.appendChild(row);
  });
}