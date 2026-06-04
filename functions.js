// SpeechifyPro — Fonctions utilitaires
    function savePrefs() {
      const prefs = {
        theme:             appState.theme,
        speed:             appState.speed,
        selectedVoiceName: appState.selectedVoiceName,
        highlight:         appState.highlight,
        syncSpeed:         appState.syncSpeed,
        currentDocId:      appState.currentDocId,
        currentWordIndex:  appState.currentWordIndex,
        sortAsc:           appState.sortAsc,
        currentFilter:     appState.currentFilter,
        dailyGoalMin:      appState.dailyGoalMin,
        dailyDoneMin:      appState.dailyDoneMin,
        dailyDate:         appState.dailyDate,
        pitch:             appState.pitch,
        pauseMs:           appState.pauseMs,
        readMode:          appState.readMode,
      };
      localStorage.setItem('speechify_prefs', JSON.stringify(prefs));
    }
    function loadPrefs() {
      try {
        const raw = localStorage.getItem('speechify_prefs');
        if (!raw) return;
        const p = JSON.parse(raw);
        if (p.theme)             appState.theme             = p.theme;
        if (p.speed)             appState.speed             = p.speed;
        if (p.selectedVoiceName) appState.selectedVoiceName = p.selectedVoiceName;
        if (p.highlight !== undefined) appState.highlight   = p.highlight;
        if (p.syncSpeed)         appState.syncSpeed         = p.syncSpeed;
        if (p.currentDocId)      appState.currentDocId      = p.currentDocId;
        if (p.currentWordIndex)  appState.currentWordIndex  = p.currentWordIndex;
        if (p.sortAsc !== undefined) appState.sortAsc       = p.sortAsc;
        if (p.currentFilter)     appState.currentFilter     = p.currentFilter;
        if (p.dailyGoalMin)      appState.dailyGoalMin      = p.dailyGoalMin;
        if (p.dailyDoneMin !== undefined) appState.dailyDoneMin = p.dailyDoneMin;
        if (p.dailyDate)         appState.dailyDate         = p.dailyDate;
        if (p.pitch)             appState.pitch             = p.pitch;
        if (p.pauseMs !== undefined) appState.pauseMs       = p.pauseMs;
        if (p.readMode)          appState.readMode          = p.readMode;
      } catch(e) {}
    }
    function openDB() {
      return new Promise((resolve, reject) => {
        if (_db) { resolve(_db); return; }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };
        req.onsuccess  = (e) => { _db = e.target.result; resolve(_db); };
        req.onerror    = (e) => reject(e.target.error);
      });
    }
    async function dbGetAll() {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx  = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror   = () => reject(req.error);
      });
    }
    async function dbPut(doc) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx  = db.transaction(STORE_NAME, 'readwrite');
        const req = tx.objectStore(STORE_NAME).put(doc);
        req.onsuccess = () => resolve();
        req.onerror   = () => reject(req.error);
      });
    }
    async function dbDelete(id) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx  = db.transaction(STORE_NAME, 'readwrite');
        const req = tx.objectStore(STORE_NAME).delete(id);
        req.onsuccess = () => resolve();
        req.onerror   = () => reject(req.error);
      });
    }
    async function dbClear() {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx  = db.transaction(STORE_NAME, 'readwrite');
        const req = tx.objectStore(STORE_NAME).clear();
        req.onsuccess = () => resolve();
        req.onerror   = () => reject(req.error);
      });
    }
    async function initStorage() {
      loadPrefs();
      // Appliquer le thème sauvegardé immédiatement
      document.documentElement.setAttribute('data-theme', appState.theme);

      let docs = await dbGetAll();

      // Première utilisation : insérer les docs démo dans IndexedDB
      if (!docs || docs.length === 0) {
        for (const d of initialLibraryMock) await dbPut(d);
        docs = [...initialLibraryMock];
      }

      // Trier par id décroissant (plus récent en premier)
      docs.sort((a, b) => b.id - a.id);
      appState.docs = docs;

      // Vérifier que le doc courant sauvegardé existe toujours
      const docExists = docs.find(d => d.id === appState.currentDocId);
      if (!docExists) {
        appState.currentDocId   = docs[0]?.id ?? null;
        appState.currentWordIndex = 0;
      }

      // Pré-charger wordsArray du doc courant
      const curDoc = docs.find(d => d.id === appState.currentDocId);
      if (curDoc) appState.wordsArray = curDoc.content.split(/(\s+)/);
    }
    async function saveDoc(doc) {
      await dbPut(doc);
      savePrefs();
    }
    async function deleteDoc(id) {
      await dbDelete(id);
      savePrefs();
    }
    function _voiceQuality(v) {
      const n = v.name.toLowerCase();
      if (n.includes('google') || n.includes('neural') || n.includes('enhanced') || n.includes('premium')) return 3;
      if (v.localService) return 2;
      return 1;
    }
    function _voiceQualityLabel(v) {
      const n = v.name.toLowerCase();
      if (n.includes('google'))   return '⭐ Google';
      if (n.includes('neural') || n.includes('enhanced') || n.includes('premium')) return '⭐ HD';
      if (v.localService)         return '✓ Locale';
      return '— Réseau';
    }
    function loadSystemVoices(forceRefresh = false) {
      if (!('speechSynthesis' in window)) return;
      const voices = window.speechSynthesis.getVoices();

      // Si liste vide et pas encore au max de retries → réessayer
      if (!voices.length && _voiceRetryCount < _VOICE_RETRY_MAX) {
        _voiceRetryCount++;
        setTimeout(() => loadSystemVoices(), 500);
        return;
      }

      // Mise à jour uniquement si la liste a changé ou si forceRefresh
      const hasMore = voices.length > synthVoices.length;
      if (!hasMore && !forceRefresh && synthVoices.length) return;

      synthVoices = voices;
      _voiceRetryCount = 0;

      if (appState.playing) return;
      const select = $('#voice-select');
      if (!select) return;
      select.innerHTML = '';

      // Filtrer FR + EN, trier : Google > Neural > locale > réseau
      let list = synthVoices.filter(v => v.lang.startsWith('fr') || v.lang.startsWith('en'));
      if (!list.length) list = [...synthVoices];
      list.sort((a, b) => {
        const aFr = a.lang.startsWith('fr') ? 0 : 1;
        const bFr = b.lang.startsWith('fr') ? 0 : 1;
        if (aFr !== bFr) return aFr - bFr;
        return _voiceQuality(b) - _voiceQuality(a);
      });

      // Compter les voix Google pour le badge
      const googleCount = list.filter(v => _voiceQuality(v) === 3).length;

      // Grouper FR / EN avec séparateurs
      let lastLangGroup = '';
      list.forEach(v => {
        const group = v.lang.startsWith('fr') ? 'Français' : 'English';
        if (group !== lastLangGroup) {
          const sep = document.createElement('optgroup');
          sep.label = `── ${group} ──`;
          select.appendChild(sep);
          lastLangGroup = group;
        }
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${_voiceQualityLabel(v)} · ${v.name}`;
        if (v.name === appState.selectedVoiceName) opt.selected = true;
        else if (v.lang.startsWith('fr') && !appState.selectedVoiceName) {
          // Auto-sélectionner la meilleure voix FR disponible (Google en priorité)
          const bestFr = list.find(x => x.lang.startsWith('fr') && _voiceQuality(x) === 3)
                      || list.find(x => x.lang.startsWith('fr'));
          if (bestFr && v.name === bestFr.name) {
            appState.selectedVoiceName = v.name;
            opt.selected = true;
          }
        }
        select.appendChild(opt);
      });
      if (!appState.selectedVoiceName && list.length) {
        appState.selectedVoiceName = list[0].name;
        select.value = list[0].name;
      }

      // Badge qualité
      const cur = list.find(v => v.name === appState.selectedVoiceName);
      const badge = $('#voice-quality-badge');
      if (badge && cur) {
        badge.textContent = _voiceQualityLabel(cur);
        // Couleur selon qualité
        badge.style.background = _voiceQuality(cur) === 3
          ? 'rgba(109,108,255,.25)' : 'var(--color-primary-soft)';
      }

      // Notification si nouvelles voix Google détectées
      if (googleCount > 0 && forceRefresh) {
        toast(`✅ ${googleCount} voix HD trouvée${googleCount > 1 ? 's' : ''} !`);
      }
    }
    function _addVoiceRefreshBtn() {
      const voiceRow = $('#voice-quality-badge')?.closest('div');
      if (!voiceRow || $('#voice-refresh-btn')) return;
      const btn = document.createElement('button');
      btn.id = 'voice-refresh-btn';
      btn.style.cssText = 'font-size:10px;padding:2px 8px;border-radius:99px;border:1px solid var(--color-border);background:var(--color-surface-2);color:var(--color-text-muted);cursor:pointer;';
      btn.textContent = '🔄 Actualiser';
      btn.addEventListener('click', () => {
        btn.textContent = '⏳…';
        _voiceRetryCount = 0;
        synthVoices = [];
        loadSystemVoices(true);
        setTimeout(() => { btn.textContent = '🔄 Actualiser'; }, 2000);
      });
      voiceRow.appendChild(btn);
    }
    function _startKeepAlive() {
      _stopKeepAlive();
      _synthKeepAlive = setInterval(() => {
        if (!appState.playing) { _stopKeepAlive(); return; }
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      }, 8000);
    }
    function _stopKeepAlive() {
      if (_synthKeepAlive) { clearInterval(_synthKeepAlive); _synthKeepAlive = null; }
    }
    function _clearWordTimers() {
      _wordTimers.forEach(t => clearTimeout(t));
      _wordTimers = [];
    }
    function _buildChunks() {
      _chunks = [];
      const wa    = appState.wordsArray;
      const start = appState.currentWordIndex;
      const mode  = appState.readMode || 'sentence';

      // Regex de coupure selon le mode
      const isCutPoint = (tok) => {
        if (mode === 'sentence') {
          return /[.!?]\s*$/.test(tok) || tok.includes('\n');
        } else {
          return tok.includes('\n\n') || (tok.includes('\n') && tok.trim() === '');
        }
      };

      let chunkText  = '';
      let chunkWords = [];
      let endsWithParagraph = false;

      const pushChunk = () => {
        if (chunkText.trim()) {
          _chunks.push({ text: chunkText.trim(), words: chunkWords, endsWithParagraph });
        }
        chunkText  = '';
        chunkWords = [];
        endsWithParagraph = false;
      };

      for (let i = start; i < wa.length; i++) {
        const tok    = wa[i];
        const isWord = tok.trim() !== '';

        // Forcer la coupure si chunk trop long
        if (isWord && chunkText.length + tok.length > CHUNK_MAX && chunkText.trim()) {
          pushChunk();
        }

        if (isWord) {
          chunkWords.push({ wordIdx: i, charLen: tok.length, charStart: chunkText.length });
        }
        chunkText += tok;

        // Coupure naturelle selon le mode
        if (isWord && isCutPoint(tok) && chunkText.trim().length > 30) {
          endsWithParagraph = tok.includes('\n');
          pushChunk();
        }
      }
      pushChunk(); // dernier chunk restant
    }
    function _scheduleHighlights(chunk) {
      _clearWordTimers();
      const rate    = appState.speed || 1;
      const mspChar = 1000 / (CHARS_PER_SEC * rate); // ms par caractère

      // Calculer le délai cumulé mot par mot (on inclut aussi les espaces entre mots)
      let elapsed = 0;
      for (let k = 0; k < chunk.words.length; k++) {
        const w     = chunk.words[k];
        const delay = elapsed;
        const idx   = w.wordIdx;

        const t = setTimeout(() => {
          if (!appState.playing) return;
          appState.currentWordIndex = idx;
          autoHighlightAndCenter(idx);
        }, delay);
        _wordTimers.push(t);

        // Durée de ce mot + espace suivant (≈1 espace = ~0.5 char de pause)
        const nextCharStart = k + 1 < chunk.words.length
          ? chunk.words[k + 1].charStart
          : chunk.text.length;
        elapsed += (nextCharStart - w.charStart) * mspChar;
      }
    }
    function stopSpeechEngine() {
      _stopKeepAlive();
      _clearWordTimers();
      _stopDailyTimer();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      appState.playing = false;
      _chunks      = [];
      _chunkIndex  = 0;
      // Sauvegarder la position immédiatement à l'arrêt
      clearTimeout(_savePositionTimer);
      const doc = appState.docs.find(d => d.id === appState.currentDocId);
      if (doc) {
        doc.wordIndex = appState.currentWordIndex;
        doc.progress  = appState.wordsArray.length
          ? Math.round((appState.currentWordIndex / appState.wordsArray.length) * 100) : 0;
        saveDoc(doc);
      }
      savePrefs();
      $('#waveform').classList.remove('playing');
      updateControlsUI();
    }
    function _speakChunk(chunkIdx) {
      if (!appState.playing || chunkIdx >= _chunks.length) {
        // Fin de la lecture complète
        const doc = appState.docs.find(d => d.id === appState.currentDocId);
        stopSpeechEngine();
        appState.currentWordIndex = 0;
        renderTextInReader(false);
        // Notification de fin
        if (doc) _notifyReadingDone(doc.title);
        return;
      }
      _chunkIndex    = chunkIdx;
      const chunk    = _chunks[chunkIdx];

      const utt      = new SpeechSynthesisUtterance(chunk.text);
      appState.utterance = utt;

      if (!synthVoices.length) synthVoices = window.speechSynthesis.getVoices();
      const voice = synthVoices.find(v => v.name === appState.selectedVoiceName);
      if (voice) utt.voice = voice;
      utt.rate  = appState.speed;
      utt.pitch = appState.pitch || 1.0;
      utt.lang  = voice ? voice.lang : 'fr-FR';

      // Programmer les highlights avant de parler
      _scheduleHighlights(chunk);

      utt.onend = () => {
        if (!appState.playing) return;
        _clearWordTimers();
        // Pause entre paragraphes si le chunk se termine par un saut de ligne
        const pauseDelay = (chunk.text.trimEnd().endsWith('\n') || chunk.endsWithParagraph)
          ? (appState.pauseMs || 0) + 50
          : 50;
        setTimeout(() => _speakChunk(chunkIdx + 1), pauseDelay);
      };

      utt.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        _clearWordTimers();
        if (e.error === 'synthesis-failed' && chunkIdx + 1 < _chunks.length) {
          toast("⏭ Segment suivant…");
          setTimeout(() => _speakChunk(chunkIdx + 1), 80);
        } else {
          stopSpeechEngine();
          toast("⚠️ Erreur vocale : " + (e.error || 'inconnue'));
        }
      };

      window.speechSynthesis.speak(utt);
    }
    function startSpeechEngine() {
      const doc = appState.docs.find(d => d.id === appState.currentDocId);
      if (!doc || !doc.content || !doc.content.trim()) return toast("Aucun contenu textuel exploitable.");
      if (!('speechSynthesis' in window)) return toast("Synthèse vocale non supportée.");

      if (!appState.wordsArray || !appState.wordsArray.length) {
        appState.wordsArray = doc.content.split(/(\s+)/);
      }

      window.speechSynthesis.cancel();
      _clearWordTimers();

      setTimeout(() => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        if (appState.currentWordIndex >= appState.wordsArray.length - 1) appState.currentWordIndex = 0;

        _buildChunks();
        _chunkIndex = 0;
        if (!_chunks.length) return toast("Aucun texte à lire.");

        renderTextInReader(true);

        appState.playing = true;
        $('#waveform').classList.add('playing');
        updateControlsUI();
        _startKeepAlive();
        _startDailyTimer();
        _speakChunk(0);
      }, 150);
    }
    function autoHighlightAndCenter(index) {
      const box   = $('#reader-text');
      const spans = $$('#reader-text span[id^="word-"]');
      spans.forEach(s => {
        const id = parseInt(s.id.replace('word-', ''));
        if (!appState.highlight) {
          s.classList.remove('word-highlight', 'word-read');
          return;
        }
        if (id < index) {
          s.classList.remove('word-highlight');
          s.classList.add('word-read');
        } else if (id === index) {
          s.classList.add('word-highlight');
          s.classList.remove('word-read');
        } else {
          s.classList.remove('word-highlight', 'word-read');
        }
      });

      // Mettre à jour la barre de progression en temps réel
      if (appState.wordsArray.length > 0) {
        const pct = Math.round((index / appState.wordsArray.length) * 100);
        $$('.progress-fill').forEach(el => el.style.width = pct + '%');
      }

      // Propager vers le Mode Zen si actif
      if (appState.isFocusMode) {
        _zenHighlight(index);
        _zenUpdatePlayBtn();
      }

      // Sauvegarder la position (throttlé toutes les 5s pour ne pas sur-écrire)
      clearTimeout(_savePositionTimer);
      _savePositionTimer = setTimeout(() => {
        const doc = appState.docs.find(d => d.id === appState.currentDocId);
        if (doc) {
          doc.wordIndex = index;
          doc.progress  = Math.round((index / appState.wordsArray.length) * 100);
          saveDoc(doc);
          savePrefs();
        }
      }, 5000);

      if (!appState.highlight) return;
      const node = $(`#word-${index}`);
      if (!node || !box) return;
      const boxRect  = box.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const nodeTopInBox  = nodeRect.top - boxRect.top;
      const targetScroll  = box.scrollTop + nodeTopInBox - (box.clientHeight / 2) + (nodeRect.height / 2);
      box.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
    }
    function renderTextInReader(wrap = false) {
      const doc = appState.docs.find(d => d.id === appState.currentDocId);
      const box = $('#reader-text');
      if (!doc) { box.textContent = "Aucun texte chargé."; return; }
      if (wrap && appState.wordsArray.length) {
        box.innerHTML = appState.wordsArray.map((chunk, i) =>
          chunk.trim() === '' ? chunk : `<span id="word-${i}">${chunk}</span>`
        ).join('');
        // Ajouter un clic sur chaque mot → relancer la lecture depuis ce mot
        $$('#reader-text span').forEach(span => {
          span.addEventListener('click', () => {
            const idx = parseInt(span.id.replace('word-', ''));
            if (isNaN(idx)) return;
            appState.currentWordIndex = idx;
            if (appState.playing) {
              stopSpeechEngine();
              setTimeout(() => startSpeechEngine(), 80);
            } else {
              autoHighlightAndCenter(idx);
              // Si pas en lecture, un clic lance la lecture
              $('#play-toggle').disabled = true;
              $('#reader-play').disabled = true;
              startSpeechEngine();
            }
          });
        });
        if (appState.currentWordIndex > 0) autoHighlightAndCenter(appState.currentWordIndex);
      } else {
        // Mode statique : afficher les spans pour permettre la sélection
        const docWords = doc.content.split(/\s+/);
        box.innerHTML = docWords.map((w, idx) => `<span id="word-s${idx}">${w}</span>`).join(' ');
        // Clic sur un mot en mode statique → go reader + lecture depuis ce mot
        $$('#reader-text span').forEach(span => {
          span.addEventListener('click', () => {
            const idx = parseInt(span.id.replace('word-s', ''));
            if (isNaN(idx)) return;
            // Recalculer l'index dans wordsArray (qui inclut les espaces)
            if (!appState.wordsArray.length) appState.wordsArray = doc.content.split(/(\s+)/);
            // Trouver l'index dans wordsArray correspondant au Nième mot réel
            let realWordCount = 0;
            for (let i = 0; i < appState.wordsArray.length; i++) {
              if (appState.wordsArray[i].trim() !== '') {
                if (realWordCount === idx) { appState.currentWordIndex = i; break; }
                realWordCount++;
              }
            }
            $('#play-toggle').disabled = true;
            $('#reader-play').disabled = true;
            startSpeechEngine();
          });
        });
      }
    }
    async function uploadFileHandler(file) {
      if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();

      navigate('reader');
      $('#reader-text').style.display = 'none';
      $('#article-skeleton').style.display = 'flex';
      $('#pdf-progress-block').classList.remove('active');

      if (ext === 'pdf') {
        // Vérification que pdf.js est chargé
        if (typeof pdfjsLib === 'undefined') {
          toast("⚠️ PDF.js non chargé, veuillez recharger la page.");
          stopLoader(); return;
        }

        const fileReader = new FileReader();
        fileReader.onload = async function(evt) {
          try {
            $('#article-skeleton').style.display = 'none';
            $('#pdf-progress-block').classList.add('active');

            const typedArray = new Uint8Array(evt.target.result);
            const loadingTask = pdfjsLib.getDocument({ data: typedArray });

            const pdf = await loadingTask.promise;
            const totalPages = pdf.numPages;
            let contentStr = "";

            $('#pdf-progress-text').textContent = `Extraction page 0 / ${totalPages}…`;

            for (let i = 1; i <= totalPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              contentStr += textContent.items.map(item => item.str).join(' ') + '\n';

              // Mise à jour de la barre de progression
              const pct = Math.round((i / totalPages) * 100);
              $('#pdf-progress-fill').style.width = pct + '%';
              $('#pdf-progress-text').textContent = `Extraction page ${i} / ${totalPages}…`;
            }

            $('#pdf-progress-block').classList.remove('active');
            insertDocToLibrary(file.name, contentStr.trim(), 'pdf', 'Fichiers');

          } catch (err) {
            console.error('PDF error:', err);
            $('#pdf-progress-block').classList.remove('active');
            toast("❌ Erreur lors de l'analyse du PDF : " + (err.message || err));
            stopLoader();
          }
        };
        fileReader.onerror = () => { toast("❌ Erreur de lecture du fichier."); stopLoader(); };
        fileReader.readAsArrayBuffer(file);

      } else if (['txt', 'md', 'html'].includes(ext)) {
        const fileReader = new FileReader();
        fileReader.onload = function(evt) {
          insertDocToLibrary(file.name, evt.target.result, 'txt', 'Fichiers');
        };
        fileReader.onerror = () => { toast("❌ Erreur de lecture du fichier."); stopLoader(); };
        fileReader.readAsText(file, 'UTF-8');
      } else {
        toast("Format non supporté. Utilisez PDF, TXT, MD ou HTML.");
        stopLoader();
      }
    }
    function stopLoader() {
      $('#reader-text').style.display = 'block';
      $('#article-skeleton').style.display = 'none';
      $('#pdf-progress-block').classList.remove('active');
    }
    function _cleanTitle(raw) {
      // Supprimer les URLs, underscores multiples, extensions, caractères parasites
      return raw
        .replace(/https?:\/\/[^\s]+/g, '')       // URLs
        .replace(/[_]{2,}/g, ' ')                 // __ multiples
        .replace(/\.[a-z]{2,4}$/i, '')            // extension (.pdf .txt)
        .replace(/[^\w\sÀ-ÿ\u2019«»\-–]/g, ' ')       // caractères spéciaux
        .replace(/\s{2,}/g, ' ')                   // espaces multiples
        .trim()
        || raw.replace(/\.[a-z]{2,4}$/i, '').trim(); // fallback
    }
    async function insertDocToLibrary(title, content, type, source) {
      stopLoader();
      if (!content || !content.trim()) content = "Le document extrait ne contient aucun texte exploitable.";
      const cleanedTitle = _cleanTitle(title);
      const id   = Date.now();
      const segs = content.split('.').filter(s => s.trim().length > 10);
      const doc  = {
        id, title: cleanedTitle, content, type, source,
        language: 'Français',
        minutes:  Math.max(2, Math.round(content.split(/\s+/).length / 150)),
        progress: 0,
        wordIndex: 0,
        summary: [
          { headline: segs[0] ? segs[0].trim().substring(0, 80) + '.' : "Analyse du fichier importé.", detail: "Extrait généré suite à l'analyse automatique du document." },
          { headline: "Segmentation structurelle.", detail: "Points d'intérêt sémantiques identifiés pour l'écoute vocale." }
        ],
        insights: [{ headline: "Archivage IndexedDB", detail: "Fichier stocké localement sans limite de taille." }]
      };
      appState.docs.unshift(doc);
      appState.currentDocId = id;
      stopSpeechEngine();
      appState.currentWordIndex = 0;
      appState.wordsArray = content.split(/(\s+)/);
      await saveDoc(doc);
      renderAll();
      toast("✅ « " + cleanedTitle + " » ajouté !");
    }
    function navigate(route) {
      appState.route = route;
      $$('.page').forEach(p => p.classList.remove('active'));
      const page = $(`.page[data-route="${route}"]`);
      if (page) page.classList.add('active');
      const hero = $('#hero-block');
      if (hero) hero.classList.toggle('active', route === 'home');
      $$('.nav-item').forEach(n => n.classList.remove('active'));
      const nav = $(`.nav-item[data-route-nav="${route}"]`);
      if (nav) nav.classList.add('active');
      renderAll();
      if (route === 'stats') renderStats();
      if (route === 'library-store') renderLibrary();
    }
    function updateControlsUI() {
      const icon  = appState.playing ? 'pause' : 'play';
      const label = appState.playing ? 'Pause' : 'Lecture';
      const html  = `<i data-lucide="${icon}"></i> ${label}`;
      $('#play-toggle').innerHTML = html;
      $('#reader-play').innerHTML = html;
      $('#reader-status').textContent = appState.playing ? 'Lecture en cours…' : 'Prêt';
      $('#play-toggle').disabled = false;
      $('#reader-play').disabled = false;
      // Sync bouton zen
      _zenUpdatePlayBtn && _zenUpdatePlayBtn();
      if (window.lucide) lucide.createIcons();
    }
    function renderCarousel() {
      const track = $('#carousel-track');
      const dots  = $('#carousel-dots');
      if (!track || !dots) return;

      const docs = appState.docs;
      if (!docs.length) {
        track.innerHTML = `<div class="carousel-doc-card" style="text-align:center; color:var(--color-text-faint); padding:var(--space-8);">
          <i data-lucide="inbox" style="width:32px;height:32px;margin:auto;display:block;margin-bottom:var(--space-3);"></i>
          Aucun document — importez un fichier
        </div>`;
        dots.innerHTML = '';
        if (window.lucide) lucide.createIcons();
        return;
      }

      // Garder _carouselIndex dans les limites
      _carouselIndex = Math.max(0, Math.min(_carouselIndex, docs.length - 1));

      // Sync avec le doc courant
      const curIdx = docs.findIndex(d => d.id === appState.currentDocId);
      if (curIdx !== -1) _carouselIndex = curIdx;

      // Icône selon type
      const typeIcon = { pdf: 'file-text', txt: 'file', web: 'globe', ocr: 'scan-text', manuel: 'pencil' };

      track.innerHTML = docs.map((d, i) => {
        const pct  = d.wordIndex && d.content
          ? Math.round((d.wordIndex / d.content.split(/(\s+)/).length) * 100) : (d.progress || 0);
        const icon = typeIcon[d.type] || 'file';
        const isActive = d.id === appState.currentDocId;
        return `
          <div class="carousel-doc-card ${isActive ? 'active-doc' : ''}" id="ccard-${d.id}">
            <div style="display:flex; align-items:flex-start; gap:var(--space-3);">
              <div style="width:40px;height:40px;border-radius:var(--radius-md);background:var(--color-primary-soft);
                display:grid;place-items:center;flex-shrink:0;color:var(--color-primary);">
                <i data-lucide="${icon}" style="width:18px;height:18px;"></i>
              </div>
              <div style="flex:1;min-width:0;">
                <div class="carousel-doc-title">${d.title}</div>
                <div class="carousel-doc-meta">${d.type.toUpperCase()} · ${d.minutes} min · ${pct}% lu</div>
              </div>
            </div>
            <div class="carousel-progress">
              <div class="carousel-progress-fill" style="width:${pct}%"></div>
            </div>
            <div class="carousel-doc-actions">
              <button class="btn btn-primary" style="flex:1;padding:.55rem;" id="cplay-${d.id}">
                <i data-lucide="play" style="width:14px;"></i> ${isActive && appState.playing ? 'En cours…' : 'Écouter'}
              </button>
              <button class="btn btn-outline" style="padding:.55rem var(--space-3);" id="cread-${d.id}">
                <i data-lucide="book-open" style="width:14px;"></i>
              </button>
            </div>
          </div>`;
      }).join('');

      // Dots
      dots.innerHTML = docs.map((_, i) =>
        `<div class="carousel-dot ${i === _carouselIndex ? 'active' : ''}" id="cdot-${i}"></div>`
      ).join('');

      // Scroll au doc courant
      const activeCard = track.children[_carouselIndex];
      if (activeCard) {
        setTimeout(() => activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 50);
      }

      // Events cartes
      docs.forEach((d, i) => {
        // Clic sur la carte → sélectionner le doc
        $(`#ccard-${d.id}`)?.addEventListener('click', (e) => {
          if (e.target.closest('button')) return; // laisser les boutons gérer
          _selectCarouselDoc(d, i);
        });
        // Bouton Écouter
        $(`#cplay-${d.id}`)?.addEventListener('click', () => {
          _selectCarouselDoc(d, i);
          setTimeout(() => {
            if (!appState.playing) {
              $('#play-toggle').disabled = true;
              startSpeechEngine();
            } else {
              stopSpeechEngine();
            }
          }, 80);
        });
        // Bouton Lire (aller page Reader)
        $(`#cread-${d.id}`)?.addEventListener('click', () => {
          _selectCarouselDoc(d, i);
          navigate('reader');
        });
        // Dot
        $(`#cdot-${i}`)?.addEventListener('click', () => {
          _carouselIndex = i;
          track.children[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
          renderCarousel();
        });
      });

      if (window.lucide) lucide.createIcons();
    }
    function _selectCarouselDoc(d, i) {
      if (appState.currentDocId !== d.id) {
        stopSpeechEngine();
        appState.currentDocId     = d.id;
        appState.currentWordIndex = d.wordIndex || 0;
        appState.wordsArray       = d.content.split(/(\s+)/);
        // Restaurer la vitesse spécifique au document si elle existe
        if (d.speed) {
          appState.speed = d.speed;
          const sr = $('#speed-range');
          const sv = $('#speed-value');
          if (sr) sr.value = d.speed;
          if (sv) sv.textContent = `${d.speed.toFixed(1)}x`;
        }
        savePrefs();
      }
      _carouselIndex = i;
      renderAll();
    }
    function renderAll() {
      const doc = appState.docs.find(d => d.id === appState.currentDocId);
      if (doc) {
        $('#reader-doc-title').textContent = doc.title;
        $('#reader-doc-desc').textContent = `Type : ${doc.type.toUpperCase()} · ${doc.minutes} min · ${doc.language}`;
        $('#current-doc-badge').textContent = doc.type.toUpperCase();
        $('#full-reader-title').textContent = doc.title;
        $('#full-reader-meta').textContent = `${doc.language} · Vitesse : ${appState.speed}x · ${doc.minutes} min`;
        $('#summary-doc-title').textContent = doc.title;

        $('#summary-points').innerHTML = doc.summary.map((s, i) => `
          <div class="summary-point" id="sm-pt-${i}">
            <strong>${s.headline}</strong>
            <div class="point-detail">${s.detail || 'Sous-sections d\'étude disponibles.'}</div>
          </div>
        `).join('');
        doc.summary.forEach((s, i) => {
          const card = $(`#sm-pt-${i}`);
          if (card) card.addEventListener('click', () => card.classList.toggle('expanded'));
        });

        $('#insight-list').innerHTML = doc.insights
          ? doc.insights.map((ins, i) => `
            <div class="insight-point" id="ins-pt-${i}">
              <strong>${ins.headline}</strong>
              <div class="point-detail">${ins.detail || 'Analyse sémantique complémentaire.'}</div>
            </div>
          `).join('')
          : '<div class="empty-state">Aucun point clé supplémentaire.</div>';

        doc.insights && doc.insights.forEach((ins, i) => {
          const card = $(`#ins-pt-${i}`);
          if (card) card.addEventListener('click', () => card.classList.toggle('expanded'));
        });
      }

      $('#stat-docs').textContent = appState.docs.length;
      $('#stat-minutes').textContent = `${appState.docs.reduce((acc, d) => acc + (d.minutes || 5), 0)} m`;

      // Subtitle Home
      const totalMin = appState.docs.reduce((acc, d) => acc + (d.minutes || 0), 0);
      const sub = $('#home-subtitle');
      if (sub) sub.textContent = `${appState.docs.length} document${appState.docs.length > 1 ? 's' : ''} · ${totalMin} min`;

      // Carrousel Home
      renderCarousel();

      // Objectif quotidien
      renderDailyGoal();

      // Barre de progression de lecture
      const curDoc = appState.docs.find(d => d.id === appState.currentDocId);
      if (curDoc && appState.wordsArray.length > 0) {
        const pct = Math.round((appState.currentWordIndex / appState.wordsArray.length) * 100);
        $$('.progress-fill').forEach(el => el.style.width = pct + '%');
      }

      renderTextInReader(appState.playing);

      // Bibliothèque
      let list = [...appState.docs];
      if (appState.currentFilter !== 'all') list = list.filter(d => d.type === appState.currentFilter);
      if (appState.search.trim()) list = list.filter(d => d.title.toLowerCase().includes(appState.search.toLowerCase()));
      list.sort((a, b) => appState.sortAsc ? a.title.localeCompare(b.title) : b.id - a.id);

      const container = $('#library-list');
      if (!list.length) {
        container.innerHTML = `<div class="empty-state">Aucun élément trouvé.</div>`;
      } else {
        container.innerHTML = list.map(d => `
          <div class="card library-item" style="${d.id === appState.currentDocId ? 'border-color:var(--color-primary);' : ''}">
            <div class="thumb"><i data-lucide="${d.type === 'pdf' ? 'file-text' : d.type === 'web' ? 'globe' : 'file'}"></i></div>
            <div class="meta">
              <h4>${d.title}</h4>
              <p>${d.type.toUpperCase()} · ${d.minutes} min · ${d.language}</p>
            </div>
            <div class="list-actions">
              <button class="small-btn btn-select" id="sel-doc-${d.id}">Écouter</button>
              <button class="small-btn btn-delete" id="del-doc-${d.id}" style="color:var(--color-danger); border-color:rgba(222,99,135,.2);" title="Supprimer"><i data-lucide="trash-2" style="width:14px;"></i></button>
            </div>
          </div>
        `).join('');

        list.forEach(d => {
          $(`#sel-doc-${d.id}`).addEventListener('click', () => {
            appState.currentDocId     = d.id;
            appState.currentWordIndex = d.wordIndex || 0;
            stopSpeechEngine();
            appState.wordsArray = d.content.split(/(\s+)/);
            savePrefs();
            navigate('reader');
          });
          $(`#del-doc-${d.id}`).addEventListener('click', async (e) => {
            e.stopPropagation();
            appState.docs = appState.docs.filter(item => item.id !== d.id);
            if (appState.currentDocId === d.id) {
              stopSpeechEngine();
              appState.currentDocId     = appState.docs.length ? appState.docs[0].id : null;
              appState.currentWordIndex = 0;
            }
            await deleteDoc(d.id);
            renderAll();
            toast("Document supprimé.");
          });
        });
      }

      $('#speed-value').textContent = `${appState.speed.toFixed(1)}x`;
      if (window.lucide) lucide.createIcons();
    }
    function skipTimelineWords(count) {
      if (!appState.currentDocId || !appState.wordsArray.length) return;
      stopSpeechEngine();
      let target = appState.currentWordIndex + count;
      if (target < 0) target = 0;
      if (target >= appState.wordsArray.length) target = appState.wordsArray.length - 1;
      appState.currentWordIndex = target;
      toast(count > 0 ? "⏩ +15s" : "⏪ -15s");
      startSpeechEngine();
    }
    function _getBookmarks(docId) {
      try { return JSON.parse(localStorage.getItem(`bk_${docId}`) || '[]'); } catch(e) { return []; }
    }
    function _saveBookmarks(docId, bks) {
      localStorage.setItem(`bk_${docId}`, JSON.stringify(bks));
    }
    function renderBookmarks() {
      const list = $('#bookmark-list');
      if (!list) return;
      const docId = appState.currentDocId;
      if (!docId) { list.innerHTML = '<p style="font-size:11px;color:var(--color-text-faint);">Aucun document.</p>'; return; }
      const bks = _getBookmarks(docId);
      if (!bks.length) {
        list.innerHTML = '<p style="font-size:11px;color:var(--color-text-faint);">Aucun marque-page — appuie sur "Marquer" pendant la lecture.</p>';
        return;
      }
      list.innerHTML = bks.map((bk, i) => `
        <div class="bookmark-item" id="bk-item-${i}">
          <i data-lucide="bookmark" class="bookmark-icon" style="width:16px;height:16px;"></i>
          <span class="bookmark-text">${bk.preview}</span>
          <span class="bookmark-pct">${bk.pct}%</span>
          <button class="bookmark-del" id="bk-del-${i}" title="Supprimer">✕</button>
        </div>`).join('');
      bks.forEach((bk, i) => {
        $(`#bk-item-${i}`)?.addEventListener('click', (e) => {
          if (e.target.closest('.bookmark-del')) return;
          appState.currentWordIndex = bk.wordIndex;
          if (appState.playing) { stopSpeechEngine(); setTimeout(() => startSpeechEngine(), 80); }
          else autoHighlightAndCenter(bk.wordIndex);
          toast(`📍 Reprise au marque-page ${bk.pct}%`);
        });
        $(`#bk-del-${i}`)?.addEventListener('click', () => {
          const updated = _getBookmarks(docId).filter((_, j) => j !== i);
          _saveBookmarks(docId, updated);
          renderBookmarks();
        });
      });
      if (window.lucide) lucide.createIcons();
    }
    function _syncLabel(v) {
      if (v <= 6)  return 'Très lent';
      if (v <= 9)  return 'Lent';
      if (v <= 12) return 'Normal';
      if (v <= 16) return 'Rapide';
      return 'Très rapide';
    }
    function updateHighlightBtn() {
      const btn = $('#highlight-toggle');
      if (appState.highlight) {
        btn.classList.add('active');
        btn.innerHTML = '<i data-lucide="highlighter"></i><span>Surlignage ON</span>';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i data-lucide="highlighter"></i><span>Surlignage</span>';
      }
      if (window.lucide) lucide.createIcons();
    }
    function _zenRenderText() {
      const doc = appState.docs.find(d => d.id === appState.currentDocId);
      const box = $('#zen-text');
      if (!doc || !appState.wordsArray.length) { box.textContent = ''; return; }
      box.innerHTML = appState.wordsArray.map((tok, i) =>
        tok.trim() === ''
          ? tok
          : `<span class="zen-word" id="zword-${i}">${tok}</span>`
      ).join('');
      // Clic sur un mot → repositionner la lecture
      $$('#zen-text .zen-word').forEach(span => {
        span.addEventListener('click', () => {
          const idx = parseInt(span.id.replace('zword-', ''));
          if (isNaN(idx)) return;
          appState.currentWordIndex = idx;
          if (appState.playing) { stopSpeechEngine(); setTimeout(() => startSpeechEngine(), 80); }
          else startSpeechEngine();
        });
      });
    }
    function _zenHighlight(index) {
      const box = $('#zen-text');
      if (!box) return;
      $$('#zen-text .zen-word').forEach(s => {
        const id = parseInt(s.id.replace('zword-', ''));
        s.classList.remove('word-highlight', 'word-read');
        if (id < index)        s.classList.add('word-read');
        else if (id === index) s.classList.add('word-highlight');
      });
      // Scroll robuste : position relative au conteneur scrollable
      const node = $(`#zword-${index}`);
      if (node && box) {
        // Utiliser offsetTop relatif au parent scrollable
        let offsetTop = 0;
        let el = node;
        while (el && el !== box) {
          offsetTop += el.offsetTop;
          el = el.offsetParent;
        }
        const target = offsetTop - (box.clientHeight / 2) + (node.clientHeight / 2);
        box.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
      }
      // Progression zen
      if (appState.wordsArray.length) {
        const pct  = Math.round((index / appState.wordsArray.length) * 100);
        const fill = $('#zen-progress-fill');
        if (fill) fill.style.width = pct + '%';
      }
    }
    function _zenUpdatePlayBtn() {
      const btn = $('#zen-play');
      if (!btn) return;
      btn.innerHTML = appState.playing
        ? '<i data-lucide="pause"></i><span>Pause</span>'
        : '<i data-lucide="play"></i><span>Lecture</span>';
      if (window.lucide) lucide.createIcons();
    }
    function openZenMode() {
      const doc = appState.docs.find(d => d.id === appState.currentDocId);
      if (!doc) { toast("Aucun document sélectionné."); return; }
      appState.isFocusMode = true;
      // Mettre à jour bouton toolbar
      const btn = $('#focus-toggle');
      btn.classList.add('active');
      btn.innerHTML = '<i data-lucide="eye"></i><span>Quitter Zen</span>';
      if (window.lucide) lucide.createIcons();
      // Ouvrir l'overlay
      $('#zen-title').textContent = doc.title;
      const overlay = $('#zen-overlay');
      overlay.classList.add('active');
      _zenRenderText();
      _zenHighlight(appState.currentWordIndex);
      _zenUpdatePlayBtn();
      // Empêcher le scroll de la page derrière
      document.body.style.overflow = 'hidden';
    }
    function closeZenMode() {
      appState.isFocusMode = false;
      $('#zen-overlay').classList.remove('active');
      document.body.style.overflow = '';
      const btn = $('#focus-toggle');
      btn.classList.remove('active');
      btn.innerHTML = '<i data-lucide="eye-off"></i><span>Mode Zen</span>';
      if (window.lucide) lucide.createIcons();
    }
    function showSelectionPopup(x, y) {
      selectionPopup.style.left = `${Math.min(x, window.innerWidth - 180)}px`;
      selectionPopup.style.top  = `${Math.max(y - 52, 8)}px`;
      selectionPopup.classList.add('visible');
    }
    function hideSelectionPopup() {
      selectionPopup.classList.remove('visible');
    }
    function handleTextSelection() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) { hideSelectionPopup(); return; }

      // Vérifier que la sélection est dans #reader-text
      const box = $('#reader-text');
      if (!box.contains(sel.anchorNode)) { hideSelectionPopup(); return; }

      // Positionner le popup au-dessus de la sélection
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      showSelectionPopup(rect.left + rect.width / 2 - 70, rect.top + window.scrollY);
    }
    function toast(msg) {
      const wrap = $('#toast-wrap');
      const el = document.createElement('div');
      el.className = 'toast'; el.textContent = msg;
      wrap.appendChild(el);
      setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(10px)'; }, 2200);
      setTimeout(() => el.remove(), 2700);
    }
    function _todayStr() {
      return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    }
    function _checkDailyReset() {
      const today = _todayStr();
      if (appState.dailyDate !== today) {
        appState.dailyDoneMin = 0;
        appState.dailyDate    = today;
        savePrefs();
      }
    }
    function renderDailyGoal() {
      _checkDailyReset();
      const done  = appState.dailyDoneMin || 0;
      const goal  = appState.dailyGoalMin || 30;
      const pct   = Math.min(100, Math.round((done / goal) * 100));
      const fill  = $('#daily-fill');
      const pctEl = $('#daily-pct');
      const doneEl= $('#daily-done');
      const tgtEl = $('#daily-target');
      if (fill)  fill.style.width  = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';
      if (doneEl)doneEl.textContent= `${done.toFixed(1)} min écoutées`;
      if (tgtEl) tgtEl.textContent = `objectif : ${goal} min ✏️`;
      // Stat hero
      const todayEl = $('#stat-today');
      if (todayEl) todayEl.textContent = done.toFixed(1) + ' m';
    }
    function _startDailyTimer() {
      _stopDailyTimer();
      _dailyTimer = setInterval(() => {
        if (!appState.playing) return;
        appState.dailyDoneMin += 10 / 60;
        renderDailyGoal();
        _saveDailyToHistory();
        savePrefs();
      }, 10000);
    }
    function _stopDailyTimer() {
      if (_dailyTimer) { clearInterval(_dailyTimer); _dailyTimer = null; }
    }
    async function _fetchViaProxy(targetUrl, statusEl) {
      for (let i = 0; i < CORS_PROXIES.length; i++) {
        const proxy = CORS_PROXIES[i];
        try {
          if (statusEl) statusEl.textContent = `⏳ Proxy ${i+1}/${CORS_PROXIES.length} (${proxy.name})…`;
          const resp = await fetch(proxy.url(targetUrl), {
            signal: AbortSignal.timeout(12000)
          });
          if (!resp.ok) {
            console.warn(`[${proxy.name}] HTTP ${resp.status}`);
            continue;
          }
          const html = await proxy.extract(resp);
          if (!html || html.length < 200 || html.startsWith('Oops') || html.startsWith('Error')) {
            console.warn(`[${proxy.name}] Réponse invalide :`, (html||'').substring(0,60));
            continue;
          }
          console.log(`[${proxy.name}] ✅ ${html.length} chars`);
          return html;
        } catch(e) {
          console.warn(`[${proxy.name}] Erreur :`, e.message);
        }
      }
      throw new Error('Tous les proxies ont échoué. Site protégé ou inaccessible.');
    }
    function _extractTextFromHtml(html, targetUrl) {
      const parser = new DOMParser();
      const doc2   = parser.parseFromString(html, 'text/html');

      // Supprimer les éléments parasites
      const toRemove = ['script','style','noscript','nav','footer','header',
        'aside','[role="navigation"]','[role="banner"]','[role="complementary"]',
        '.menu','.sidebar','.ad','.cookie','.popup','.modal','.newsletter'];
      toRemove.forEach(sel => {
        try { doc2.querySelectorAll(sel).forEach(el => el.remove()); } catch(e) {}
      });

      // Chercher le contenu principal dans l'ordre de priorité
      const candidates = [
        'article', 'main', '[role="main"]',
        '.post-content','.article-body','.entry-content','.article-content',
        '.post-body','.content-body','.story-body','.article-text',
        '#content','#main-content','.main-content',
        'body'
      ];
      let mainEl = null;
      for (const sel of candidates) {
        const el = doc2.querySelector(sel);
        if (el) { mainEl = el; break; }
      }

      let text = (mainEl || doc2.body)?.innerText || (mainEl || doc2.body)?.textContent || '';
      // Nettoyer
      text = text
        .replace(/\t/g, ' ')
        .replace(/ {2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      // Titre
      const h1    = doc2.querySelector('h1')?.textContent?.trim();
      const title = h1 || doc2.title?.trim() || new URL(targetUrl).hostname;

      return { text, title };
    }
    async function importFromUrl(url) {
      const statusEl = $('#url-import-status');
      const btn      = $('#url-import-btn');
      if (!url || !url.startsWith('http')) {
        toast("⚠️ URL invalide — commence par http://");
        return;
      }
      statusEl.style.display = 'block';
      statusEl.textContent   = '⏳ Tentative de récupération…';
      btn.disabled = true;

      try {
        const html = await _fetchViaProxy(url, statusEl);

        statusEl.textContent = '⏳ Extraction du texte…';
        const { text, title } = _extractTextFromHtml(html, url);

        if (!text || text.length < 80) {
          throw new Error('Texte trop court — le site est peut-être protégé par JavaScript.');
        }

        const wordCount = text.split(/\s+/).length;
        statusEl.textContent = `✅ ${wordCount} mots extraits — « ${title.substring(0,40)} »`;
        await insertDocToLibrary(title, text, 'web', 'URL');
        $('#url-import-input').value = '';
        setTimeout(() => { statusEl.style.display = 'none'; }, 4000);

      } catch(err) {
        statusEl.textContent = `❌ ${err.message}`;
        statusEl.style.color = 'var(--color-danger)';
        toast("❌ Import URL : " + err.message.substring(0, 60));
      } finally {
        btn.disabled = false;
      }
    }
    async function processOcrImage(file) {
      const preview   = $('#ocr-preview-wrap');
      const img       = $('#ocr-preview-img');
      const progWrap  = $('#ocr-progress-wrap');
      const progFill  = $('#ocr-progress-fill');
      const progText  = $('#ocr-progress-text');

      // Afficher l'aperçu
      const objectUrl = URL.createObjectURL(file);
      img.src         = objectUrl;
      preview.classList.add('active');
      progWrap.classList.add('active');
      progFill.style.width = '0%';
      progText.textContent = 'Initialisation OCR…';

      navigate('import');

      try {
        if (typeof Tesseract === 'undefined') {
          throw new Error('Tesseract.js non chargé — vérifiez votre connexion.');
        }

        const result = await Tesseract.recognize(file, 'fra+eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const pct = Math.round(m.progress * 100);
              progFill.style.width = pct + '%';
              progText.textContent = `Reconnaissance texte… ${pct}%`;
            } else {
              progText.textContent = m.status;
            }
          }
        });

        const text = result.data.text.trim();
        if (!text || text.length < 20) throw new Error('Aucun texte détecté sur cette image.');

        progFill.style.width = '100%';
        progText.textContent = `✅ ${text.split(/\s+/).length} mots extraits`;

        const title = file.name.replace(/\.[^.]+$/, '') || 'Image OCR';
        await insertDocToLibrary(title, text, 'ocr', 'OCR');

        setTimeout(() => {
          preview.classList.remove('active');
          progWrap.classList.remove('active');
          URL.revokeObjectURL(objectUrl);
        }, 2000);

      } catch(err) {
        progText.textContent = '❌ ' + err.message;
        toast("❌ OCR échoué : " + err.message);
      }
    }
    function _renderOnboardingStep(step) {
      const s = ONBOARDING_STEPS[step];
      $('#ob-icon').innerHTML   = `<i data-lucide="${s.icon}"></i>`;
      $('#ob-title').textContent = s.title;
      $('#ob-desc').textContent  = s.desc;
      $$('#ob-dots .onboarding-dot').forEach((d, i) => d.classList.toggle('active', i === step));
      $('#ob-next').textContent  = step === ONBOARDING_STEPS.length - 1 ? 'Commencer 🚀' : 'Suivant →';
      if (window.lucide) lucide.createIcons();
    }
    function _closeOnboarding() {
      $('#onboarding-overlay').classList.remove('active');
      localStorage.setItem('speechify_onboarded', '1');
    }
    function _showOnboardingIfNeeded() {
      if (!localStorage.getItem('speechify_onboarded')) {
        _obStep = 0;
        _renderOnboardingStep(0);
        $('#onboarding-overlay').classList.add('active');
      }
    }
    function _getWeekData() {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d   = new Date();
        d.setDate(d.getDate() - i);
        const key = `speechify_day_${d.toISOString().slice(0, 10)}`;
        const val = parseFloat(localStorage.getItem(key) || '0');
        data.push({ label: ['Di','Lu','Ma','Me','Je','Ve','Sa'][d.getDay()], val, isToday: i === 0 });
      }
      return data;
    }
    function renderStats() {
      const done = appState.dailyDoneMin || 0;
      const goal = appState.dailyGoalMin || 30;
      const pct  = Math.min(100, Math.round((done / goal) * 100));

      // Aujourd'hui
      const v = $('#stats-today-val');   if (v) v.textContent = done.toFixed(1) + ' min';
      const g = $('#stats-today-goal');  if (g) g.textContent = `sur ${goal} min d'objectif`;
      const p = $('#stats-today-pct');   if (p) p.textContent = pct + '%';
      const b = $('#stats-today-bar');   if (b) { setTimeout(() => b.style.width = pct + '%', 100); }

      // Bouton modifier objectif
      const editBtn = $('#stats-edit-goal');
      if (editBtn) {
        editBtn.onclick = () => {
          const val = prompt(`Objectif quotidien (minutes) :`, appState.dailyGoalMin);
          const n   = parseInt(val);
          if (n > 0 && n <= 480) {
            appState.dailyGoalMin = n;
            savePrefs();
            renderStats();
            renderDailyGoal();
            toast(`🎯 Objectif mis à jour : ${n} min`);
          }
        };
      }

      // Mini totaux
      const td = $('#stats-total-docs'); if (td) td.textContent = appState.docs.length;
      const tm = $('#stats-total-min');
      if (tm) {
        const totalMin = appState.docs.reduce((acc, d) => acc + (d.minutes || 0), 0);
        tm.textContent = totalMin;
      }

      // Graphique semaine avec valeur au-dessus des barres
      const weekEl = $('#week-bars');
      if (weekEl) {
        const days   = _getWeekData();
        const maxVal = Math.max(...days.map(d => d.val), 1);
        weekEl.innerHTML = days.map(d => {
          const h   = Math.max(4, Math.round((d.val / maxVal) * 72));
          const lbl = d.val > 0 ? d.val.toFixed(1) : '';
          return `
            <div class="week-bar-wrap">
              <div class="week-bar-val">${lbl}</div>
              <div class="week-bar${d.isToday ? ' today' : ''}"
                style="height:0px" data-h="${h}"
                title="${d.val.toFixed(1)} min"></div>
              <div class="week-bar-label">${d.label}</div>
            </div>`;
        }).join('');
        // Animer les barres après rendu
        setTimeout(() => {
          weekEl.querySelectorAll('.week-bar').forEach(bar => {
            bar.style.height = bar.dataset.h + 'px';
          });
        }, 100);
      }

      // Par document
      const perDocEl = $('#stats-per-doc');
      if (perDocEl) {
        const typeIcons = { pdf: '📄', txt: '📝', web: '🌐', ocr: '📷', manuel: '✏️' };
        perDocEl.innerHTML = appState.docs.length
          ? appState.docs.map(d => {
              const p2 = d.wordIndex && d.content
                ? Math.round((d.wordIndex / d.content.split(/(\s+)/).length) * 100)
                : (d.progress || 0);
              const icon = typeIcons[d.type] || '📄';
              return `
                <div class="stat-doc-row">
                  <div class="stat-doc-icon">${icon}</div>
                  <div class="stat-doc-info">
                    <div class="stat-doc-title">${d.title}</div>
                    <div style="font-size:10px; color:var(--color-text-faint);">${d.type.toUpperCase()} · ${d.minutes} min</div>
                    <div class="stat-doc-track">
                      <div class="stat-doc-fill" style="width:${p2}%"></div>
                    </div>
                  </div>
                  <div class="stat-doc-pct">${p2}%</div>
                </div>`;
            }).join('')
          : '<p style="font-size:11px;color:var(--color-text-faint);text-align:center;padding:var(--space-4);">Aucun document.</p>';
      }
    }
    function _saveDailyToHistory() {
      const key = `speechify_day_${_todayStr()}`;
      localStorage.setItem(key, (appState.dailyDoneMin || 0).toFixed(2));
    }
    async function _requestNotifPermission() {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
    function _notifyReadingDone(docTitle) {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      // Sur Android PWA installée, la notification s'affiche en système
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'NOTIFY',
            title: '✅ Lecture terminée',
            body: `"${docTitle}" a été lu entièrement.`,
            icon: './icons/icon-192.png'
          });
        } else {
          // Fallback navigateur
          new Notification('✅ Lecture terminée', {
            body: `"${docTitle}" a été lu entièrement.`,
            icon: './icons/icon-192.png',
            badge: './icons/icon-192.png',
            silent: false
          });
        }
      } catch(e) { console.warn('Notification échouée:', e); }
    }
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
        fillScroll('lib-fr',       b => b.lang === 'fr');
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

    // Recherche
    $('#lib-search')?.addEventListener('input', (e) => {
      _libSearchQuery = e.target.value;
      renderLibrary();
    });
    $('#lib-search-btn')?.addEventListener('click', () => {
      _libSearchQuery = $('#lib-search').value;
      renderLibrary();
    });

    // Catégories
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

    // ─── BOOTSTRAP ASYNC ─────────────────────────────────────────────────────
    initStorage().then(() => {
      // Restaurer thème
      document.documentElement.setAttribute('data-theme', appState.theme);
      $('#theme-toggle-btn').innerHTML = appState.theme === 'dark'
        ? '<i data-lucide="sun-medium"></i>'
        : '<i data-lucide="moon-star"></i>';

      // Restaurer vitesse
      $('#speed-range').value = appState.speed;
      $('#speed-value').textContent = `${appState.speed.toFixed(1)}x`;

      // Restaurer pitch
      if ($('#pitch-range')) {
        $('#pitch-range').value = appState.pitch || 1.0;
        $('#pitch-value').textContent = (appState.pitch || 1.0).toFixed(1);
      }

      // Restaurer pause
      if ($('#pause-range')) {
        $('#pause-range').value = appState.pauseMs ?? 400;
        $('#pause-value').textContent = ((appState.pauseMs ?? 400) / 1000).toFixed(1) + 's';
      }

      // Restaurer mode lecture
      $$('.read-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === (appState.readMode || 'sentence'));
      });

      // Restaurer sync
      CHARS_PER_SEC = appState.syncSpeed || 9;
      $('#sync-range').value = CHARS_PER_SEC;
      $('#sync-value').textContent = _syncLabel(CHARS_PER_SEC);

      // Restaurer highlight
      updateHighlightBtn();

      // Restaurer filtre bibliothèque
      $$('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === appState.currentFilter);
      });

      renderAll();
      navigate('home');

      // Onboarding première utilisation
      setTimeout(_showOnboardingIfNeeded, 800);

      // Demander permission notifications (après interaction utilisateur)
      setTimeout(_requestNotifPermission, 3000);

      if (window.lucide) lucide.createIcons();
    }).catch(err => {
      console.error('initStorage error:', err);
      // Fallback : démarrer sans données
      appState.docs = [...initialLibraryMock];
      appState.currentDocId = initialLibraryMock[0].id;
      renderAll();
      navigate('home');
    });
    });