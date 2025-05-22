/**
 * Ranking page functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  loadRanking();
});

/**
 * Load ranking from API
 */
async function loadRanking() {
  const rankingTable = document.getElementById('ranking-table');
  const loadingSpinner = document.querySelector('.loading-spinner');
  
  if (!rankingTable || !loadingSpinner) return;
  
  try {
    // Call ranking API
    const rankingData = await apiRequest('/api/ranking', {
      method: 'GET'
    });
    
    if (rankingData && rankingData.length > 0) {
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
      
      // Render ranking
      renderRanking(rankingTable, rankingData);
    } else if (rankingData && rankingData.length === 0) {
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
      
      // Show no data message
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
    
    // Hide loading spinner
    loadingSpinner.style.display = 'none';
    
    // Show error message
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
 * Render ranking data in table
 * @param {HTMLElement} table - Table element
 * @param {Array} rankingData - Ranking data
 */
function renderRanking(table, rankingData) {
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  // Clear table
  tbody.innerHTML = '';
  
  // Create rows
  rankingData.forEach((user, index) => {
    const position = index + 1;
    const row = document.createElement('tr');
    
    // Add top-3 class for visual highlighting
    if (position <= 3) {
      row.classList.add('top-3');
    }
    
    // Create cells
    const positionCell = document.createElement('td');
    positionCell.className = 'position';
    positionCell.textContent = position;
    
    const nameCell = document.createElement('td');
    nameCell.textContent = user.nome;
    
    const scoreCell = document.createElement('td');
    scoreCell.textContent = user.score;
    
    // Append cells to row
    row.appendChild(positionCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    
    // Append row to table
    tbody.appendChild(row);
  });
}