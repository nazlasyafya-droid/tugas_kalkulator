/**
 * Forest Dew Calculator — JavaScript
 * Features: Arithmetic, Logic/Bitwise, Conversion (Base, Temperature, Currency), Factorial
 */

/* ============================================================
   THEME TOGGLE
   ============================================================ */
const themeToggleBtn = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('fd-theme', theme);
}

themeToggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem('fd-theme') || 'light';
setTheme(savedTheme);


/* ============================================================
   TAB NAVIGATION
   ============================================================ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});


/* ============================================================
   ARITHMETIC CALCULATOR
   ============================================================ */
const arithExpr   = document.getElementById('arith-expr');
const arithResult = document.getElementById('arith-result');
const historyList = document.getElementById('history-list');
const historyPanel = document.getElementById('arith-history');

let arithState = {
  current: '0',
  operator: null,
  previous: null,
  resetOnNext: false,
  expression: '',
  powMode: false,
};

function updateDisplay() {
  const expr = arithState.expression || arithState.current;
  arithExpr.textContent = expr;
  arithExpr.classList.toggle('small', expr.length > 12);
}

function addToHistory(expr, result) {
  const li = document.createElement('li');
  li.textContent = `${expr} = ${result}`;
  historyList.prepend(li);
  if (historyList.children.length > 20) historyList.lastChild.remove();
}

document.querySelectorAll('.arith-grid .calc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const val    = btn.dataset.val;

    switch (action) {
      case 'num':
        if (arithState.resetOnNext) {
          arithState.current = val;
          arithState.resetOnNext = false;
        } else {
          arithState.current = arithState.current === '0' ? val : arithState.current + val;
        }
        arithState.expression = arithState.previous !== null
          ? `${arithState.previous} ${arithState.operator} ${arithState.current}`
          : arithState.current;
        updateDisplay();
        break;

      case 'dot':
        if (arithState.resetOnNext) { arithState.current = '0.'; arithState.resetOnNext = false; }
        else if (!arithState.current.includes('.')) arithState.current += '.';
        arithState.expression = arithState.current;
        updateDisplay();
        break;

      case 'op':
        if (arithState.operator && !arithState.resetOnNext) {
          const r = compute(parseFloat(arithState.previous), parseFloat(arithState.current), arithState.operator);
          arithState.current = String(r);
        }
        arithState.operator = val;
        arithState.previous = arithState.current;
        arithState.expression = `${arithState.current} ${val}`;
        arithState.resetOnNext = true;
        updateDisplay();
        break;

      case 'equals':
        if (arithState.operator && arithState.previous !== null) {
          const a = parseFloat(arithState.previous);
          const b = parseFloat(arithState.current);
          const r = compute(a, b, arithState.operator);
          const exprStr = `${a} ${arithState.operator} ${b}`;
          addToHistory(exprStr, r);
          arithResult.textContent = `= ${r}`;
          arithState.expression = String(r);
          arithState.current = String(r);
          arithState.operator = null;
          arithState.previous = null;
          arithState.resetOnNext = true;
          updateDisplay();
        }
        break;

      case 'clear':
        arithState = { current: '0', operator: null, previous: null, resetOnNext: false, expression: '', powMode: false };
        arithResult.textContent = '';
        updateDisplay();
        break;

      case 'backspace':
        if (!arithState.resetOnNext) {
          arithState.current = arithState.current.length > 1 ? arithState.current.slice(0, -1) : '0';
          arithState.expression = arithState.current;
          updateDisplay();
        }
        break;

      case 'sign':
        arithState.current = String(-parseFloat(arithState.current));
        arithState.expression = arithState.current;
        updateDisplay();
        break;

      case 'percent':
        arithState.current = String(parseFloat(arithState.current) / 100);
        arithState.expression = arithState.current;
        updateDisplay();
        break;

      case 'sqrt':
        const v = parseFloat(arithState.current);
        const sqr = v < 0 ? 'Error' : String(Math.sqrt(v));
        arithResult.textContent = `√(${v}) = ${sqr}`;
        addToHistory(`√(${v})`, sqr);
        arithState.current = sqr;
        arithState.expression = `√(${v}) = ${sqr}`;
        arithState.resetOnNext = true;
        updateDisplay();
        break;

      case 'pow':
        arithState.operator = '**';
        arithState.previous = arithState.current;
        arithState.expression = `${arithState.current} ^`;
        arithState.resetOnNext = true;
        updateDisplay();
        break;

      case 'history':
        historyPanel.classList.toggle('visible');
        break;
    }
  });
});

function compute(a, b, op) {
  switch (op) {
    case '+':  return roundResult(a + b);
    case '-':  return roundResult(a - b);
    case '*':  return roundResult(a * b);
    case '/':  return b === 0 ? 'Error' : roundResult(a / b);
    case '**': return roundResult(Math.pow(a, b));
    default:   return b;
  }
}

function roundResult(n) {
  if (typeof n !== 'number') return n;
  return parseFloat(n.toPrecision(12));
}

// Keyboard support for arithmetic
document.addEventListener('keydown', e => {
  if (!document.getElementById('tab-arithmetic').classList.contains('active')) return;
  const keyMap = {
    '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
    '+':'+','-':'-','*':'*','/':'/', '.':'.'
  };
  if (keyMap[e.key]) {
    if ('0123456789'.includes(e.key)) document.querySelector(`[data-val="${e.key}"]`)?.click();
    else if (e.key === '.') document.querySelector('[data-action="dot"]')?.click();
    else document.querySelector(`[data-val="${e.key}"]`)?.click();
  }
  if (e.key === 'Enter') document.querySelector('[data-action="equals"]')?.click();
  if (e.key === 'Backspace') document.querySelector('[data-action="backspace"]')?.click();
  if (e.key === 'Escape') document.querySelector('[data-action="clear"]')?.click();
});


/* ============================================================
   LOGIC / BITWISE CALCULATOR
   ============================================================ */
const logicA   = document.getElementById('logic-a');
const logicB   = document.getElementById('logic-b');
const binA     = document.getElementById('bin-a');
const binB     = document.getElementById('bin-b');
const logicBox = document.getElementById('logic-result-box');

function toBin(n) {
  if (isNaN(n)) return '';
  return (n >>> 0).toString(2).padStart(8, '0');
}

logicA.addEventListener('input', () => {
  const v = parseInt(logicA.value);
  binA.textContent = isNaN(v) ? '' : `Bin: ${toBin(v)}`;
});

logicB.addEventListener('input', () => {
  const v = parseInt(logicB.value);
  binB.textContent = isNaN(v) ? '' : `Bin: ${toBin(v)}`;
});

document.querySelectorAll('.op-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    runLogicOp(btn.dataset.op);
  });
});

function runLogicOp(op) {
  const a = parseInt(logicA.value);
  const b = parseInt(logicB.value);
  if (isNaN(a)) { logicBox.innerHTML = '<p class="result-placeholder">Masukkan nilai A terlebih dahulu</p>'; return; }

  let result, label, formula;
  switch (op) {
    case 'AND':   result = a & b;  label = 'AND';       formula = `${a} & ${b}`; break;
    case 'OR':    result = a | b;  label = 'OR';        formula = `${a} | ${b}`; break;
    case 'XOR':   result = a ^ b;  label = 'XOR';       formula = `${a} ^ ${b}`; break;
    case 'NAND':  result = ~(a & b) >>> 0; label = 'NAND'; formula = `~(${a} & ${b})`; break;
    case 'NOR':   result = ~(a | b) >>> 0; label = 'NOR';  formula = `~(${a} | ${b})`; break;
    case 'XNOR':  result = ~(a ^ b) >>> 0; label = 'XNOR'; formula = `~(${a} ^ ${b})`; break;
    case 'NOT_A': result = (~a) >>> 0; label = 'NOT A'; formula = `~${a}`; break;
    case 'LSHIFT':result = (a << 1) >>> 0; label = 'Left Shift'; formula = `${a} << 1`; break;
    case 'RSHIFT':result = (a >> 1) >>> 0; label = 'Right Shift'; formula = `${a} >> 1`; break;
    default: return;
  }

  logicBox.innerHTML = `
    <div class="logic-result-row">
      <span class="logic-result-label">${label}: ${formula}</span>
      <span class="logic-result-value">${result}</span>
      <span class="logic-result-bits">Bin: ${toBin(result)}</span>
      <span class="logic-result-bits">Hex: 0x${result.toString(16).toUpperCase().padStart(4,'0')}</span>
    </div>
  `;
}


/* ============================================================
   CONVERSION — BASE
   ============================================================ */
const baseDec = document.getElementById('base-dec');
const baseBin = document.getElementById('base-bin');
const baseOct = document.getElementById('base-oct');
const baseHex = document.getElementById('base-hex');

function updateAllBases(decimal) {
  if (isNaN(decimal) || !Number.isInteger(decimal)) return;
  baseDec.value = decimal;
  baseBin.value = decimal.toString(2);
  baseOct.value = decimal.toString(8);
  baseHex.value = decimal.toString(16).toUpperCase();
}

baseDec.addEventListener('input', () => {
  const n = parseInt(baseDec.value, 10);
  if (!isNaN(n)) { baseBin.value = n.toString(2); baseOct.value = n.toString(8); baseHex.value = n.toString(16).toUpperCase(); }
});

baseBin.addEventListener('input', () => {
  const n = parseInt(baseBin.value, 2);
  if (!isNaN(n)) { baseDec.value = n; baseOct.value = n.toString(8); baseHex.value = n.toString(16).toUpperCase(); }
});

baseOct.addEventListener('input', () => {
  const n = parseInt(baseOct.value, 8);
  if (!isNaN(n)) { baseDec.value = n; baseBin.value = n.toString(2); baseHex.value = n.toString(16).toUpperCase(); }
});

baseHex.addEventListener('input', () => {
  const n = parseInt(baseHex.value, 16);
  if (!isNaN(n)) { baseDec.value = n; baseBin.value = n.toString(2); baseOct.value = n.toString(8); }
});

document.getElementById('base-reset-btn').addEventListener('click', () => {
  baseDec.value = baseBin.value = baseOct.value = baseHex.value = '';
});


/* ============================================================
   CONVERSION — TEMPERATURE
   ============================================================ */
document.getElementById('temp-calc-btn').addEventListener('click', convertTemp);

function convertTemp() {
  const val = parseFloat(document.getElementById('temp-val').value);
  const from = document.getElementById('temp-from').value;
  const results = document.getElementById('temp-results');

  if (isNaN(val)) { results.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">Masukkan nilai suhu</p>'; return; }

  let celsius;
  switch (from) {
    case 'C': celsius = val; break;
    case 'F': celsius = (val - 32) * 5/9; break;
    case 'K': celsius = val - 273.15; break;
    case 'R': celsius = (val - 491.67) * 5/9; break;
  }

  const temps = {
    'Celsius (°C)':    parseFloat(celsius.toFixed(4)),
    'Fahrenheit (°F)': parseFloat((celsius * 9/5 + 32).toFixed(4)),
    'Kelvin (K)':      parseFloat((celsius + 273.15).toFixed(4)),
    'Rankine (°R)':    parseFloat(((celsius + 273.15) * 9/5).toFixed(4)),
  };

  results.innerHTML = Object.entries(temps).map(([unit, v]) => `
    <div class="temp-result-card">
      <div class="unit">${unit}</div>
      <div class="val">${v}</div>
    </div>
  `).join('');
}


/* ============================================================
   CONVERSION — CURRENCY
   ============================================================ */
// Approximate exchange rates (base: USD)
const EXCHANGE_RATES = {
  USD: 1,
  IDR: 16350,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 156.4,
  SGD: 1.35,
  MYR: 4.72,
  AUD: 1.54,
  CNY: 7.25,
  SAR: 3.75,
};

document.getElementById('curr-calc-btn').addEventListener('click', convertCurrency);

function convertCurrency() {
  const amount = parseFloat(document.getElementById('curr-amount').value);
  const from   = document.getElementById('curr-from').value;
  const to     = document.getElementById('curr-to').value;
  const box    = document.getElementById('curr-result');

  if (isNaN(amount)) { box.textContent = '—'; return; }

  const inUSD   = amount / EXCHANGE_RATES[from];
  const result  = inUSD * EXCHANGE_RATES[to];
  const rounded = parseFloat(result.toFixed(to === 'JPY' || to === 'IDR' ? 2 : 4));
  box.textContent = `${rounded.toLocaleString('id-ID')} ${to}`;
}


/* ============================================================
   FACTORIAL / COMBINATORICS
   ============================================================ */
document.getElementById('btn-factorial').addEventListener('click', calcFactorial);
document.getElementById('btn-permutation').addEventListener('click', calcPermutation);
document.getElementById('btn-combination').addEventListener('click', calcCombination);

function bigFactorial(n) {
  if (n < 0) return null;
  if (n === 0 || n === 1) return BigInt(1);
  let result = BigInt(1);
  for (let i = 2; i <= n; i++) result *= BigInt(i);
  return result;
}

function getFactInputs() {
  return {
    n: parseInt(document.getElementById('fact-n').value),
    r: parseInt(document.getElementById('fact-r').value),
  };
}

function showFactResult(label, value, formula) {
  const box = document.getElementById('fact-result');
  box.innerHTML = `
    <span class="fact-result-label">${label}</span>
    <span class="fact-result-value">${value}</span>
    <span class="fact-formula">${formula}</span>
  `;
}

function calcFactorial() {
  const { n } = getFactInputs();
  if (isNaN(n) || n < 0) { showFactResult('Error', '—', 'Masukkan n ≥ 0'); return; }
  if (n > 170) { showFactResult('Terlalu Besar', '∞', `${n}! melebihi batas presisi`); return; }
  const result = bigFactorial(n);
  showFactResult(`${n}! =`, result.toString(), `Faktorial dari ${n}`);
}

function calcPermutation() {
  const { n, r } = getFactInputs();
  if (isNaN(n) || isNaN(r) || r > n || n < 0 || r < 0) {
    showFactResult('Error', '—', 'Pastikan 0 ≤ r ≤ n'); return;
  }
  const result = bigFactorial(n) / bigFactorial(n - r);
  showFactResult(`P(${n},${r}) =`, result.toString(), `${n}! / (${n}-${r})! = Permutasi`);
}

function calcCombination() {
  const { n, r } = getFactInputs();
  if (isNaN(n) || isNaN(r) || r > n || n < 0 || r < 0) {
    showFactResult('Error', '—', 'Pastikan 0 ≤ r ≤ n'); return;
  }
  const result = bigFactorial(n) / (bigFactorial(r) * bigFactorial(n - r));
  showFactResult(`C(${n},${r}) =`, result.toString(), `${n}! / (${r}! × (${n}-${r})!) = Kombinasi`);
}

// Build factorial table
function buildFactTable() {
  const table = document.getElementById('fact-table');
  let html = '<thead><tr><th>n</th><th>n!</th></tr></thead><tbody>';
  for (let i = 0; i <= 15; i++) {
    const f = bigFactorial(i).toString();
    html += `<tr><td>${i}</td><td>${f}</td></tr>`;
  }
  html += '</tbody>';
  table.innerHTML = html;
}

buildFactTable();


/* ============================================================
   CONVERSION SUB-TABS
   ============================================================ */
document.querySelectorAll('.conv-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.conv-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.conv-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('conv-' + tab.dataset.conv).classList.add('active');
  });
});
