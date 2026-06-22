function fetchJSON(path) {
  return fetch(path).then(function(res) {
    if (!res.ok) throw new Error('Failed to load ' + path);
    return res.text().then(function(text) { return JSON.parse(stripComments(text)); });
  });
}

function initScrollSpy(sectionIds) {
  var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!navLinks.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function(link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-70px 0px -40% 0px' });
  sectionIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

function initMobileMenu() {
  var toggle = document.querySelector('.mobile-toggle');
  var overlay = document.querySelector('.mobile-overlay');
  var close = document.querySelector('.mobile-close');
  if (!toggle || !overlay) return;
  function closeMenu() {
    overlay.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }
  toggle.addEventListener('click', function() {
    overlay.classList.add('active');
    document.body.classList.add('overflow-hidden');
  });
  if (close) close.addEventListener('click', closeMenu);
  overlay.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
}

function initSmartNav() {
  var navEl = document.querySelector('nav');
  var navLinks = document.querySelector('.nav-links');
  if (!navEl || !navLinks) return;
  function checkOverflow() {
    var navRight = navLinks.parentElement;
    if (!navRight) return;
    var linksRight = navLinks.getBoundingClientRect().right;
    var buttons = navRight.querySelectorAll(':scope > .cv-btn, :scope > .theme-toggle, :scope > .mobile-toggle');
    var buttonsLeft = navRight.getBoundingClientRect().right;
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].offsetWidth > 0) {
        buttonsLeft = buttons[i].getBoundingClientRect().left;
        break;
      }
    }
    if (linksRight > buttonsLeft - 8) {
      navEl.classList.add('nav-collapsed');
    } else {
      navEl.classList.remove('nav-collapsed');
    }
  }
  setTimeout(checkOverflow, 50);
  window.addEventListener('resize', checkOverflow);
}

function initCVButton(siteData) {
  var btns = document.querySelectorAll('.cv-btn');
  if (!btns.length || !siteData.cv) return;
  var cv = siteData.cv;
  btns.forEach(function(btn) {
    btn.textContent = cv.labels && cv.labels[cv.mode] ? cv.labels[cv.mode] : 'CV';
    btn.addEventListener('click', function(e) {
    e.preventDefault();
    if (cv.mode === 'view') {
      window.open(cv.viewer + '?url=' + encodeURIComponent(cv.path), '_blank');
    } else if (cv.mode === 'download') {
      btn.textContent = 'Downloading...';
      btn.disabled = true;
      var url = cv.path;
      if (url.includes('github.com') && url.includes('/blob/')) {
        url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }
      fetch(url).then(function(r) { return r.blob(); }).then(function(blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = url.split('/').pop();
        a.click();
        URL.revokeObjectURL(a.href);
        btn.textContent = cv.labels ? cv.labels.download : 'Download';
        btn.disabled = false;
      }).catch(function() {
        window.open(url, '_blank');
        btn.textContent = cv.labels ? cv.labels.download : 'Download';
        btn.disabled = false;
      });
    } else if (cv.mode === 'external') {
      window.open(cv.external_url, '_blank');
    }
  });
  });
}

function switchEduConsole(credentialId) {
  var buttons = document.querySelectorAll('.edu-tab-btn');
  buttons.forEach(function(btn) {
    var isActive = btn.id === 'tab-' + credentialId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  var panels = document.querySelectorAll('.edu-panel');
  panels.forEach(function(panel) {
    panel.style.display = panel.id === 'panel-' + credentialId ? 'block' : 'none';
  });
}

function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
    var data = {
      service_id: form.dataset.serviceId,
      template_id: form.dataset.templateId,
      user_id: form.dataset.publicKey,
      template_params: {}
    };
    new FormData(form).forEach(function(value, key) { data.template_params[key] = value; });
    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    }).then(function(r) {
      if (btn) {
        btn.textContent = r.ok ? 'Sent!' : 'Failed -- try again';
        if (r.ok) form.reset();
      }
      setTimeout(function() { if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; } }, 3000);
    }).catch(function() {
      if (btn) { btn.textContent = 'Failed -- try again'; btn.disabled = false; }
      setTimeout(function() { if (btn) btn.textContent = 'Send Message'; }, 3000);
    });
  });
}
