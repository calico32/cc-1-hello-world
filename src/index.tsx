import { Application, Container, Sprite, Text, TextStyle } from 'pixi.js';
import React from 'react';
import { render } from 'react-dom';

import './index.scss';

const App = props => {
  return (
    <>
      <h1>hello world</h1>
      <button id="add-cats" className="mb-16">
        add more cats
      </button>
      <div id="view"></div>
    </>
  );
};

// layers
const spriteLayer = new Container();
const textLayer = new Container();

render(<App />, document.querySelector('#app'), () => {
  let game: Application;

  try {
    game = new Application({
      width: 1920,
      height: 1080,
    });
    document.querySelector('#view')?.appendChild(game.view);
  } catch (err) {
    console.error(err);
    if (
      err.message.includes(
        'WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.'
      )
    ) {
      render(
        <div id="error">
          <p>Your browser doesn&apos;t support WebGL.</p>
          <img src="/api/cat" alt="cat" />
        </div>,
        document.querySelector('#view')
      );
      (document.querySelector('#add-cats') as HTMLButtonElement).disabled = true;
    }
    return;
  }

  // dynamic resizing
  const ratio = game.renderer.width / game.renderer.height;
  window.addEventListener('resize', () => {
    const w = window.innerWidth * 0.9;
    const h = window.innerWidth * 0.7;

    const dimensions: [w: number, h: number] = w / h >= ratio ? [h * ratio, h] : [w, w / ratio];

    game.renderer.view.style.width = `${dimensions[0]}px`;
    game.renderer.view.style.height = `${dimensions[1]}px`;
  });
  window.dispatchEvent(new Event('resize'));

  // add the layers
  game.stage.addChild(spriteLayer, textLayer);

  // add in the text
  const textStyle = new TextStyle({
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 42,
    fill: 0xdddddd,
  });
  const text = new Text('hello\nworld!!!!', textStyle);
  text.x = 100;
  text.y = 100;

  const cats: Sprite[] = [];

  textLayer.addChild(text);

  // dvd-logo-like bouncing text
  const speed = 2;
  let xVel = speed;
  let yVel = speed;

  game.ticker.add(() => {
    const bounds = text.getBounds();

    if (bounds.left <= 0) xVel = speed;
    else if (bounds.right >= game.renderer.width) xVel = -speed;
    if (bounds.top <= 0) yVel = speed;
    else if (bounds.bottom >= game.renderer.height) yVel = -speed;

    text.x += xVel;
    text.y += yVel;
  });

  document.querySelector('#add-cats')?.addEventListener('click', async () => {
    // send a new get parameter each time so PIXI doesn't cache it
    const sprite = Sprite.from('/api/cat?now=' + Date.now());

    sprite.position.set(randomInt(game.renderer.width), randomInt(game.renderer.height));
    sprite.scale.set(randomFloat(0.2, 0.5));

    cats.push(sprite);

    if (cats.length > 50) {
      const cat = cats.splice(0, 1)[0];
      cat.destroy({ texture: true });
    }

    spriteLayer.addChild(sprite);
  });
});

function randomInt(max: number): number;
function randomInt(min: number, max: number): number;
function randomInt(min: number, max?: number): number {
  if (!max) return randomInt(0, min);

  return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(max: number): number;
function randomFloat(min: number, max: number): number;
function randomFloat(min: number, max?: number): number {
  if (!max) return randomFloat(0, min);

  return Math.random() * (max - min) + min;
}
