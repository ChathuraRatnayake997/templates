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
  var items = d.items || [];
  var tabs = items.map(function(item, i) {
    var active = i === 0 ? ' active' : '';
    return '<button class="edu-tab-btn' + active + '" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '" aria-controls="panel-' + item.id + '" id="tab-' + item.id + '" onclick="switchEduConsole(\'' + item.id + '\')">' +
      '<span class="edu-tab-num">' + item.tab_num + '</span>' +
      '<span class="edu-tab-heading">' + item.tab_heading + '</span>' +
      '<span class="edu-tab-meta">' + item.tab_meta + '</span></button>';
  }).join('');
  var panels = items.map(function(item, i) {
    var dateRange = item.start && item.end ? '<span class="edu-date">' + item.start + ' \u2013 ' + item.end + '</span>' : '';
    var location = item.location ? '<span class="edu-location">' + item.location + '</span>' : '';
    var specs = (item.specs || []).map(function(s) {
      return '<div class="edu-spec-row"><span class="edu-spec-key">' + s.key + '</span><span class="edu-spec-val">' + s.val + '</span></div>';
    }).join('');
    var highlights = item.highlights && item.highlights.length ? '<div class="edu-highlights"><span class="edu-spec-lbl">Highlights</span><ul>' + item.highlights.map(function(h) { return '<li>' + h + '</li>'; }).join('') + '</ul></div>' : '';
    var link = item.link ? '<a href="' + item.link.url + '" class="edu-link">' + item.link.text + '</a>' : '';
    return '<div id="panel-' + item.id + '" class="edu-panel' + (i === 0 ? ' active' : '') + '" role="tabpanel" aria-labelledby="tab-' + item.id + '"' + (i !== 0 ? ' style="display:none"' : '') + '>' +
      '<div class="edu-panel-header"><span class="edu-spec-lbl">Credential Specification</span>' +
      '<h3 class="edu-panel-title">' + item.title + '</h3>' +
      '<p class="edu-panel-institution">' + item.institution + dateRange + location + '</p></div>' +
      '<div class="edu-specs">' + specs + '</div>' + highlights + link + '</div>';
  }).join('');
  return '<section id="' + data.id + '"><div class="container"><div class="section-header">' +
    '<p>' + (d.heading_label || '') + '</p>' +
    '<h2>' + (d.heading || '') + '</h2>' +
    (d.description ? '<p class="section-desc">' + d.description + '</p>' : '') + '</div>' +
    '<div class="edu-console"><div class="edu-nav" role="tablist">' +
    tabs + '</div><div class="edu-display">' + panels + '</div></div></div></section>';
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
