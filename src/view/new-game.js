import { html } from '../../node_modules/lit-html/lit-html.js';

const regex = /^[a-zA-Z0-9]*$/;

const newGameTemplate = () => html`
  <section class="center-container">
    <div class="center-content">
      <h2>Enter Your Username</h2>
      <form id="username-form">
        <input type="text" id="username" name="username" required/>
        <button type="submit">Start Game</button>
      </form>
    </div>
  </section>
`;

export const createPage = (ctx) => {
  ctx.render(newGameTemplate());

  const form = document.getElementById('username-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = form.username.value.trim();
    if (!regex.test(username)) {
      alert('Invalid username. Only letters and numbers are allowed.');
      return;
    }

    if (username) {
      localStorage.setItem('username', username);
      document.querySelector('header').style.display = 'none';
      document.querySelector('footer').style.display = 'none';
      document.querySelector('#content').style.display = 'none';
      
      const scoreDisplay = document.createElement('div');
      scoreDisplay.id = 'score-display';
      scoreDisplay.innerHTML = 'Score: 0';
      scoreDisplay.style.position = 'fixed';
      scoreDisplay.style.top = '20px';
      scoreDisplay.style.left = '20px';
      scoreDisplay.style.color = 'white';
      scoreDisplay.style.fontSize = '24px';
      document.body.appendChild(scoreDisplay);
      document.getElementById('overlay').classList.add('disabled');
    } else {
      alert('Please enter a valid username!');
    }
  });
};