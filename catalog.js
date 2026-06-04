// SpeechifyPro — Catalogue et fonctions librairie
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

document.addEventListener('DOMContentLoaded', function() {
let _libCurrentCat = 'all';
let _libSearchQuery = '';

async function _getGutenbergLinks(gutId) {

function _libBookCard(book) {
  const div = document.createElement('div');
  div.className = 'lib-book-card';
  div.innerHTML = `
    <div class="lib-book-cover" style="background:${book.color};">
<div class="lib-book-emoji">${book.emoji}</div>
<div class="lib-book-cover-title">${book.title}</div>
    </div>
    <div class="lib-book-title">${book.title}</div>
    <div class="lib-book-author">${book.author}</div>`;
  div.addEventListener('click', () => _openLibModal(book));
  return div;
}

function _libListItem(book) {
  const formats = Object.keys(book.formats || {});
  const div = document.createElement('div');
  div.className = 'lib-list-item';
  div.innerHTML = `
    <div class="lib-list-cover" style="background:${book.color}20;">${book.emoji}</div>
    <div class="lib-list-info">
<div class="lib-list-title">${book.title}</div>
<div class="lib-list-author">${book.author}</div>
<div class="lib-list-badges">
  ${formats.map(f => `<span class="lib-format-badge ${f}">${f.toUpperCase()}</span>`).join('')}
  <span class="lib-format-badge">${book.lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}</span>
</div>
    </div>`;
  div.addEventListener('click', () => _openLibModal(book));
  return div;
}

function renderLibrary() {
  const q   = _libSearchQuery.toLowerCase().trim();
  const cat = _libCurrentCat;

  // Filtrer
  let books = LIBRARY_CATALOG.filter(b => {
    const matchCat = cat === 'all' || b.cat.includes(cat);
    const matchQ   = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (q) {
    // Mode recherche : liste
    $('#lib-default-sections').style.display = 'none';
    $('#lib-search-results').style.display = 'block';
    $('#lib-result-count').textContent = `(${books.length})`;
    const list = $('#lib-results-list');
    list.innerHTML = '';
    if (!books.length) {
list.innerHTML = '<p style="text-align:center;color:var(--color-text-faint);padding:var(--space-4);">Aucun résultat</p>';
    } else {
books.forEach(b => list.appendChild(_libListItem(b)));
    }
  } else {
    // Mode défaut : carrousels par section
    $('#lib-default-sections').style.display = 'block';
    $('#lib-search-results').style.display = 'none';

    const fillScroll = (id, filter) => {
const el = $(`#${id}`);
if (!el) return;
el.innerHTML = '';
const filtered = books.filter(filter);
if (!filtered.length) {
  el.innerHTML = '<p style="font-size:11px;color:var(--color-text-faint);padding:var(--space-2);">Aucun livre dans cette catégorie.</p>';
  return;
}
filtered.forEach(b => el.appendChild(_libBookCard(b)));
    };

    fillScroll('lib-featured', b => b.cat.includes('featured'));
    fillScroll('lib-romans',   b => b.cat.includes('roman'));
    fillScroll('lib-philo',    b => b.cat.includes('philo'));
    fillScroll('lib-fr', b => b.lang === 'fr');
  }
}

function _openLibModal(book) {
  $('#lib-modal-cover').style.background = book.color + '30';
  $('#lib-modal-cover').textContent = book.emoji;
  $('#lib-modal-title').textContent  = book.title;
  $('#lib-modal-author').textContent = book.author;
  $('#lib-modal-desc').textContent   = book.desc;
  $('#lib-modal-badges').innerHTML   =
    `<span class="lib-format-badge">${book.lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}</span>`;

  const actions = $('#lib-modal-actions');
  actions.innerHTML = '<div style="text-align:center;color:var(--color-text-faint);font-size:var(--text-xs);padding:var(--space-3);">⏳ Chargement des liens…</div>';

  $('#lib-modal').classList.add('active');

  // Charger les liens réels via Gutendex API
  _getGutenbergLinks(book.gutId).then(links => {
    actions.innerHTML = '';

    // Bouton "Lire maintenant" si lien TXT disponible
    if (links.txt) {
const btnRead = document.createElement('button');
btnRead.className = 'btn btn-primary';
btnRead.innerHTML = '▶ Lire maintenant (import texte)';
btnRead.addEventListener('click', () => {
  $('#lib-modal').classList.remove('active');
  navigate('import');
  const inp = $('#url-import-input');
  if (inp) inp.value = links.txt;
  toast(`⏳ Import de "${book.title}"…`);
  setTimeout(() => importFromUrl(links.txt), 300);
});
actions.appendChild(btnRead);
    }

    // Bouton EPUB
    if (links.epub) {
const a = document.createElement('a');
a.className = 'btn btn-outline';
a.href = links.epub; a.target = '_blank'; a.rel = 'noopener';
a.style.textAlign = 'center'; a.textContent = '⬇ Télécharger EPUB';
actions.appendChild(a);
    }

    // Bouton HTML (lire en ligne)
    if (links.html) {
const a = document.createElement('a');
a.className = 'btn btn-outline';
a.href = links.html; a.target = '_blank'; a.rel = 'noopener';
a.style.textAlign = 'center'; a.textContent = '🌐 Lire en ligne (HTML)';
actions.appendChild(a);
    }

    // Toujours : lien page Gutenberg
    const gutLink = links.page || `https://www.gutenberg.org/ebooks/${book.gutId}`;
    const btnGut = document.createElement('a');
    btnGut.className = 'btn btn-outline';
    btnGut.href = gutLink; btnGut.target = '_blank'; btnGut.rel = 'noopener';
    btnGut.style.textAlign = 'center';
    btnGut.textContent = '🔗 Page Project Gutenberg (tous formats)';
    actions.appendChild(btnGut);

    // Mettre à jour les badges formats
    const badges = $('#lib-modal-badges');
    if (links.txt)  badges.innerHTML += '<span class="lib-format-badge txt">TXT</span>';
    if (links.epub) badges.innerHTML += '<span class="lib-format-badge epub">EPUB</span>';
    if (links.html) badges.innerHTML += '<span class="lib-format-badge">HTML</span>';

  }).catch(() => {
    actions.innerHTML = `<a class="btn btn-primary" href="https://www.gutenberg.org/ebooks/${book.gutId}" target="_blank" rel="noopener" style="text-align:center;">🔗 Ouvrir sur Project Gutenberg</a>`;
  });
}

$('#lib-modal-close')?.addEventListener('click', () => {
  $('#lib-modal').classList.remove('active');
});
$('#lib-modal')?.addEventListener('click', (e) => {
  if (e.target === $('#lib-modal')) $('#lib-modal').classList.remove('active');
});

$('#lib-search')?.addEventListener('input', (e) => {
  _libSearchQuery = e.target.value;
  renderLibrary();
});
$('#lib-search-btn')?.addEventListener('click', () => {
  _libSearchQuery = $('#lib-search').value;
  renderLibrary();
});

$$('.lib-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.lib-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _libCurrentCat = btn.dataset.cat;
    _libSearchQuery = '';
    $('#lib-search').value = '';
    renderLibrary();
  });
});
});
