/**
 * HTML5 TEST ARENA - ASOSIY SCRIPT DASTURI
 * 20 ta savol, Web Audio API, Canvas Confetti, Sertifikat va Tarix
 */

// =========================================================
// 1. ILIQA HOLATI (STATE)
// =========================================================
const state = {
  currentQuestionIndex: 0,
  userAnswers: new Array(HTML_QUESTIONS.length).fill(null),
  studentName: "Mehmon O'quvchi",
  quizMode: "study", // "study" yoki "exam"
  timerSeconds: 0,
  timerInterval: null,
  soundEnabled: true,
  theme: "dark",
  startTime: null,
  endTime: null
};

// =========================================================
// 2. WEB AUDIO API - TIK VA ELEGAN TOVUSHLAR
// =========================================================
class SoundController {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playCorrect() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  playWrong() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playClick() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playFanfare() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + (i * 0.12);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  }
}

const sounds = new SoundController();

// =========================================================
// 3. CANVAS KONFETTI SISTEMASI
// =========================================================
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animationId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launch(count = 120) {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    this.particles = [];

    const colors = ['#f16529', '#e44d26', '#3b82f6', '#10b981', '#fbbf24', '#8b5cf6', '#ec4899'];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 16 - 6,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
        gravity: 0.38
      });
    }

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.render();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.alpha -= 0.005;

      if (p.alpha <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.render());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationId = null;
    }
  }
}

const confetti = new ConfettiCannon('confetti-canvas');

// =========================================================
// 4. DOM ELEMENTLARI VA HAVOLALAR
// =========================================================
const DOM = {
  // Views
  viewHome: document.getElementById('view-home'),
  viewQuiz: document.getElementById('view-quiz'),
  viewResults: document.getElementById('view-results'),

  // Header
  btnBrandHome: document.getElementById('btn-brand-home'),
  btnHistoryOpen: document.getElementById('btn-history-open'),
  btnSoundToggle: document.getElementById('btn-sound-toggle'),
  soundIcon: document.getElementById('sound-icon'),
  soundLabel: document.getElementById('sound-label'),
  btnThemeToggle: document.getElementById('btn-theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  themeLabel: document.getElementById('theme-label'),

  // Home view
  inputStudentName: document.getElementById('input-student-name'),
  modeStudyLabel: document.getElementById('mode-study-label'),
  modeExamLabel: document.getElementById('mode-exam-label'),
  btnStartQuiz: document.getElementById('btn-start-quiz'),

  // Quiz view
  quizQuestionCounter: document.getElementById('quiz-question-counter'),
  quizTimerText: document.getElementById('quiz-timer-text'),
  quizLiveScore: document.getElementById('quiz-live-score'),
  btnQuitQuiz: document.getElementById('btn-quit-quiz'),
  quizProgressBar: document.getElementById('quiz-progress-bar'),
  questionMapGrid: document.getElementById('question-map-grid'),
  
  qTitle: document.getElementById('q-title'),
  qCategoryTag: document.getElementById('q-category-tag'),
  codeSnippetBox: document.getElementById('code-snippet-box'),
  codeSnippetContent: document.getElementById('code-snippet-content'),
  btnCopyCode: document.getElementById('btn-copy-code'),
  optionsContainer: document.getElementById('options-container'),
  explanationBox: document.getElementById('explanation-box'),
  explanationText: document.getElementById('explanation-text'),

  btnPrevQuestion: document.getElementById('btn-prev-question'),
  btnNextQuestion: document.getElementById('btn-next-question'),
  btnFinishQuiz: document.getElementById('btn-finish-quiz'),

  // Results view
  resultStatusBadge: document.getElementById('result-status-badge'),
  resultHeadline: document.getElementById('result-headline'),
  resultUserGreet: document.getElementById('result-user-greet'),
  resultPercentVal: document.getElementById('result-percent-val'),
  resultFractionVal: document.getElementById('result-fraction-val'),
  resultCircleProgress: document.getElementById('result-circle-progress'),
  statCorrectCount: document.getElementById('stat-correct-count'),
  statWrongCount: document.getElementById('stat-wrong-count'),
  statTimeSpent: document.getElementById('stat-time-spent'),
  statGradeText: document.getElementById('stat-grade-text'),
  certEligibleBanner: document.getElementById('cert-eligible-banner'),
  btnOpenCertificate: document.getElementById('btn-open-certificate'),
  btnRestartQuiz: document.getElementById('btn-restart-quiz'),
  btnReviewAnswers: document.getElementById('btn-review-answers'),

  // Modals
  modalCert: document.getElementById('modal-certificate'),
  btnCloseCert: document.getElementById('btn-close-cert'),
  btnModalCloseBottom: document.getElementById('btn-modal-close-bottom'),
  btnPrintCert: document.getElementById('btn-print-certificate'),
  certDisplayName: document.getElementById('cert-display-name'),
  certScoreDisplay: document.getElementById('cert-score-display'),
  certRankTag: document.getElementById('cert-rank-tag'),
  certDateDisplay: document.getElementById('cert-date-display'),

  modalReview: document.getElementById('modal-review'),
  btnCloseReview: document.getElementById('btn-close-review'),
  btnReviewCloseBottom: document.getElementById('btn-review-close-bottom'),
  reviewQuestionsList: document.getElementById('review-questions-list'),

  modalHistory: document.getElementById('modal-history'),
  btnCloseHistory: document.getElementById('btn-close-history'),
  btnCloseHistoryBottom: document.getElementById('btn-close-history-bottom'),
  btnClearHistory: document.getElementById('btn-clear-history'),
  historyRecordsContainer: document.getElementById('history-records-container')
};

// =========================================================
// 5. SAHIFA VA BOSHQARUV TUGMALARI
// =========================================================

// Mavzu (Dark / Light) sozlash
function initTheme() {
  const savedTheme = localStorage.getItem('html_quiz_theme') || 'dark';
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('html_quiz_theme', theme);

  if (theme === 'dark') {
    DOM.themeIcon.textContent = '🌙';
    DOM.themeLabel.textContent = 'Tungi';
  } else {
    DOM.themeIcon.textContent = '☀️';
    DOM.themeLabel.textContent = 'Yorug\'';
  }
}

DOM.btnThemeToggle.addEventListener('click', () => {
  sounds.playClick();
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
});

// Ovoz sozlash
function initSound() {
  const savedSound = localStorage.getItem('html_quiz_sound');
  state.soundEnabled = savedSound !== 'false';
  updateSoundUI();
}

function updateSoundUI() {
  if (state.soundEnabled) {
    DOM.soundIcon.textContent = '🔊';
    DOM.soundLabel.textContent = 'Ovoz: Yoqiq';
  } else {
    DOM.soundIcon.textContent = '🔇';
    DOM.soundLabel.textContent = 'Ovoz: O\'chiq';
  }
}

DOM.btnSoundToggle.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem('html_quiz_sound', state.soundEnabled);
  updateSoundUI();
  if (state.soundEnabled) sounds.playClick();
});

// View almashtirish
function switchView(viewName) {
  DOM.viewHome.classList.remove('active');
  DOM.viewQuiz.classList.remove('active');
  DOM.viewResults.classList.remove('active');

  if (viewName === 'home') DOM.viewHome.classList.add('active');
  if (viewName === 'quiz') DOM.viewQuiz.classList.add('active');
  if (viewName === 'results') DOM.viewResults.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Bosh sahifaga qaytish
DOM.btnBrandHome.addEventListener('click', () => {
  sounds.playClick();
  if (DOM.viewQuiz.classList.contains('active')) {
    if (confirm("Test hali yakunlanmagan. Bosh sahifaga qaytishni istaysizmi?")) {
      stopTimer();
      switchView('home');
    }
  } else {
    switchView('home');
  }
});

DOM.btnQuitQuiz.addEventListener('click', () => {
  sounds.playClick();
  if (confirm("Haqiqatan ham testdan chiqmoqchimisiz? Joriy natijalar saqlanmaydi.")) {
    stopTimer();
    switchView('home');
  }
});

// Rejim tanlash radio elementlari
const modeInputs = document.querySelectorAll('input[name="quiz-mode"]');
modeInputs.forEach(input => {
  input.addEventListener('change', (e) => {
    sounds.playClick();
    state.quizMode = e.target.value;
    document.querySelectorAll('.mode-option').forEach(el => el.classList.remove('active'));
    e.target.closest('.mode-option').classList.add('active');
  });
});

// =========================================================
// 6. VAQT HISOB-KITOBLARI (TIMER)
// =========================================================
function startTimer() {
  state.timerSeconds = 0;
  state.startTime = Date.now();
  updateTimerDisplay();

  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  state.endTime = Date.now();
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  DOM.quizTimerText.textContent = formatTime(state.timerSeconds);
}

// =========================================================
// 7. TESTNI BOSHLASH VA SAVOLLARNI CHIQARISH
// =========================================================
DOM.btnStartQuiz.addEventListener('click', () => {
  sounds.playClick();

  const rawName = DOM.inputStudentName.value.trim();
  state.studentName = rawName || "Mehmon O'quvchi";

  // State ni nollash
  state.currentQuestionIndex = 0;
  state.userAnswers = new Array(HTML_QUESTIONS.length).fill(null);

  renderQuestionMapGrid();
  switchView('quiz');
  startTimer();
  loadQuestion(0);
});

// Savollar xaritasini (1-20 tugmalari) yaratish
function renderQuestionMapGrid() {
  DOM.questionMapGrid.innerHTML = '';
  HTML_QUESTIONS.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.className = 'map-btn';
    btn.textContent = idx + 1;
    btn.title = `${idx + 1}-savolga o'tish`;
    btn.dataset.index = idx;

    btn.addEventListener('click', () => {
      sounds.playClick();
      loadQuestion(idx);
    });

    DOM.questionMapGrid.appendChild(btn);
  });
  updateQuestionMapUI();
}

function updateQuestionMapUI() {
  const buttons = DOM.questionMapGrid.querySelectorAll('.map-btn');
  buttons.forEach((btn, idx) => {
    btn.className = 'map-btn';
    if (idx === state.currentQuestionIndex) {
      btn.classList.add('current');
    }

    const ans = state.userAnswers[idx];
    if (ans !== null) {
      if (state.quizMode === 'study') {
        const isCorrect = ans === HTML_QUESTIONS[idx].correct;
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
      } else {
        btn.classList.add('answered');
      }
    }
  });

  // Jonli to'g'ri javoblar soni
  if (state.quizMode === 'study') {
    let correctCount = 0;
    state.userAnswers.forEach((ans, i) => {
      if (ans !== null && ans === HTML_QUESTIONS[i].correct) correctCount++;
    });
    DOM.quizLiveScore.textContent = correctCount;
  } else {
    // Imtihon rejimida faqat belgilanganlar sonini ko'rsatadi
    const answeredCount = state.userAnswers.filter(a => a !== null).length;
    DOM.quizLiveScore.textContent = `${answeredCount}/20`;
  }
}

// Savolni yuklash
function loadQuestion(index) {
  state.currentQuestionIndex = index;
  const q = HTML_QUESTIONS[index];

  // Header ko'rsatkichlari
  DOM.quizQuestionCounter.textContent = `${index + 1} / ${HTML_QUESTIONS.length}`;
  const progressPercent = ((index + 1) / HTML_QUESTIONS.length) * 100;
  DOM.quizProgressBar.style.width = `${progressPercent}%`;

  DOM.qTitle.textContent = q.question;
  DOM.qCategoryTag.textContent = `HTML5 Standarti • Savol #${index + 1}`;

  // Kod namunasi
  if (q.code) {
    DOM.codeSnippetBox.style.display = 'block';
    DOM.codeSnippetContent.textContent = q.code;
  } else {
    DOM.codeSnippetBox.style.display = 'none';
  }

  // Variantlarni chiqarish
  renderOptions(q, index);

  // Navigatsiya tugmalari
  DOM.btnPrevQuestion.disabled = index === 0;

  if (index === HTML_QUESTIONS.length - 1) {
    DOM.btnNextQuestion.style.display = 'none';
    DOM.btnFinishQuiz.style.display = 'inline-flex';
  } else {
    DOM.btnNextQuestion.style.display = 'inline-flex';
    DOM.btnFinishQuiz.style.display = 'none';
  }

  updateQuestionMapUI();
}

// Variantlarni render qilish
function renderOptions(q, qIndex) {
  DOM.optionsContainer.innerHTML = '';
  const userAnswer = state.userAnswers[qIndex];
  const letters = ['A', 'B', 'C', 'D'];

  // Izoh qutisini dastlab yashirish
  DOM.explanationBox.style.display = 'none';

  q.options.forEach((optText, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.optIndex = optIdx;

    btn.innerHTML = `
      <span class="option-letter">${letters[optIdx]}</span>
      <span class="option-text">${escapeHtml(optText)}</span>
    `;

    // Agar javob berilgan bo'lsa
    if (userAnswer !== null) {
      if (state.quizMode === 'study') {
        btn.disabled = true;
        if (optIdx === q.correct) {
          btn.classList.add('correct');
        } else if (optIdx === userAnswer) {
          btn.classList.add('wrong');
        }
      } else {
        // Imtihon rejimida faqat tanlanganini ko'rsatamiz
        if (optIdx === userAnswer) {
          btn.classList.add('selected');
        }
      }
    }

    btn.addEventListener('click', () => {
      selectOption(qIndex, optIdx);
    });

    DOM.optionsContainer.appendChild(btn);
  });

  // O'rganish rejimida agar javob allaqachon berilgan bo'lsa, izohni ko'rsatish
  if (state.quizMode === 'study' && userAnswer !== null) {
    DOM.explanationBox.style.display = 'flex';
    DOM.explanationText.textContent = q.explanation;
  }
}

// Variantni tanlash
function selectOption(qIndex, optIdx) {
  // Agar o'rganish rejimida allaqachon javob berilgan bo'lsa, qayta bosib bo'lmaydi
  if (state.quizMode === 'study' && state.userAnswers[qIndex] !== null) return;

  const q = HTML_QUESTIONS[qIndex];
  state.userAnswers[qIndex] = optIdx;

  if (state.quizMode === 'study') {
    const isCorrect = optIdx === q.correct;
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
    // Variantlarni yangilash
    renderOptions(q, qIndex);
  } else {
    // Imtihon rejimi - faqat tanlanish belgisini yangilash
    sounds.playClick();
    const buttons = DOM.optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((b, i) => {
      b.classList.toggle('selected', i === optIdx);
    });
  }

  updateQuestionMapUI();
}

// Kodni nusxalash tugmasi
DOM.btnCopyCode.addEventListener('click', () => {
  sounds.playClick();
  const code = DOM.codeSnippetContent.textContent;
  navigator.clipboard.writeText(code).then(() => {
    DOM.btnCopyCode.textContent = "Nusxalandi! ✓";
    setTimeout(() => {
      DOM.btnCopyCode.textContent = "Nusxalash";
    }, 2000);
  });
});

// Oldingi / Keyingi tugmalari
DOM.btnPrevQuestion.addEventListener('click', () => {
  sounds.playClick();
  if (state.currentQuestionIndex > 0) {
    loadQuestion(state.currentQuestionIndex - 1);
  }
});

DOM.btnNextQuestion.addEventListener('click', () => {
  sounds.playClick();
  if (state.currentQuestionIndex < HTML_QUESTIONS.length - 1) {
    loadQuestion(state.currentQuestionIndex + 1);
  }
});

DOM.btnFinishQuiz.addEventListener('click', () => {
  sounds.playClick();
  const unansweredCount = state.userAnswers.filter(a => a === null).length;
  if (unansweredCount > 0) {
    if (!confirm(`Sizda hali ${unansweredCount} ta belgilanmagan savol bor. Baribir testni yakunlamoqchimisiz?`)) {
      return;
    }
  }
  finishQuiz();
});

// =========================================================
// 8. TESTNI YAKUNLASH VA NATIJALAR
// =========================================================
function finishQuiz() {
  stopTimer();

  // Natijalarni hisoblash
  let correctCount = 0;
  let wrongCount = 0;

  HTML_QUESTIONS.forEach((q, idx) => {
    const ans = state.userAnswers[idx];
    if (ans !== null) {
      if (ans === q.correct) {
        correctCount++;
      } else {
        wrongCount++;
      }
    } else {
      wrongCount++;
    }
  });

  const total = HTML_QUESTIONS.length;
  const percentage = Math.round((correctCount / total) * 100);
  const timeFormatted = formatTime(state.timerSeconds);

  // Darajani aniqlash
  let gradeText = "Qoniqarsiz";
  let headline = "Sinov yakunlandi!";
  let rankTag = "Boshlang'ich";

  if (percentage >= 90) {
    gradeText = "A'lo (Top Master)";
    headline = "Ajoyib natija! Mukammal bilim!";
    rankTag = "HTML5 SENIOR MASTER";
  } else if (percentage >= 70) {
    gradeText = "Yaxshi (Muvaffaqiyatli)";
    headline = "Tabriklaymiz! Siz sinovdan o'tdingiz!";
    rankTag = "HTML5 JUNIOR DEVELOPER";
  } else if (percentage >= 50) {
    gradeText = "O'rtacha";
    headline = "Yomon emas, yanada ko'proq mashq qiling!";
    rankTag = "HTML5 AMALIYOTCHI";
  } else {
    gradeText = "Qayta o'qish tavsiya";
    headline = "HTML asoslarini qayta ko'rib chiqing!";
    rankTag = "HTML5 O'RGANUVCHI";
  }

  // UI ga chiqarish
  DOM.resultHeadline.textContent = headline;
  DOM.resultUserGreet.textContent = `${state.studentName}, sizning 20 ta HTML test bo'yicha natijangiz:`;
  DOM.resultPercentVal.textContent = `${percentage}%`;
  DOM.resultFractionVal.textContent = `${correctCount} / ${total}`;

  DOM.statCorrectCount.textContent = correctCount;
  DOM.statWrongCount.textContent = wrongCount;
  DOM.statTimeSpent.textContent = timeFormatted;
  DOM.statGradeText.textContent = gradeText;

  // Doiraviy progress animatsiyasi (Svg circle circumfrence = 2 * PI * 52 ≈ 326.7)
  const circumference = 326.7;
  const offset = circumference - (circumference * percentage) / 100;
  DOM.resultCircleProgress.style.strokeDashoffset = offset;

  // Sertifikat imkoni (>= 70%)
  if (percentage >= 70) {
    DOM.certEligibleBanner.style.display = 'flex';
    DOM.certDisplayName.textContent = state.studentName;
    DOM.certScoreDisplay.textContent = `${percentage}%`;
    DOM.certRankTag.textContent = rankTag;
    
    // Bugungi sana
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
    DOM.certDateDisplay.textContent = formattedDate;

    // Musiqa va konfetti
    setTimeout(() => {
      sounds.playFanfare();
      confetti.launch(150);
    }, 400);
  } else {
    DOM.certEligibleBanner.style.display = 'none';
  }

  // Tarixga saqlash
  saveToHistory({
    name: state.studentName,
    date: new Date().toLocaleString('uz-UZ'),
    correct: correctCount,
    total: total,
    percent: percentage,
    mode: state.quizMode === 'study' ? "O'rganish" : "Imtihon",
    timeSpent: timeFormatted
  });

  switchView('results');
}

// Qaytadan boshlash
DOM.btnRestartQuiz.addEventListener('click', () => {
  sounds.playClick();
  switchView('home');
});

// =========================================================
// 9. SERTIFIKAT MODALI
// =========================================================
DOM.btnOpenCertificate.addEventListener('click', () => {
  sounds.playClick();
  DOM.modalCert.classList.add('active');
});

DOM.btnCloseCert.addEventListener('click', () => {
  sounds.playClick();
  DOM.modalCert.classList.remove('active');
});

DOM.btnModalCloseBottom.addEventListener('click', () => {
  sounds.playClick();
  DOM.modalCert.classList.remove('active');
});

DOM.btnPrintCert.addEventListener('click', () => {
  sounds.playClick();
  window.print();
});

// =========================================================
// 10. TAHLIL VA XATOLARNI KO'RIB CHIQISH (REVIEW)
// =========================================================
DOM.btnReviewAnswers.addEventListener('click', () => {
  sounds.playClick();
  renderReviewList();
  DOM.modalReview.classList.add('active');
});

DOM.btnCloseReview.addEventListener('click', () => {
  sounds.playClick();
  DOM.modalReview.classList.remove('active');
});

DOM.btnReviewCloseBottom.addEventListener('click', () => {
  sounds.playClick();
  DOM.modalReview.classList.remove('active');
});

function renderReviewList() {
  DOM.reviewQuestionsList.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  HTML_QUESTIONS.forEach((q, idx) => {
    const userAns = state.userAnswers[idx];
    const isCorrect = userAns === q.correct;
    const isAnswered = userAns !== null;

    const div = document.createElement('div');
    div.className = 'review-item';

    const statusPill = isCorrect
      ? `<span class="review-status-pill correct">To'g'ri ✓</span>`
      : `<span class="review-status-pill wrong">${isAnswered ? 'Xato ✗' : 'Belgilanmagan'}</span>`;

    const userAnsText = isAnswered ? `${letters[userAns]}) ${q.options[userAns]}` : "Javob berilmagan";
    const correctAnsText = `${letters[q.correct]}) ${q.options[q.correct]}`;

    let codeHtml = '';
    if (q.code) {
      codeHtml = `<div class="code-snippet-box" style="margin: 8px 0;"><pre><code>${escapeHtml(q.code)}</code></pre></div>`;
    }

    div.innerHTML = `
      <div class="review-header">
        <span class="review-q-num">Savol #${idx + 1}</span>
        ${statusPill}
      </div>
      <div class="review-q-title">${escapeHtml(q.question)}</div>
      ${codeHtml}
      <div class="review-answers-box">
        <div class="review-ans-row">
          <strong>Sizning javobingiz:</strong> 
          <span class="${isCorrect ? 'ans-correct-text' : 'ans-user-wrong'}">${escapeHtml(userAnsText)}</span>
        </div>
        <div class="review-ans-row">
          <strong>To'g'ri javob:</strong> 
          <span class="ans-correct-text">${escapeHtml(correctAnsText)}</span>
        </div>
      </div>
      <div class="review-exp">
        <strong>Izoh:</strong> ${escapeHtml(q.explanation)}
      </div>
    `;

    DOM.reviewQuestionsList.appendChild(div);
  });
}

// =========================================================
// 11. NATIJALAR TARIXI (HISTORY & LOCALSTORAGE)
// =========================================================
const HISTORY_STORAGE_KEY = 'html_quiz_history_records';

function saveToHistory(record) {
  try {
    const records = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    records.unshift(record);
    // Maksimal 25 ta natijani saqlaymiz
    if (records.length > 25) records.pop();
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Tarixni saqlashda xatolik:", e);
  }
}

DOM.btnHistoryOpen.addEventListener('click', () => {
  sounds.playClick();
  renderHistoryTable();
  DOM.modalHistory.classList.add('active');
});

DOM.btnCloseHistory.addEventListener('click', () => {
  sounds.playClick();
  DOM.modalHistory.classList.remove('active');
});

DOM.btnCloseHistoryBottom.addEventListener('click', () => {
  sounds.playClick();
  DOM.modalHistory.classList.remove('active');
});

DOM.btnClearHistory.addEventListener('click', () => {
  sounds.playClick();
  if (confirm("Rostdan ham barcha natijalar tarixini tozalamoqchimisiz?")) {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    renderHistoryTable();
  }
});

function renderHistoryTable() {
  let records = [];
  try {
    records = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
  } catch (e) {
    records = [];
  }

  if (records.length === 0) {
    DOM.historyRecordsContainer.innerHTML = `
      <div class="empty-state">
        <p>Hozircha hech qanday test topshirilmagan.</p>
        <small>Testni tugatganingizdan so'ng natijangiz shu yerda saqlanadi.</small>
      </div>
    `;
    return;
  }

  let tableHtml = `
    <table class="history-table">
      <thead>
        <tr>
          <th>Ism</th>
          <th>Natija</th>
          <th>Foiz</th>
          <th>Rejim</th>
          <th>Vaqt</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
  `;

  records.forEach(r => {
    tableHtml += `
      <tr>
        <td><strong>${escapeHtml(r.name)}</strong></td>
        <td>${r.correct} / ${r.total}</td>
        <td><span style="color: ${r.percent >= 70 ? 'var(--accent-green)' : 'var(--accent-red)'}; font-weight:700;">${r.percent}%</span></td>
        <td><small>${r.mode}</small></td>
        <td><small>${r.timeSpent}</small></td>
        <td><small style="color: var(--text-subtle);">${r.date}</small></td>
      </tr>
    `;
  });

  tableHtml += `</tbody></table>`;
  DOM.historyRecordsContainer.innerHTML = tableHtml;
}

// =========================================================
// 12. YORDAMCHI FUNKSIYALAR
// =========================================================
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Modal oynalar tashqarisiga bosilganda yopish
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Klaviatura orqali boshqarish (1, 2, 3, 4 yoki A, B, C, D)
window.addEventListener('keydown', (e) => {
  if (!DOM.viewQuiz.classList.contains('active')) return;

  const key = e.key.toUpperCase();
  const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

  if (key in keyMap) {
    selectOption(state.currentQuestionIndex, keyMap[key]);
  } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
    if (state.currentQuestionIndex < HTML_QUESTIONS.length - 1) {
      loadQuestion(state.currentQuestionIndex + 1);
    }
  } else if (e.key === 'ArrowLeft') {
    if (state.currentQuestionIndex > 0) {
      loadQuestion(state.currentQuestionIndex - 1);
    }
  }
});

// =========================================================
// DASTUR YUKLANGANDA ISHGA TUSHIRISH
// =========================================================
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSound();
});
