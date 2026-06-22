function renderHero(data) {
  var d = data.data;
  return '<header class="hero" id="' + data.id + '"><div class="hero-text">' +
    (d.badge ? '<span class="hero-tag">' + d.badge + '</span>' : '') +
    '<h1>' + d.name + (d.accent ? '<br><span>' + d.accent + '</span>' : '') + '</h1>' +
    (d.tagline ? '<p class="hero-tagline">' + d.tagline + '</p>' : '') +
    (d.description ? '<p class="hero-desc">' + d.description + '</p>' : '') +
    '</div>' +
    (d.image ? '<img src="' + d.image + '" alt="' + (d.alt || '') + '" fetchpriority="high" class="hero-img" width="800" height="1000">' : '') +
    '</header><div class="section-divider"></div>';
}

function renderAbout(data) {
  var d = data.data;
  var text = (d.paragraphs || []).join(' ');
  return '<section id="' + data.id + '"><div class="container"><div class="section-header">' +
    '<p>' + (d.heading_label || '') + '</p>' +
    '<h2>' + (d.heading || '') + '</h2></div>' +
    '<div class="bio-content"><p class="bio-text">' + text + '</p></div>' +
    '</div></section>';
}

function renderEducation(data) {
  var d = data.data;
  return '<section id="' + data.id + '"><div class="container"><div class="section-header">' +
    '<p>' + (d.heading_label || '') + '</p>' +
    '<h2>' + (d.heading || '') + '</h2></div><div class="grid-3">' +
    (d.items || []).map(function(item) {
      return '<div class="card"><h3>' + item.degree + '</h3><p>' + item.institution + '</p></div>';
    }).join('') +
    '</div></div></section>';
}

function renderPublications(data) {
  var d = data.data;
  return '<section id="' + data.id + '"><div class="container"><div class="section-header">' +
    '<p>' + (d.heading_label || '') + '</p>' +
    '<h2>' + (d.heading || '') + '</h2></div><div class="pub-list">' +
    (d.items || []).map(function(item) {
      var linksHtml = (item.links || []).map(function(l) {
        return '<a href="' + (l.url || '#') + '" class="pub-link">' + (l.label || 'Link') + '</a>';
      }).join('');
      return '<div class="pub-row"><div>' +
        '<span class="pub-title">' + item.title + '</span>' +
        '<span class="pub-meta">// ' + item.journal + '</span></div>' + linksHtml +
        '</div>';
    }).join('') +
    '</div></div></section>';
}

function renderProjects(data) {
  var d = data.data;
  return '<section id="' + data.id + '"><div class="container"><div class="section-header">' +
    '<p>' + (d.heading_label || '') + '</p>' +
    '<h2>' + (d.heading || '') + '</h2></div><div class="grid-3">' +
    (d.items || []).map(function(item) {
      return '<div class="project-item"><img src="' + item.image + '" alt="' + (item.alt || '') + '" loading="lazy" width="500" height="375"></div>';
    }).join('') +
    '</div></div></section>';
}

function renderBlog(data) {
  var d = data.data;
  return '<section id="' + data.id + '"><div class="container"><div class="section-header">' +
    '<p>' + (d.heading_label || '') + '</p>' +
    '<h2>' + (d.heading || '') + '</h2></div><div class="field-notes">' +
    (d.items || []).map(function(item) {
      return '<div class="note-meta">' + item.meta + '</div>' +
        '<p class="note-text">' + item.text + '</p>';
    }).join('') +
    '</div></div></section>';
}

function renderContact(data) {
  var d = data.data;
  return '<section id="' + data.id + '" class="cta-wrapper"><div class="container"><div class="cta-box">' +
    '<h2>' + (d.heading || '') + '</h2>' +
    '<p>' + (d.message || '') + '</p>' +
    '<a href="mailto:' + (d.email || '') + '" class="cta-btn">' + (d.button || 'Send') + '</a>' +
    '</div></div></section>';
}
