var renderers = { hero: renderHero, about: renderAbout, education: renderEducation, publications: renderPublications, projects: renderProjects, blog: renderBlog, contact: renderContact };

var defaultSections = ['hero.json', 'about.json', 'education.json', 'publications.json', 'projects.json', 'blog.json', 'contact.json'];

function init() {
  loadTheme();
  document.querySelectorAll('[data-toggle-theme]').forEach(function(el) { el.addEventListener('click', toggleTheme); });
  fetchJSON('data/site.json').then(function(siteData) {
    var sectionFiles = siteData.sections && siteData.sections.length ? siteData.sections : defaultSections;
    document.title = siteData.title || document.title;
    if (siteData.favicon) document.querySelector('link[rel="icon"]').href = siteData.favicon;
    var brandEl = document.getElementById('brandName');
    if (brandEl && siteData.name) brandEl.textContent = siteData.name;
    var nav = document.querySelector('.nav-links');
    var mobileNav = document.querySelector('.mobile-overlay');
    var app = document.getElementById('app');
    app.innerHTML = '';
    var sectionIds = [];
    var chain = Promise.resolve();
    var renderIndex = 0;
    sectionFiles.forEach(function(file) {
      chain = chain.then(function() {
        return fetchJSON('data/' + file).then(function(section) {
          if (!section.enabled) return;
          var render = renderers[section.type];
          if (!render) return;
          app.innerHTML += render(section);
          sectionIds.push(section.id);
          if (section.navigation && section.navigation.show && nav) {
            var a = document.createElement('a');
            a.href = '#' + section.id;
            a.className = 'nav-link';
            a.textContent = section.navigation.label;
            nav.appendChild(a);
            var ma = a.cloneNode(true);
            if (mobileNav) mobileNav.insertBefore(ma, mobileNav.querySelector('.mobile-close'));
          }
          renderIndex++;
        }).catch(function(e) { console.warn('Skipping ' + file + ':', e); });
      });
    });
    return chain.then(function() {
      initScrollSpy(sectionIds);
      initSmartNav();
      initMobileMenu();
      initCVButton(siteData);
      var footer = document.querySelector('footer');
      if (footer && siteData.footer) {
        footer.style.display = 'block';
        var fName = footer.querySelector('.footer-name');
        var fTag = footer.querySelector('.footer-tagline');
        var fLinks = footer.querySelector('.footer-links');
        if (fName) fName.textContent = siteData.footer.name || '';
        if (fTag) fTag.textContent = siteData.footer.tagline || '';
        if (fLinks && siteData.footer.links) {
          fLinks.innerHTML = siteData.footer.links.map(function(l) { return '<a href="' + (l.url || '#') + '" class="footer-link">' + l.label + '</a>'; }).join('');
        }
      }
      setTimeout(function() {
        initContactForm();
        var contactSection = null;
        fetchJSON('data/contact.json').then(function(s) { contactSection = s; }).catch(function() {});
        if (contactSection && contactSection.emailjs && typeof emailjs !== 'undefined') {
          emailjs.init(contactSection.emailjs.public_key);
        }
      }, 100);
    });
  }).catch(function(e) { console.error('Init failed:', e); });
}

document.addEventListener('DOMContentLoaded', init);
