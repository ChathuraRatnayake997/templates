function renderHero(data) {
  var d = data.data;
  return '<header class="hero" id="' + data.id + '"><div class="hero-text">' +
    (d.badge ? '<span class="hero-tag">' + d.badge + '</span>' : '') +
    '<h1>' + d.name + (d.accent ? '<br><span>' + d.accent + '</span>' : '') + '</h1>' +
    (d.tagline ? '<p class="hero-tagline">' + nl2br(d.tagline) + '</p>' : '') +
    (d.description ? '<p class="hero-desc">' + nl2br(d.description) + '</p>' : '') +
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
    '<div class="bio-content"><p class="bio-text">' + nl2br(text) + '</p></div>' +
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
      return '<div class="edu-spec-row"><span class="edu-spec-key">' + s.key + '</span><span class="edu-spec-val">' + nl2br(s.val) + '</span></div>';
    }).join('');
    var highlights = item.highlights && item.highlights.length ? '<div class="edu-highlights"><span class="edu-spec-lbl">Highlights</span><ul>' + item.highlights.map(function(h) { return '<li>' + nl2br(h) + '</li>'; }).join('') + '</ul></div>' : '';
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
    (d.description ? '<p class="section-desc">' + nl2br(d.description) + '</p>' : '') + '</div>' +
    '<div class="edu-console"><div class="edu-nav" role="tablist">' +
    tabs + '</div><div class="edu-display">' + panels + '</div></div></div></section>';
}

function renderPublications(data) {
  var d = data.data;
  var headingHtml = '';
  if (d.heading && Array.isArray(d.heading)) {
    headingHtml = (d.heading_label ? '<p>' + d.heading_label + '</p>' : '') + '<h2>' + d.heading.join(' ') + '</h2>';
  } else {
    headingHtml = (d.heading_label ? '<p>' + d.heading_label + '</p>' : '') + '<h2>' + (d.heading || '') + '</h2>';
  }
  var focusHtml = d.focus ? '<p class="pub-focus">' + nl2br(d.focus) + '</p>' : '';
  var allLinkHtml = d.all_link ? '<a href="' + d.all_link + '" class="pub-all-link" target="_blank">View all publications \u2192</a>' : '';
  var featuredHtml = '';
  if (d.featured) {
    var f = d.featured;
    function featBtnHtml(btn) {
      var iconHtml = '<span class="pub-feat-dl-icon material-symbols-outlined">' + (btn.icon || 'download') + '</span>';
      var infoHtml = btn.info ? '<span class="pub-feat-dl-info">' + btn.info + '</span>' : '';
      var labelHtml = btn.label ? '<span class="pub-feat-dl-label">' + btn.label + '</span>' : '';
      var urlAttr = btn.url ? ' href="' + btn.url + '"' : '';
      var tagName = btn.url ? 'a' : 'div';
      var mainBtn = '<' + tagName + urlAttr + ' class="pub-feat-download">' + iconHtml + '<div>' + labelHtml + infoHtml + '</div></' + tagName + '>';
      var iconBtns = '';
      if (btn.iconBtns) {
        iconBtns = btn.iconBtns.map(function(ib) {
          var ibUrl = ib.url ? ' href="' + ib.url + '"' : '';
          var ibTag = ib.url ? 'a' : 'div';
          return '<' + ibTag + ibUrl + ' class="pub-feat-icon-btn"><span class="material-symbols-outlined">' + (ib.icon || 'open_in_new') + '</span></' + ibTag + '>';
        }).join('');
      }
      return iconBtns ? '<div class="pub-feat-download-row">' + mainBtn + iconBtns + '</div>' : mainBtn;
    }
    var downloadHtml = '';
    if (f.links) {
      downloadHtml = '<div class="pub-feat-links">' + f.links.map(featBtnHtml).join('') + '</div>';
    } else if (f.download) {
      downloadHtml = featBtnHtml(f.download);
    }
    var featImg = f.image ? '<div class="pub-feat-img"><img src="' + f.image + '" alt="' + (f.alt || '') + '" loading="lazy"></div>' : '';
    var featDesc = '';
    if (f.paragraphs) {
      featDesc = '<div class="pub-feat-desc">' + f.paragraphs.map(function(p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('') + '</div>';
    } else if (f.description) {
      featDesc = '<p class="pub-feat-desc">' + nl2br(f.description) + '</p>';
    }
    var featTags = (f.tags || []).map(function(t) {
      return '<span class="pub-item-tag">' + t + '</span>';
    }).join('');
    var featTagsHtml = featTags ? '<div class="pub-item-tags">' + featTags + '</div>' : '';
    featuredHtml = '<div class="pub-featured-block">' + featImg +
      '<div class="pub-feat-content">' + featTagsHtml +
      '<span class="pub-feat-badge">' + (f.badge || '') + '</span>' +
      '<h3 class="pub-feat-title">' + f.title + '</h3>' +
      (f.authors ? '<span class="pub-item-authors">' + f.authors + '</span>' : '') +
      featDesc + downloadHtml + '</div></div>';
  }
  var itemsHtml = (d.items || []).map(function(item) {
    var imgHtml = item.image ? '<div class="pub-item-img"><img src="' + item.image + '" alt="" loading="lazy"></div>' : '';
    var linksHtml = (item.links || []).map(function(l) {
      return '<a href="' + l.url + '" class="pub-item-link" target="_blank"><span class="material-symbols-outlined">' + (l.icon || 'link') + '</span>' + l.label + '</a>';
    }).join('');
    var tagsHtml = (item.tags || []).map(function(t) {
      return '<span class="pub-item-tag">' + t + '</span>';
    }).join('');
    return '<div class="pub-item"><div class="pub-item-inner">' +
      imgHtml +
      '<div class="pub-item-body"><div class="pub-item-tags">' + tagsHtml + '</div>' +
      '<h4 class="pub-item-title">' + item.title + '</h4>' +
      '<span class="pub-item-authors">' + (item.authors || '') + '</span>' +
      '<p class="pub-item-summary">' + nl2br(item.summary) + '</p>' +
      '<span class="pub-item-journal">' + (item.journal || '') + '</span>' +
      '<div class="pub-item-links">' + linksHtml + '</div></div></div></div>';
  }).join('');
  return '<section id="' + data.id + '"><div class="container"><div class="section-header">' +
    headingHtml + focusHtml + allLinkHtml + '</div>' +
    featuredHtml +
    '<div class="pub-list">' + itemsHtml + '</div></div></section>';
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
      return '<div class="note-meta">' + nl2br(item.meta) + '</div>' +
        '<p class="note-text">' + nl2br(item.text) + '</p>';
    }).join('') +
    '</div></div></section>';
}

function renderContact(data) {
  var d = data.data;
  return '<section id="' + data.id + '" class="cta-wrapper"><div class="container"><div class="cta-box">' +
    '<h2>' + (d.heading || '') + '</h2>' +
    '<p>' + nl2br(d.message) + '</p>' +
    '<a href="mailto:' + (d.email || '') + '" class="cta-btn">' + (d.button || 'Send') + '</a>' +
    '</div></div></section>';
}
