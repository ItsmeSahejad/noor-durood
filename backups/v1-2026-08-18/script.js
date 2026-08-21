const countButton = document.getElementById('countButton');
const count = document.getElementById('count');
const message = document.getElementById('countMessage');
const soundButton = document.getElementById('soundButton');
let blessings = 0;

countButton.addEventListener('click', () => {
  blessings += 1;
  count.textContent = blessings;
  message.textContent = blessings === 1 ? 'A blessing has been sent' : `${blessings} blessings offered with love`;
  countButton.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 280 });
});

soundButton.addEventListener('click', () => {
  soundButton.innerHTML = '◖ <small>RECITATION COMING SOON</small>';
  setTimeout(() => { soundButton.innerHTML = '◖ <small>LISTEN</small>'; }, 2400);
});
