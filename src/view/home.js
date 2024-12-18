import { html } from '../../node_modules/lit-html/lit-html.js';

const homeTemplate = () => html`
  <section class="center-container">
    <div class="center-content">
      <h1>Welcome to Squarez</h1>
      <p>A game where you click squares and earn points! The game ends when you click on an empty space.</p>
    </div>
  </section>
`;

export const homePage = (ctx) => {
  ctx.render(homeTemplate());
};