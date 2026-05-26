// ---- SOUND EFFECTS ----
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playClick() {
  try {
    if (!audioCtx) audioCtx = new AudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.08);
  } catch(e) {}
}

function playSuccess() {
  try {
    if (!audioCtx) audioCtx = new AudioCtx();
    [523, 659, 784].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.15);
      osc.start(audioCtx.currentTime + i * 0.08);
      osc.stop(audioCtx.currentTime + i * 0.08 + 0.15);
    });
  } catch(e) {}
}

function playError() {
  try {
    if (!audioCtx) audioCtx = new AudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.15);
  } catch(e) {}
}

// ---- THEME TOGGLE ----
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  playClick();
}

// Load saved theme
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.querySelector('.theme-icon').textContent = saved === 'dark' ? '☀️' : '🌙';
})();

// ---- TAB SWITCHING ----
function switchTab(tabId, btn) {
  playClick();
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  btn.classList.add('active');
  clearResult();
}

function switchSubTab(subId, btn) {
  playClick();
  document.querySelectorAll('.sub-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('subtab-' + subId).classList.add('active');
  btn.classList.add('active');
}

// ---- RESULT DISPLAY ----
function showResult(result, formula, steps, isError = false) {
  if (isError) playError(); else playSuccess();

  const placeholder = document.getElementById('result-placeholder');
  const display = document.getElementById('result-display');
  const badge = display.querySelector('.result-badge');
  const mainResult = document.getElementById('main-result');
  const formulaText = document.getElementById('formula-text');
  const stepsList = document.getElementById('steps-list');

  placeholder.classList.add('hidden');
  display.classList.remove('hidden');

  if (isError) {
    badge.classList.add('error');
    mainResult.textContent = '⚠️ Error';
    formulaText.textContent = result;
    stepsList.innerHTML = '';
  } else {
    badge.classList.remove('error');
    mainResult.textContent = result;
    formulaText.textContent = formula;
    stepsList.innerHTML = steps.map(s => `<li>${escHtml(s)}</li>`).join('');

    badge.style.animation = 'none';
    badge.offsetHeight;
    badge.style.animation = 'fadeSlideIn 0.4s ease';
  }

  if (window.innerWidth <= 900) {
    document.querySelector('.result-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function clearResult() {
  document.getElementById('result-placeholder').classList.remove('hidden');
  document.getElementById('result-display').classList.add('hidden');
}

function escHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

document.querySelectorAll('.single-input').forEach(btn => {
  btn.addEventListener('click', () => {});
});

function needsOneInput(op) {
  return ['sqrt', 'not'].includes(op);
}

// ---- ARITHMETIC CALCULATIONS ----
async function calcArithmetic(op) {
  playClick();
  const a = document.getElementById('arith-a').value;
  const b = document.getElementById('arith-b').value;

  if (a === '' || a === null) { showToast('⚠️ Masukkan Angka A!'); return; }
  if (!needsOneInput(op) && (b === '' || b === null)) { showToast('⚠️ Masukkan Angka B!'); return; }

  const payload = { operation: op, a, b: needsOneInput(op) ? null : b };

  try {
    const res = await fetch('/api/arithmetic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.error) {
      showResult(data.error, '', [], true);
    } else {
      showResult(data.result, data.formula, data.steps);
      loadHistory();
    }
  } catch (e) {
    showResult('Koneksi gagal. Coba lagi.', '', [], true);
  }
}

// ---- LOGIC CALCULATIONS ----
async function calcLogic(op) {
  playClick();
  const a = document.getElementById('logic-a').value;
  const b = document.getElementById('logic-b').value;

  if (a === '') { showToast('⚠️ Masukkan Nilai A!'); return; }
  if (!['not'].includes(op) && b === '') { showToast('⚠️ Masukkan Nilai B!'); return; }

  try {
    const res = await fetch('/api/logic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: op, a, b })
    });
    const data = await res.json();

    if (data.error) {
      showResult(data.error, '', [], true);
    } else {
      showResult(data.result, data.formula, data.steps);
      loadHistory();
    }
  } catch (e) {
    showResult('Koneksi gagal.', '', [], true);
  }
}

// ---- BASE CONVERSION ----
async function calcBase() {
  playClick();
  const value = document.getElementById('base-value').value.trim();
  const fromBase = document.getElementById('base-from').value;

  if (!value) { showToast('⚠️ Masukkan nilai!'); return; }

  try {
    const res = await fetch('/api/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'base', value, from_base: fromBase })
    });
    const data = await res.json();

    if (data.error) {
      showResult(data.error, '', [], true);
      document.getElementById('base-results').classList.add('hidden');
    } else {
      document.getElementById('res-decimal').textContent = data.results.decimal;
      document.getElementById('res-binary').textContent = data.results.binary;
      document.getElementById('res-octal').textContent = data.results.octal;
      document.getElementById('res-hex').textContent = data.results.hex;
      document.getElementById('base-results').classList.remove('hidden');
      showResult(data.results.decimal, data.formula, data.steps);
      loadHistory();
    }
  } catch (e) {
    showResult('Koneksi gagal.', '', [], true);
  }
}

// ---- TEMPERATURE CONVERSION ----
async function calcTemperature() {
  playClick();
  const value = document.getElementById('temp-value').value;
  const fromUnit = document.getElementById('temp-from').value;

  if (value === '') { showToast('⚠️ Masukkan suhu!'); return; }

  try {
    const res = await fetch('/api/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'temperature', value, from_unit: fromUnit })
    });
    const data = await res.json();

    if (data.error) {
      showResult(data.error, '', [], true);
    } else {
      document.getElementById('res-celsius').textContent = data.results.celsius + '°C';
      document.getElementById('res-fahrenheit').textContent = data.results.fahrenheit + '°F';
      document.getElementById('res-kelvin').textContent = data.results.kelvin + 'K';
      document.getElementById('res-reamur').textContent = data.results.reamur + '°R';
      document.getElementById('temp-results').classList.remove('hidden');
      showResult(data.results.celsius + '°C', data.formula, data.steps);
      loadHistory();
    }
  } catch (e) {
    showResult('Koneksi gagal.', '', [], true);
  }
}

// ---- CURRENCY CONVERSION ----
const CURR_SYMBOLS = { IDR: 'Rp', USD: '$', EUR: '€', SGD: 'S$', JPY: '¥', GBP: '£', AUD: 'A$', MYR: 'RM' };

async function calcCurrency() {
  playClick();
  const amount = document.getElementById('curr-amount').value;
  const fromCurr = document.getElementById('curr-from').value;

  if (!amount) { showToast('⚠️ Masukkan jumlah!'); return; }

  try {
    const res = await fetch('/api/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'currency', amount, from_currency: fromCurr })
    });
    const data = await res.json();

    if (data.error) {
      showResult(data.error, '', [], true);
    } else {
      const grid = document.getElementById('curr-result-grid');
      grid.innerHTML = '';
      for (const [curr, val] of Object.entries(data.results)) {
        const sym = CURR_SYMBOLS[curr] || curr;
        const formatted = curr === 'IDR'
          ? Math.round(val).toLocaleString('id-ID')
          : parseFloat(val).toFixed(4);
        grid.innerHTML += `
          <div class="result-card-item">
            <span class="rc-label">${curr}</span>
            <span class="rc-value">${sym} ${formatted}</span>
          </div>`;
      }
      document.getElementById('curr-results').classList.remove('hidden');
      const idr = Math.round(data.from_idr).toLocaleString('id-ID');
      showResult('Rp ' + idr, data.formula, data.steps);
      loadHistory();
    }
  } catch (e) {
    showResult('Koneksi gagal.', '', [], true);
  }
}

// ---- FACTORIAL ----
async function calcFactorial() {
  playClick();
  const n = document.getElementById('factorial-n').value;
  if (n === '') { showToast('⚠️ Masukkan nilai n!'); return; }

  try {
    const res = await fetch('/api/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'factorial', value: n })
    });
    const data = await res.json();

    if (data.error) {
      showResult(data.error, '', [], true);
    } else {
      showResult(data.result, data.formula, data.steps);
      loadHistory();
    }
  } catch (e) {
    showResult('Koneksi gagal.', '', [], true);
  }
}

// ---- FIBONACCI ----
async function calcFibonacci() {
  playClick();
  const n = document.getElementById('fibonacci-n').value;
  if (n === '') { showToast('⚠️ Masukkan nilai n!'); return; }

  try {
    const res = await fetch('/api/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'fibonacci', value: n })
    });
    const data = await res.json();

    if (data.error) {
      showResult(data.error, '', [], true);
    } else {
      showResult('F(' + n + ') = ' + data.result, data.formula, data.steps);

      const fibDiv = document.getElementById('fib-sequence');
      const seq = data.sequence;
      const seqStr = seq.join(', ') + (seq.length < parseInt(n) + 1 ? ', ...' : '');
      fibDiv.innerHTML = `<span class="fib-label">🌀 Deret Fibonacci (${seq.length} suku pertama)</span>${seqStr}`;
      fibDiv.classList.remove('hidden');
      loadHistory();
    }
  } catch (e) {
    showResult('Koneksi gagal.', '', [], true);
  }
}

// ---- HISTORY ----
async function loadHistory() {
  try {
    const res = await fetch('/api/history');
    const data = await res.json();
    renderHistory(data.history);
  } catch (e) {}
}

function renderHistory(history) {
  const list = document.getElementById('history-list');
  if (!history || history.length === 0) {
    list.innerHTML = '<p class="history-empty">Belum ada riwayat perhitungan</p>';
    return;
  }
  list.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="hi-category">${escHtml(item.category)}</div>
      <div class="hi-formula">${escHtml(item.formula)}</div>
      <div class="hi-result">= ${escHtml(item.result)}</div>
    </div>
  `).join('');
}

async function clearHistory() {
  playClick();
  try {
    await fetch('/api/history/clear', { method: 'POST' });
    renderHistory([]);
    showToast('🗑️ Riwayat dihapus');
  } catch (e) {}
}

function toggleHistory() {
  playClick();
  const sidebar = document.getElementById('history-sidebar');
  const overlay = document.getElementById('history-overlay');
  const isOpen = sidebar.classList.contains('open');

  sidebar.classList.toggle('open', !isOpen);
  overlay.classList.toggle('hidden', isOpen);

  if (!isOpen) loadHistory();
}

// ---- TOAST ----
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ---- KEYBOARD ENTER SUPPORT ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    const tabId = activeTab.id;
    if (tabId === 'tab-arithmetic') {
      // user must pick operation button
    }
  }
});

// Load history on page start
loadHistory();