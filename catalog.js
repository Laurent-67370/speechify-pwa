// Catalogue SpeechifyPro — livres domaine public
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

