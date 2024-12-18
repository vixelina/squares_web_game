import { html } from '../../node_modules/lit-html/lit-html.js';

let scores = [];
let sortColumn = 'date';
let sortDirection = 'desc';
let searchTerm = '';
let currentPage = 1;
const scoresPerPage = 13;
const regex = /^[a-zA-Z0-9]*$/;

const dashTemplate = (onSearch, onPageChange, onSort) => html`
  <section class="container">
    <div>
      <div class="search-container">
        <input type="text" id="searchInput" placeholder="Search by username" @input=${search}>
        <button @click=${onSearch}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Username</th>
            <th @click=${onSort}>
              Score
              ${sortColumn == 'score'
                ? sortDirection == 'asc'
                  ? '▲'
                  : sortDirection == 'desc'
                  ? '▼'
                  : ''
                : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          ${currentPageScores().length > 0
            ? currentPageScores().map(
                (score) => html`
                  <tr>
                    <td>${new Date(score.date).toLocaleString()}</td>
                    <td>${score.username}</td>
                    <td>${score.score}</td>
                  </tr>
                `
              )
            : html`
                <tr>
                  <td colspan="3">Username "${searchTerm}" not found</td>
                </tr>
              `}
          ${Array.from(
            { length: Math.max(0, scoresPerPage - currentPageScores().length) },
            () => html`
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            `
          )}
        </tbody>
      </table>
      ${totalPages() > 1
        ? html`
            <div class="pagination">
              ${Array.from({ length: totalPages() }, (_, i) => i + 1).map(
                (page) => html`
                  <span
                    class=${page == currentPage ? 'active' : ''}
                    @click=${() => onPageChange(page)}
                  >
                    ${page}
                  </span>
                `
              )}
            </div>
          `
        : ''}
    </div>
  </section>
`;

async function fetchScores() {
  try {
    const url =
      sortColumn == 'none'
        ? `http://localhost:3030/scores`
        : `http://localhost:3030/scores?sortBy=${sortColumn}&order=${sortDirection}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch scores');
    }
    scores = await response.json();
    render();
  } catch (error) {
    console.error('Error fetching scores:', error);
  }
}

function search(ctx) {
  const input = document.getElementById('searchInput').value.trim();

  if (!regex.test(input)) {
    alert('Invalid username. Only letters and numbers are allowed.');
    return;
  }

  searchTerm = input.toLowerCase();
  currentPage = 1;
  ctx.render(dashTemplate(() => search(ctx), (page) => changePage(ctx, page), () => sortScores(ctx)));
}

function filter() {
  if (searchTerm == '') {
    return scores;
  } else {
    return scores.filter((score) =>
      score.username.toLowerCase() == searchTerm
    );
  }
}

function currentPageScores() {
  const filteredScores = filter();
  const start = (currentPage - 1) * scoresPerPage;
  const end = start + scoresPerPage;
  return filteredScores.slice(start, end);
}

function totalPages() {
  return Math.ceil(filter().length / scoresPerPage);
}

function changePage(ctx, page) {
  currentPage = page;
  ctx.render(dashTemplate(() => search(ctx), (page) => changePage(ctx, page), () => sortScores(ctx)));
}

function sortScores(ctx) {
  if (sortColumn == 'score') {
    if (sortDirection == 'asc') {
      sortDirection = 'desc';
    } else if (sortDirection == 'desc') {
      sortColumn = 'none';
      sortDirection = '';
    } else {
      sortDirection = 'asc';
    }
  } else {
    sortColumn = 'score';
    sortDirection = 'asc';
  }
  fetchScores().then(() => {
    ctx.render(dashTemplate(() => search(ctx), (page) => changePage(ctx, page), () => sortScores(ctx)));
  });
}

export const dashPage = async (ctx) => {
  await fetchScores();
  searchTerm = '';
  currentPage = 1;
  ctx.render(dashTemplate(() => search(ctx), (page) => changePage(ctx, page), () => sortScores(ctx)));
};
