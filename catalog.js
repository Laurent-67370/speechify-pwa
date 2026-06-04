var LIBRARY_CATALOG = [
  // COUPS DE CŒUR
  { id:'g1',  gutId:17489, title:'Les Misérables',               author:'Victor Hugo',          emoji:'🏛️', color:'#1a237e', cat:['roman','fr','featured'], lang:'fr', desc:'Le chef-d\'œuvre de Victor Hugo — Jean Valjean et sa rédemption dans la France du XIXe siècle.' },
  { id:'g2',  gutId:996,   title:'Don Quixote',                  author:'Cervantes',            emoji:'⚔️', color:'#b71c1c', cat:['roman','featured'],      lang:'en', desc:'The adventures of the idealistic knight Don Quixote and his loyal squire Sancho Panza.' },
  { id:'g3',  gutId:1342,  title:'Pride and Prejudice',          author:'Jane Austen',          emoji:'💌', color:'#880e4f', cat:['roman','featured'],      lang:'en', desc:'A story of love and society in Regency-era England, following the Bennet sisters.' },
  { id:'g4',  gutId:2680,  title:'Méditations',                  author:'Marc Aurèle',          emoji:'🏛️', color:'#37474f', cat:['philo','featured'],      lang:'fr', desc:'Réflexions stoïciennes de l\'empereur romain sur la vertu et la vie intérieure.' },
  { id:'g5',  gutId:132,   title:'The Art of War',               author:'Sun Tzu',              emoji:'⚔️', color:'#b71c1c', cat:['philo','featured'],      lang:'en', desc:'Ancient Chinese military treatise with timeless wisdom on strategy and leadership.' },

  // ROMANS
  { id:'g6',  gutId:2701,  title:'Moby Dick',                   author:'Herman Melville',      emoji:'🐋', color:'#01579b', cat:['roman'],                 lang:'en', desc:'The epic tale of Captain Ahab\'s obsessive quest for the white whale.' },
  { id:'g7',  gutId:64317, title:'The Great Gatsby',            author:'F. Scott Fitzgerald',  emoji:'🥂', color:'#f9a825', cat:['roman'],                 lang:'en', desc:'A portrait of the Jazz Age and the hollowness of the American Dream.' },
  { id:'g8',  gutId:36034, title:'Crime et Châtiment',          author:'Dostoïevski',          emoji:'🔪', color:'#4a148c', cat:['roman','fr'],            lang:'fr', desc:'Un étudiant russe commet un meurtre et lutte avec sa conscience à Saint-Pétersbourg.' },
  { id:'g9',  gutId:345,   title:'Dracula',                     author:'Bram Stoker',          emoji:'🧛', color:'#b71c1c', cat:['roman'],                 lang:'en', desc:'The original vampire novel that defined the genre.' },
  { id:'g10', gutId:84,    title:'Frankenstein',                author:'Mary Shelley',         emoji:'⚡', color:'#1b5e20', cat:['roman'],                 lang:'en', desc:'A scientist creates life and faces the moral consequences of playing God.' },
  { id:'g11', gutId:17989, title:'Le Comte de Monte-Cristo',    author:'Alexandre Dumas',      emoji:'🗡️', color:'#1a237e', cat:['roman','fr'],            lang:'fr', desc:'Edmond Dantès, emprisonné injustement, se venge de ses ennemis.' },
  { id:'g12', gutId:19657, title:'Notre-Dame de Paris',         author:'Victor Hugo',          emoji:'⛪', color:'#4a148c', cat:['roman','fr'],            lang:'fr', desc:'Quasimodo, Frollo et Esmeralda dans le Paris médiéval.' },
  { id:'g13', gutId:135,   title:'Les Trois Mousquetaires',     author:'Alexandre Dumas',      emoji:'🤺', color:'#880e4f', cat:['roman','fr','histoire'],  lang:'fr', desc:'D\'Artagnan rejoint les mousquetaires du Roi dans leurs aventures.' },
  { id:'g14', gutId:27780, title:'Sherlock Holmes',             author:'Arthur Conan Doyle',   emoji:'🔍', color:'#37474f', cat:['roman'],                 lang:'en', desc:'The complete adventures of the world\'s greatest detective.' },

  // PHILOSOPHIE
  { id:'g15', gutId:1497,  title:'The Republic',               author:'Plato',                emoji:'🏛️', color:'#311b92', cat:['philo'],                 lang:'en', desc:'Plato\'s dialogue on justice, the ideal state, and the nature of the soul.' },
  { id:'g16', gutId:7205,  title:'Ainsi parlait Zarathoustra', author:'Nietzsche',            emoji:'🦅', color:'#bf360c', cat:['philo','fr'],            lang:'fr', desc:'La vision de Nietzsche du surhomme et de l\'éternel retour.' },
  { id:'g17', gutId:1232,  title:'The Prince',                 author:'Machiavelli',          emoji:'👑', color:'#4e342e', cat:['philo','histoire'],       lang:'en', desc:'A Renaissance treatise on political power and how rulers should govern.' },
  { id:'g18', gutId:59,    title:'Discours de la méthode',     author:'Descartes',            emoji:'🔬', color:'#006064', cat:['philo','fr'],            lang:'fr', desc:'"Je pense donc je suis" — le texte fondateur de la philosophie moderne.' },

  // SCIENCES
  { id:'g19', gutId:1228,  title:'On the Origin of Species',   author:'Charles Darwin',       emoji:'🦕', color:'#1b5e20', cat:['science'],               lang:'en', desc:'Darwin\'s groundbreaking work on evolution and natural selection.' },
  { id:'g20', gutId:5001,  title:'Relativity',                 author:'Albert Einstein',      emoji:'💡', color:'#f57f17', cat:['science'],               lang:'en', desc:'Einstein\'s own accessible explanation of the theory of relativity.' },

  // HISTOIRE & AUTRE
  { id:'g21', gutId:19942, title:'Candide',                    author:'Voltaire',             emoji:'🌱', color:'#33691e', cat:['histoire','roman','fr'], lang:'fr', desc:'Le conte philosophique de Voltaire sur l\'optimisme et la nature humaine.' },
  { id:'g22', gutId:4650,  title:'Madame Bovary',              author:'Gustave Flaubert',     emoji:'💔', color:'#880e4f', cat:['roman','fr'],            lang:'fr', desc:'Emma Bovary cherche à échapper à l\'ennui de sa vie provinciale.' },

  // POÉSIE
  { id:'g23', gutId:6099,  title:'Les Fleurs du Mal',          author:'Baudelaire',           emoji:'🌹', color:'#4a148c', cat:['poesie','fr'],           lang:'fr', desc:'Le recueil de poèmes de Baudelaire qui révolutionna la poésie française.' },
  { id:'g24', gutId:8800,  title:'The Divine Comedy',          author:'Dante Alighieri',      emoji:'🔥', color:'#b71c1c', cat:['poesie'],                lang:'en', desc:'The epic journey through Hell, Purgatory, and Paradise.' },
];

// ── Variables librairie
var _libCurrentCat = 'all';
var _libSearchQuery = '';

// ── Fonctions librairie (globales, hoistées)
function renderLibrary() {
  var q = _libSearchQuery.toLowerCase().trim();
  var cat = _libCurrentCat;
  var books = LIBRARY_CATALOG.filter(function(b) {
    var matchCat = cat === 'all' || b.cat.indexOf(cat) !== -1;
    var matchQ = !q || b.title.toLowerCase().indexOf(q) !== -1 || b.author.toLowerCase().indexOf(q) !== -1;
    return matchCat && matchQ;
  });

  if (q) {
    document.getElementById('lib-default-sections').style.display = 'none';
    document.getElementById('lib-search-results').style.display = 'block';
    var countEl = document.getElementById('lib-result-count');
    if (countEl) countEl.textContent = '(' + books.length + ')';
    var list = document.getElementById('lib-results-list');
    if (!list) return;
    list.innerHTML = '';
    if (!books.length) {
      list.innerHTML = '<p style="font-size:11px;color:var(--color-text-faint);text-align:center;padding:16px;">Aucun résultat</p>';
    } else {
      books.forEach(function(b) { list.appendChild(_libListItem(b)); });
    }
  } else {
    document.getElementById('lib-default-sections').style.display = 'block';
    document.getElementById('lib-search-results').style.display = 'none';
    _fillScroll('lib-featured', books, function(b) { return b.cat.indexOf('featured') !== -1; });
    _fillScroll('lib-romans',   books, function(b) { return b.cat.indexOf('roman') !== -1; });
    _fillScroll('lib-philo',    books, function(b) { return b.cat.indexOf('philo') !== -1; });
    _fillScroll('lib-fr',       books, function(b) { return b.lang === 'fr'; });
  }
}

function _fillScroll(id, books, filterFn) {
  var el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  var filtered = books.filter(filterFn);
  if (!filtered.length) {
    el.innerHTML = '<p style="font-size:11px;color:var(--color-text-faint);padding:8px;">Aucun livre.</p>';
    return;
  }
  filtered.forEach(function(b) { el.appendChild(_libBookCard(b)); });
}

function _libBookCard(book) {
  var div = document.createElement('div');
  div.className = 'lib-book-card';
  div.innerHTML = '<div class="lib-book-cover" style="background:' + book.color + '"><div class="lib-book-emoji">' + book.emoji + '</div><div class="lib-book-cover-title">' + book.title + '</div></div><div class="lib-book-title">' + book.title + '</div><div class="lib-book-author">' + book.author + '</div>';
  div.addEventListener('click', function() { _openLibModal(book); });
  return div;
}

function _libListItem(book) {
  var div = document.createElement('div');
  div.className = 'lib-list-item';
  div.innerHTML = '<div class="lib-list-cover" style="background:' + book.color + '20">' + book.emoji + '</div><div class="lib-list-info"><div class="lib-list-title">' + book.title + '</div><div class="lib-list-author">' + book.author + '</div></div>';
  div.addEventListener('click', function() { _openLibModal(book); });
  return div;
}

function _openLibModal(book) {
  var modal = document.getElementById('lib-modal');
  if (!modal) return;
  document.getElementById('lib-modal-cover').style.background = book.color + '30';
  document.getElementById('lib-modal-cover').textContent = book.emoji;
  document.getElementById('lib-modal-title').textContent = book.title;
  document.getElementById('lib-modal-author').textContent = book.author;
  document.getElementById('lib-modal-desc').textContent = book.desc;
  var badges = document.getElementById('lib-modal-badges');
  if (badges) badges.innerHTML = '<span class="lib-format-badge">' + (book.lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN') + '</span>';
  var actions = document.getElementById('lib-modal-actions');
  actions.innerHTML = '<div style="text-align:center;color:var(--color-text-faint);font-size:12px;padding:12px;">⏳ Chargement des liens…</div>';
  modal.classList.add('active');

  // Charger les vrais liens via API Gutendex
  fetch('https://gutendex.com/books/' + book.gutId + '/')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      actions.innerHTML = '';
      var formats = data.formats || {};
      var txtUrl  = null, epubUrl = null;
      Object.keys(formats).forEach(function(k) {
        if (k.indexOf('text/plain') !== -1 && !txtUrl)  txtUrl  = formats[k];
        if (k.indexOf('epub') !== -1 && k.indexOf('zip') === -1 && !epubUrl) epubUrl = formats[k];
      });

      // Bouton Lire maintenant (TXT)
      if (txtUrl) {
        var btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = '▶ Lire maintenant';
        btn.style.width = '100%';
        btn.addEventListener('click', function() {
          modal.classList.remove('active');
          if (typeof navigate === 'function') navigate('import');
          var inp = document.getElementById('url-import-input');
          if (inp) inp.value = txtUrl;
          if (typeof importFromUrl === 'function') setTimeout(function() { importFromUrl(txtUrl); }, 300);
          if (typeof toast === 'function') toast('⏳ Import de "' + book.title + '"…');
        });
        actions.appendChild(btn);
      }

      // Bouton EPUB
      if (epubUrl) {
        var a = document.createElement('a');
        a.className = 'btn btn-outline';
        a.href = epubUrl; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = '⬇ Télécharger EPUB';
        a.style.textAlign = 'center'; a.style.display = 'block';
        actions.appendChild(a);
      }

      // Lien page Gutenberg
      var g = document.createElement('a');
      g.className = 'btn btn-outline';
      g.href = 'https://www.gutenberg.org/ebooks/' + book.gutId;
      g.target = '_blank'; g.rel = 'noopener';
      g.textContent = '🔗 Tous les formats sur Gutenberg';
      g.style.textAlign = 'center'; g.style.display = 'block';
      actions.appendChild(g);
    })
    .catch(function() {
      actions.innerHTML = '';
      var g = document.createElement('a');
      g.className = 'btn btn-primary';
      g.href = 'https://www.gutenberg.org/ebooks/' + book.gutId;
      g.target = '_blank'; g.rel = 'noopener';
      g.textContent = '🔗 Ouvrir sur Project Gutenberg';
      g.style.textAlign = 'center'; g.style.display = 'block';
      actions.appendChild(g);
    });
}


// ── Init listeners (appelé depuis DOMContentLoaded de index.html)
function _initLibraryListeners() {
  var searchEl  = document.getElementById('lib-search');
  var searchBtn = document.getElementById('lib-search-btn');
  var modalClose = document.getElementById('lib-modal-close');
  var modal = document.getElementById('lib-modal');

  if (searchEl) searchEl.addEventListener('input', function(e) {
    _libSearchQuery = e.target.value; renderLibrary();
  });
  if (searchBtn) searchBtn.addEventListener('click', function() {
    _libSearchQuery = (document.getElementById('lib-search') || {}).value || '';
    renderLibrary();
  });
  if (modalClose) modalClose.addEventListener('click', function() {
    if (modal) modal.classList.remove('active');
  });
  if (modal) modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('active');
  });
  var catBtns = document.querySelectorAll('.lib-cat-btn');
  catBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      catBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      _libCurrentCat = btn.dataset.cat;
      _libSearchQuery = '';
      var s = document.getElementById('lib-search');
      if (s) s.value = '';
      renderLibrary();
    });
  });
}
