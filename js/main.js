/* =============================================
   SAIAE 2026 SYMPOSIUM — MAIN JS
   ============================================= */

// --- Mobile nav toggle ---
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// --- Sticky nav: deepen the glass once scrolled (keeps links readable over light content) ---
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => {
    if (window.scrollY > 10) {
      navbar.style.background = 'rgba(26, 92, 46, 0.92)';
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,.28)';
    } else {
      navbar.style.background = 'rgba(26, 92, 46, 0.78)';
      navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,.18)';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Timetable day tabs ---
const tabBtns  = document.querySelectorAll('.tab-btn');
const dayPanels = document.querySelectorAll('.day-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    dayPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.day);
    if (target) target.classList.add('active');
  });
});

// --- Collapsible accordions (speakers page) ---
document.querySelectorAll('.accordion').forEach(acc => {
  const header = acc.querySelector('.accordion-header');
  const body   = acc.querySelector('.accordion-body');
  const meta   = acc.querySelector('.acc-meta');

  // Auto-fill the count badge (stays accurate as speakers/topics are added)
  if (meta && body) {
    const speakers = body.querySelectorAll('.speaker-card-compact').length;
    const chips    = body.querySelectorAll('.topic-chip').length;
    if (speakers)   meta.textContent = speakers + (speakers === 1 ? ' speaker' : ' speakers');
    else if (chips) meta.textContent = chips + ' topics';
  }

  if (header) {
    header.addEventListener('click', () => {
      const open = acc.classList.toggle('open');
      header.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
});

// --- Abstract word counter ---
const abstractText = document.getElementById('abstractText');
const wordCount    = document.getElementById('wordCount');
if (abstractText && wordCount) {
  const LIMIT = 300;
  abstractText.addEventListener('input', () => {
    const words = abstractText.value.trim().split(/\s+/).filter(w => w.length > 0).length;
    wordCount.textContent = `${words} / ${LIMIT} words`;
    wordCount.style.color = words > LIMIT ? '#c0392b' : 'var(--green-mid)';
  });
}

// --- Form validation + FormSubmit delivery ---
// Forms POST to FormSubmit (https://formsubmit.co), so no server is needed. On a
// valid submit we set the _next redirect to this site's own thank-you page (on
// whatever domain it's deployed to), then let the form submit natively — that way
// file attachments (e.g. the abstract author photo) are included.
function setupForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', e => {
    // Point FormSubmit's redirect at our own thank-you page on the current domain
    const nextInput = form.querySelector('input[name="_next"]');
    if (nextInput) {
      nextInput.value = window.location.origin +
        '/thank-you.html?type=' + (form.dataset.type || '');
    }

    // Validate required fields
    let valid = true;
    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value || (field.type === 'checkbox' && !field.checked)) {
        field.style.borderColor = '#c0392b';
        if (!firstInvalid) firstInvalid = field;
        valid = false;
      }
    });

    if (!valid) {
      e.preventDefault();
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    // Valid → let the form submit to FormSubmit (handles files + redirect to _next)
  });

  // Clear red border as the user corrects fields
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => (el.style.borderColor = ''));
    el.addEventListener('change', () => (el.style.borderColor = ''));
  });
}

setupForm('registrationForm');
setupForm('abstractForm');

// --- Thank-you page: tailor the message to the form that was submitted ---
(function () {
  const heading = document.getElementById('thankHeading');
  const body    = document.getElementById('thankBody');
  if (!heading || !body) return;
  const type = new URLSearchParams(window.location.search).get('type');
  if (type === 'abstract') {
    heading.textContent = 'Abstract Received!';
    body.innerHTML = 'Thank you for your submission. You will receive an acknowledgement shortly, and the SAIAE National Council will notify you of the outcome by <strong>31 August 2026</strong>.';
  } else if (type === 'registration') {
    heading.textContent = 'Registration Received!';
    body.innerHTML = 'Thank you for registering. You will receive confirmation and payment details by email. Remember: <strong>proof of payment is due by 05 October 2026</strong>.';
  }
})();

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
