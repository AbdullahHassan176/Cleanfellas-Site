// ===== Cleanfellas CC — shared site scripts =====

// Footer year
document.querySelectorAll('#year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Mobile nav toggle
var navToggle = document.querySelector('.nav-toggle');
var navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Header shrink + scroll progress + back-to-top =====
var header = document.querySelector('.site-header');
var progressBar = document.querySelector('.scroll-progress');
var backToTop = document.querySelector('.back-to-top');

function onScroll() {
  var y = window.scrollY || document.documentElement.scrollTop;
  if (header) header.classList.toggle('scrolled', y > 40);
  if (progressBar) {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  if (backToTop) backToTop.classList.toggle('show', y > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Scroll-reveal animations + stat counters =====
// Uses a viewport-position check on scroll/resize so it works even where
// IntersectionObserver callbacks are throttled (embedded webviews, etc.).
function isInView(el, margin) {
  var r = el.getBoundingClientRect();
  var vh = window.innerHeight || document.documentElement.clientHeight;
  return r.top < vh - (margin || 40) && r.bottom > 0;
}

function animateCount(el) {
  var target = parseFloat(el.getAttribute('data-target'));
  var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  var prefix = el.getAttribute('data-prefix') || '';
  var suffix = el.getAttribute('data-suffix') || '';
  var duration = 1600;
  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

var pendingReveals = Array.from(document.querySelectorAll('.reveal'));
var pendingCounts = Array.from(document.querySelectorAll('.count'));

function checkInView() {
  pendingReveals = pendingReveals.filter(function (el) {
    if (isInView(el, 40)) { el.classList.add('visible'); return false; }
    return true;
  });
  pendingCounts = pendingCounts.filter(function (el) {
    if (isInView(el, 10)) { animateCount(el); return false; }
    return true;
  });
  if (!pendingReveals.length && !pendingCounts.length) {
    window.removeEventListener('scroll', checkInView);
    window.removeEventListener('resize', checkInView);
  }
}
window.addEventListener('scroll', checkInView, { passive: true });
window.addEventListener('resize', checkInView);
checkInView();
// Re-check once fonts/images settle layout
window.addEventListener('load', checkInView);

// ===== Auto-rotating hygiene facts =====
var rotator = document.querySelector('.fact-rotator');
if (rotator) {
  var facts = rotator.querySelectorAll('.fact');
  var dotsWrap = document.querySelector('.fact-dots');
  var current = 0;
  var timer = null;

  facts.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Show fact ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', function () { show(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll('button');

  function show(i) {
    facts[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    facts[current].classList.add('active');
    dots[current].classList.add('active');
  }
  function next() { show((current + 1) % facts.length); }
  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }
  facts[0].classList.add('active');
  restart();
}

// ===== Gallery lightbox =====
var galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
var lightbox = document.querySelector('.lightbox');
if (galleryItems.length && lightbox) {
  var lbImg = lightbox.querySelector('img');
  var lbCaption = lightbox.querySelector('figcaption');
  var lbIndex = 0;

  function openLightbox(i) {
    lbIndex = i;
    var img = galleryItems[i].querySelector('img');
    var cap = galleryItems[i].querySelector('figcaption');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.innerHTML = cap ? cap.innerHTML : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function stepLightbox(dir) {
    openLightbox((lbIndex + dir + galleryItems.length) % galleryItems.length);
  }

  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(i); });
  });
  lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); stepLightbox(-1); });
  lightbox.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); stepLightbox(1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
}

// ===== Booking form =====
var bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  var WHATSAPP_NUMBER = '27824911234'; // Faye Khan — 082 491 1234
  var BOOKING_EMAIL = 'cleanfellas@absamail.co.za';

  // Pre-select service when arriving via ?service=... links
  var params = new URLSearchParams(window.location.search);
  var preselect = params.get('service');
  if (preselect) {
    var serviceSelect = document.getElementById('service');
    for (var i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text === preselect) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Don't allow booking dates in the past
  var dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  var get = function (id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  function buildMessage() {
    var lines = [
      'NEW BOOKING REQUEST — Cleanfellas Website',
      '',
      'Name: ' + get('name'),
      'Phone: ' + get('phone'),
      get('email') ? 'Email: ' + get('email') : '',
      get('company') ? 'Company: ' + get('company') : '',
      'Service: ' + get('service'),
      get('date') ? 'Preferred date: ' + get('date') : '',
      get('time') ? 'Preferred time: ' + get('time') : '',
      get('location') ? 'Location: ' + get('location') : '',
      get('details') ? '\n' + 'Details: ' + get('details') : ''
    ].filter(function (l) { return l !== ''; });

    // Keep the blank line after the heading
    return lines[0] + '\n\n' + lines.slice(1).join('\n');
  }

  // Live message preview — updates automatically as the customer types
  var preview = document.getElementById('msg-preview');
  var previewBody = document.getElementById('msg-preview-body');
  function refreshPreview() {
    if (!preview || !previewBody) return;
    var hasContent = get('name') || get('phone') || get('service');
    preview.classList.toggle('show', !!hasContent);
    if (hasContent) previewBody.textContent = buildMessage();
  }
  bookingForm.addEventListener('input', refreshPreview);
  bookingForm.addEventListener('change', refreshPreview);
  refreshPreview();

  var sendMethod = 'whatsapp';
  bookingForm.querySelectorAll('button[data-send]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      sendMethod = btn.getAttribute('data-send');
    });
  });

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic required-field validation
    var required = ['name', 'phone', 'service'];
    var valid = true;
    required.forEach(function (id) {
      var field = document.getElementById(id);
      if (!field.value.trim()) {
        field.style.borderColor = '#d64545';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    if (!valid) return;

    var message = buildMessage();

    if (sendMethod === 'whatsapp') {
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message), '_blank');
    } else {
      var subject = 'Booking Request: ' + get('service') + ' — ' + get('name');
      window.location.href = 'mailto:' + BOOKING_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(message);
    }

    var success = document.getElementById('form-success');
    if (success) {
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}
