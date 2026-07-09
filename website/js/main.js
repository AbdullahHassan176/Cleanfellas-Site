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

// ===== Subtle 3D tilt on service cards (desktop, motion allowed) =====
if (window.matchMedia('(hover: hover)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.card').forEach(function (card) {
    card.classList.add('tilt');
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
      var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
      card.style.transform = 'perspective(700px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
}

// ===== Booking wizard =====
var bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  var WHATSAPP_NUMBER = '27824911234'; // Faye Khan — 082 491 1234
  var BOOKING_EMAIL = 'cleanfellas@absamail.co.za';
  var TOTAL_STEPS = 4;
  var currentStep = 1;

  var get = function (id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };
  var set = function (id, v) {
    var el = document.getElementById(id);
    if (el) el.value = v;
  };

  // --- CRM: booking reference, generated once per booking ---
  var bookingRef = (function () {
    var d = new Date();
    var ymd = d.getFullYear().toString() +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      ('0' + d.getDate()).slice(-2);
    return 'CF-' + ymd + '-' + Math.floor(1000 + Math.random() * 9000);
  })();

  // --- CRM: where did this lead come from? ---
  function leadSource() {
    var p = new URLSearchParams(window.location.search);
    if (p.get('utm_source')) {
      return p.get('utm_source') + (p.get('utm_campaign') ? ' / ' + p.get('utm_campaign') : '');
    }
    if (document.referrer) {
      try {
        var host = new URL(document.referrer).hostname;
        if (host && host !== window.location.hostname) return host;
      } catch (err) { /* ignore malformed referrer */ }
    }
    return 'Direct visit';
  }

  // --- CRM: remember returning customers (this browser only) ---
  var CONTACT_KEY = 'cf_contact';
  try {
    var saved = JSON.parse(localStorage.getItem(CONTACT_KEY) || 'null');
    if (saved && saved.name) {
      set('name', saved.name);
      set('phone', saved.phone || '');
      set('email', saved.email || '');
      set('company', saved.company || '');
      var wb = document.getElementById('welcome-back');
      if (wb) {
        wb.textContent = '👋 Welcome back, ' + saved.name.split(' ')[0] + ' — we’ve filled in your details from last time. Just check they’re still right.';
        wb.classList.add('show');
      }
    }
  } catch (err) { /* localStorage unavailable — skip prefill */ }

  // --- chip / option-card selection groups ---
  function bindChoiceGroup(containerId, hiddenId, autoAdvance) {
    var wrap = document.getElementById(containerId);
    if (!wrap) return;
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-value]');
      if (!btn) return;
      wrap.querySelectorAll('[data-value]').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      set(hiddenId, btn.getAttribute('data-value'));
      hideError();
      if (autoAdvance) setTimeout(function () { goTo(2); }, 250);
    });
  }
  bindChoiceGroup('service-options', 'service', true);
  bindChoiceGroup('property-chips', 'property', false);
  bindChoiceGroup('urgency-chips', 'urgency', false);

  // Pre-select service when arriving via ?service=... links
  var params = new URLSearchParams(window.location.search);
  var preselect = params.get('service');
  if (preselect) {
    var match = document.querySelector('#service-options [data-value="' + preselect + '"]');
    if (match) {
      match.classList.add('selected');
      set('service', preselect);
      currentStep = 2; // skip straight to site details
    }
  }

  // Don't allow booking dates in the past
  var dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // --- wizard navigation ---
  var errBox = document.getElementById('wiz-error');
  function showError(msg) { errBox.textContent = msg; errBox.classList.add('show'); }
  function hideError() { errBox.classList.remove('show'); }

  function validateStep(step) {
    if (step === 1 && !get('service')) {
      showError('Please choose a service to continue.');
      return false;
    }
    if (step === 3) {
      var ok = true;
      ['name', 'phone'].forEach(function (id) {
        var f = document.getElementById(id);
        if (!f.value.trim()) { f.style.borderColor = '#d64545'; ok = false; }
        else { f.style.borderColor = ''; }
      });
      if (!ok) showError('Please fill in your name and phone number so we can reach you.');
      return ok;
    }
    return true;
  }

  function goTo(step) {
    hideError();
    currentStep = step;
    document.querySelectorAll('.wiz-panel').forEach(function (p) {
      p.classList.toggle('active', p.getAttribute('data-panel') == step);
    });
    document.querySelectorAll('.wiz-step').forEach(function (s) {
      var n = parseInt(s.getAttribute('data-step'), 10);
      s.classList.toggle('active', n === step);
      s.classList.toggle('done', n < step);
    });
    var bar = document.getElementById('wiz-bar');
    if (bar) bar.style.width = ((step - 1) / (TOTAL_STEPS - 1) * 80) + '%';

    document.getElementById('wiz-back').style.visibility = step === 1 ? 'hidden' : 'visible';
    document.getElementById('wiz-next').style.display = step === TOTAL_STEPS ? 'none' : '';

    if (step === TOTAL_STEPS) buildReview();
    var card = document.querySelector('.form-card');
    if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView({ behavior: 'smooth' });
  }

  document.getElementById('wiz-next').addEventListener('click', function () {
    if (validateStep(currentStep)) goTo(Math.min(currentStep + 1, TOTAL_STEPS));
  });
  document.getElementById('wiz-back').addEventListener('click', function () {
    goTo(Math.max(currentStep - 1, 1));
  });

  // --- review summary ---
  function reviewRows() {
    return [
      ['Service', get('service')],
      ['Property', get('property')],
      ['Urgency', get('urgency')],
      ['Location', get('location')],
      ['Preferred date', get('date')],
      ['Preferred time', get('time')],
      ['Name', get('name')],
      ['Phone', get('phone')],
      ['Email', get('email')],
      ['Company', get('company')],
      ['Details', get('details')]
    ].filter(function (r) { return r[1]; });
  }

  function buildReview() {
    document.getElementById('booking-ref').textContent = 'Ref: ' + bookingRef;
    var dl = document.getElementById('review-list');
    dl.innerHTML = '';
    reviewRows().forEach(function (r) {
      var dt = document.createElement('dt');
      dt.textContent = r[0];
      var dd = document.createElement('dd');
      dd.textContent = r[1];
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
  }

  function buildMessage() {
    var head = 'NEW BOOKING REQUEST — Cleanfellas Website\nRef: ' + bookingRef;
    var body = reviewRows().map(function (r) { return r[0] + ': ' + r[1]; }).join('\n');
    var meta = '— Source: ' + leadSource() + ' · Submitted: ' + new Date().toLocaleString('en-ZA');
    return head + '\n\n' + body + '\n\n' + meta;
  }

  // --- calendar (.ics) download ---
  function downloadIcs() {
    var dateStr = get('date');
    var d = dateStr ? new Date(dateStr + 'T00:00:00') : new Date(Date.now() + 2 * 86400000);
    var pad = function (n) { return ('0' + n).slice(-2); };
    var ymd = d.getFullYear().toString() + pad(d.getMonth() + 1) + pad(d.getDate());
    var end = new Date(d.getTime() + 86400000);
    var ymdEnd = end.getFullYear().toString() + pad(end.getMonth() + 1) + pad(end.getDate());
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cleanfellas CC//Booking//EN',
      'BEGIN:VEVENT',
      'UID:' + bookingRef + '@cleanfellas.co.za',
      'DTSTAMP:' + ymd + 'T080000Z',
      'DTSTART;VALUE=DATE:' + ymd,
      'DTEND;VALUE=DATE:' + ymdEnd,
      'SUMMARY:Cleanfellas — ' + (get('service') || 'Deep clean') + ' (requested)',
      'DESCRIPTION:Booking reference ' + bookingRef + '. Cleanfellas will confirm the exact time. Office: 011 845 4444',
      'LOCATION:' + (get('location') || ''),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    var blob = new Blob([ics], { type: 'text/calendar' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'cleanfellas-booking-' + bookingRef + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }
  var icsBtn = document.getElementById('btn-ics');
  if (icsBtn) icsBtn.addEventListener('click', downloadIcs);

  // --- send ---
  var sendMethod = 'whatsapp';
  bookingForm.querySelectorAll('button[data-send]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      sendMethod = btn.getAttribute('data-send');
    });
  });

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(3)) return;

    var message = buildMessage();

    if (sendMethod === 'whatsapp') {
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message), '_blank');
    } else {
      var subject = 'Booking Request ' + bookingRef + ': ' + get('service') + ' — ' + get('name');
      window.location.href = 'mailto:' + BOOKING_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(message);
    }

    // CRM: remember this customer for next time (their browser only)
    try {
      localStorage.setItem(CONTACT_KEY, JSON.stringify({
        name: get('name'), phone: get('phone'), email: get('email'), company: get('company')
      }));
    } catch (err) { /* storage full/blocked — not critical */ }

    var success = document.getElementById('form-success');
    if (success) {
      document.getElementById('success-ref').textContent = bookingRef;
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    var postSend = document.getElementById('post-send');
    if (postSend) postSend.classList.add('show');
  });

  // initialise wizard position (handles ?service= skip)
  goTo(currentStep);
}
