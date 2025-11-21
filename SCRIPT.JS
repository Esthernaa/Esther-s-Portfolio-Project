// Dark/Light mode toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');

if (savedTheme) root.setAttribute('data-theme', savedTheme);

function updateThemeButtonLabel() {
  const isDark = root.getAttribute('data-theme') === 'dark';
  themeToggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  themeToggleBtn.setAttribute('aria-pressed', String(isDark));
}
updateThemeButtonLabel();

themeToggleBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
  updateThemeButtonLabel();
});

// Responsive mobile menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('open');
});
navMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// Form validation
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

function showError(input, message) {
  const small = input.parentElement.querySelector('.error');
  small.textContent = message || '';
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name;
  const email = form.email;
  const message = form.message;

  let valid = true;

  if (name.value.trim().length < 2) {
    showError(name, 'Please enter at least 2 characters.');
    valid = false;
  } else showError(name, '');

  if (!validateEmail(email.value)) {
    showError(email, 'Please enter a valid email address.');
    valid = false;
  } else showError(email, '');

  if (message.value.trim().length < 10) {
    showError(message, 'Message should be at least 10 characters.');
    valid = false;
  } else showError(message, '');

  if (valid) {
    statusEl.textContent = 'Thanks! Your message has been (pretend) sent.';
    form.reset();
    // Optionally: simulate async submit
    // setTimeout(() => { statusEl.textContent = ''; }, 4000);
  } else {
    statusEl.textContent = 'Please fix the errors and try again.';
  }
});

// Scroll reveal animation via IntersectionObserver
const revealTargets = document.querySelectorAll('.project-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealTargets.forEach(el => observer.observe(el));

// Dynamic project search/filter
const searchInput = document.getElementById('project-search');
const filterSelect = document.getElementById('project-filter');
const projectCards = Array.from(document.querySelectorAll('.project-card'));

function applyFilter() {
  const q = (searchInput.value || '').toLowerCase().trim();
  const tag = filterSelect.value;

  projectCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('p').textContent.toLowerCase();
    const tags = (card.dataset.tags || '').toLowerCase();

    const matchesText = !q || title.includes(q) || desc.includes(q);
    const matchesTag = tag === 'all' || tags.includes(tag);

    card.style.display = matchesText && matchesTag ? '' : 'none';
  });
}

searchInput.addEventListener('input', applyFilter);
filterSelect.addEventListener('change', applyFilter);
applyFilter();
