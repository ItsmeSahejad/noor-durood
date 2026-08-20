const accessibilityStyle = document.createElement('style');
accessibilityStyle.textContent = ':focus-visible{outline:2px solid #aa6251;outline-offset:4px}.button:focus-visible,.small-button:focus-visible{outline-color:#b99a59}@media(max-width:560px){.main-arabic{letter-spacing:0}}';
document.head.append(accessibilityStyle);

const storage = {
  get: (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)),
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value))
};

const todayKey = new Date().toISOString().slice(0, 10);
let countData = storage.get('noorDuroodCounts', { date: todayKey, today: 0, total: 0 });
if (countData.date !== todayKey) countData = { date: todayKey, today: 0, total: countData.total || 0 };

const $ = id => document.getElementById(id);
const navigation = $('nav');
const menuButton = $('menu');

function renderCounts() {
  $('todayCount').textContent = countData.today;
  $('totalCount').textContent = countData.total;
  storage.set('noorDuroodCounts', countData);
}

function toast(message) {
  const notice = $('toast');
  notice.textContent = message;
  notice.classList.add('show');
  window.setTimeout(() => notice.classList.remove('show'), 3000);
}

$('completeDurood').addEventListener('click', () => {
  countData.today += 1;
  countData.total += 1;
  renderCounts();
  $('confirmation').textContent = 'Alhamdulillah 🤍 Your personal Durood count has been saved.';
  $('completeDurood').animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.025)' }, { transform: 'scale(1)' }],
    { duration: 260, easing: 'ease-out' }
  );
});

$('resetToday').addEventListener('click', () => {
  countData.today = 0;
  renderCounts();
  toast('Today’s personal count has been reset.');
});

function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});

const savedReminder = storage.get('noorDuroodReminder', null);
if (savedReminder) {
  const option = document.querySelector(`input[name="reminder"][value="${savedReminder}"]`);
  if (option) option.checked = true;
}

$('reminderForm').addEventListener('submit', event => {
  event.preventDefault();
  const selected = new FormData(event.currentTarget).get('reminder');
  $('reminderStatus').textContent = selected
    ? `${selected} reminder preference saved on this device.`
    : 'Please choose a time first.';
  if (selected) {
    storage.set('noorDuroodReminder', selected);
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  }
});

try {
  const now = new Date();
  $('gregorianDate').textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(now);
  $('hijriDate').textContent = new Intl.DateTimeFormat('en-u-ca-islamic', {
    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
  }).format(now);
} catch {
  $('hijriDate').textContent = 'Hijri date unavailable on this browser';
}

renderCounts();
