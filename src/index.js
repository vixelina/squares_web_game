import page from "../node_modules/page/page.mjs";
import { render } from "../node_modules/lit-html/lit-html.js";

import { homePage } from "./view/home.js";
import { createPage } from "./view/new-game.js";
import { endPage } from "./view/game-end.js";
import { dashPage } from "./view/dashboard.js";

const main = document.querySelector("#content");
const overlay = document.getElementById('overlay');

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.page = page;
    next();
}

page("/", decorateContext, (ctx, next) => {
    overlay.classList.remove('disabled');
    homePage(ctx, next);
});

page("/new-game", decorateContext, (ctx, next) => {
    createPage(ctx, next);
});

page("/game-end", decorateContext, (ctx, next) => {
    overlay.classList.remove('disabled');
    endPage(ctx, next);
});

page("/dashboard", decorateContext, (ctx, next) => {
    overlay.classList.remove('disabled');
    dashPage(ctx, next);
});

page.start();   