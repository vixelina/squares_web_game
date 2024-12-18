import { html } from '../../node_modules/lit-html/lit-html.js';

const endTemplate = () => html`
  <section class="center-container">
    <div class="center-content">
      <h1>Game ended!</h1>
      <p>Final score: ${localStorage.getItem('finalScore')}</p>
    </div>
  </section>
`;

export const endPage = (ctx) => {
    document.querySelector('header').style.display = 'flex';
    document.querySelector('footer').style.display = 'flex';
    document.querySelector('#content').style.display = 'block';
    
    ctx.render(endTemplate());
    localStorage.setItem('username', null);
    localStorage.setItem('finalScore', 0);
};