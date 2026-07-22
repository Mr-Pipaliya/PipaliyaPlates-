// ╔══════════════════════════════════════════════════════════════╗
// ║          PipaliyaPlates — Live Terminal Logger               ║
// ║   Shows every Login / Register / Order in real-time         ║
// ╚══════════════════════════════════════════════════════════════╝

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ── ANSI Color Codes (no extra dependencies needed) ──
const C = {
  reset:   '\x1b[0m',
  bright:  '\x1b[1m',
  dim:     '\x1b[2m',
  // Text colors
  black:   '\x1b[30m',
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  white:   '\x1b[37m',
  // Bright text
  bred:    '\x1b[91m',
  bgreen:  '\x1b[92m',
  byellow: '\x1b[93m',
  bblue:   '\x1b[94m',
  bmagenta:'\x1b[95m',
  bcyan:   '\x1b[96m',
  bwhite:  '\x1b[97m',
  // Backgrounds
  bgBlack: '\x1b[40m',
  bgRed:   '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow:'\x1b[43m',
  bgBlue:  '\x1b[44m',
  bgMagenta:'\x1b[45m',
  bgCyan:  '\x1b[46m',
  bgWhite: '\x1b[47m',
};

// ── Helpers ──
function now() {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true
  });
}

function line(char = '─', len = 60) {
  return C.dim + char.repeat(len) + C.reset;
}

function boxTop(title, color = C.bcyan) {
  const pad   = 58;
  const label = ` ${title} `;
  const left  = Math.floor((pad - label.length) / 2);
  const right = pad - label.length - left;
  console.log('\n' + C.dim + '┌' + '─'.repeat(pad) + '┐' + C.reset);
  console.log(C.dim + '│' + C.reset + ' '.repeat(left) + color + C.bright + label + C.reset + ' '.repeat(right) + C.dim + '│' + C.reset);
  console.log(C.dim + '├' + '─'.repeat(pad) + '┤' + C.reset);
}

function boxRow(key, value, keyColor = C.bblue, valColor = C.bwhite) {
  const k   = `  ${key}`.padEnd(22);
  const val = String(value);
  console.log(C.dim + '│' + C.reset + keyColor + C.bright + k + C.reset + valColor + val + C.reset);
}

function boxBottom() {
  console.log(C.dim + '└' + '─'.repeat(58) + '┘' + C.reset);
}

// ── In-memory store for existing users (fallback login check) ──
const defaultUsers = [
  { name: 'Hardik Pipaliya', email: 'hardik@gmail.com', password: 'Hardik@2005' }
];

// ────────────────────────────────────────────────────────────────
// 1. LOGIN  →  POST /api/login
// ────────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { email, password, name } = req.body;

  const user = defaultUsers.find(u => u.email === email && u.password === password);

  if (user) {
    // ── Terminal Output ──
    boxTop('🔑  USER LOGGED IN', C.bgreen);
    boxRow('👤  Name',    user.name  || name || 'Unknown', C.bblue);
    boxRow('📧  Email',   email,   C.bblue);
    boxRow('🕐  Time',    now(),   C.byellow);
    boxRow('✅  Status',  'Login Successful', C.bgreen);
    boxBottom();

    res.json({ success: true, message: 'Login successful!', name: user.name });
  } else {
    // ── Failed login ──
    boxTop('❌  FAILED LOGIN ATTEMPT', C.bred);
    boxRow('📧  Email',   email || '(none)', C.bblue);
    boxRow('🕐  Time',    now(),   C.byellow);
    boxRow('⛔  Status',  'Invalid Credentials', C.bred);
    boxBottom();

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// ────────────────────────────────────────────────────────────────
// 2. REGISTER  →  POST /api/register
// ────────────────────────────────────────────────────────────────
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  // ── Terminal Output ──
  boxTop('🎉  NEW USER REGISTERED', C.bmagenta);
  boxRow('👤  Name',      name,   C.bblue);
  boxRow('📧  Email',     email,  C.bblue);
  boxRow('🔒  Password',  '*'.repeat(password.length) + `  (${password.length} chars)`, C.dim);
  boxRow('🕐  Time',      now(),  C.byellow);
  boxRow('✅  Status',    'Registration Successful', C.bgreen);
  boxBottom();

  res.json({ success: true, message: 'Registered successfully' });
});

// ────────────────────────────────────────────────────────────────
// 3. ORDER / PAYMENT  →  POST /api/order
// ────────────────────────────────────────────────────────────────
app.post('/api/order', (req, res) => {
  const { orderId, userEmail, userName, items, total, paymentMethod, status, address, city, pincode } = req.body;

  // Choose color based on payment status
  const statusColor = status === 'success' ? C.bgreen
                    : status === 'pending'  ? C.byellow
                    : C.bred;
  const statusIcon  = status === 'success' ? '✅ SUCCESS'
                    : status === 'pending'  ? '🕐 PENDING'
                    : '❌ FAILED';

  // ── Terminal Output ──
  boxTop('💳  NEW ORDER & PAYMENT', C.byellow);
  boxRow('🆔  Order ID',   orderId       || 'N/A',     C.bcyan);
  boxRow('👤  Customer',   userName      || 'Unknown', C.bblue);
  boxRow('📧  Email',      userEmail     || 'N/A',     C.bblue);
  boxRow('🍽️   Items',      items         || 'N/A',     C.bwhite);
  boxRow('💰  Total',      `₹${total}`   || '₹0',      C.byellow);
  boxRow('💳  Payment',    paymentMethod || 'N/A',     C.bwhite);
  boxRow('📍  Address',    `${address || ''}, ${city || ''} - ${pincode || ''}`, C.dim + C.white);
  boxRow('📊  Status',     statusIcon,                  statusColor);
  boxRow('🕐  Time',       now(),                       C.byellow);
  boxBottom();

  res.json({ success: true, message: 'Order logged' });
});

// ────────────────────────────────────────────────────────────────
// 4. GENERAL ACTIVITY LOG (optional catch-all for any event)  →  POST /api/log
// ────────────────────────────────────────────────────────────────
app.post('/api/log', (req, res) => {
  const { type, data } = req.body;
  console.log(C.dim + `[LOG] ${now()} — ${type}:` + C.reset, data);
  res.json({ success: true });
});

// ────────────────────────────────────────────────────────────────
// START SERVER
// ────────────────────────────────────────────────────────────────
const PORT = 5000;
app.listen(PORT, () => {
  console.clear();
  console.log('\n');
  console.log(C.bgMagenta + C.black + C.bright + '                                                              ' + C.reset);
  console.log(C.bgMagenta + C.black + C.bright + '        🍕  PipaliyaPlates — Live Activity Terminal           ' + C.reset);
  console.log(C.bgMagenta + C.black + C.bright + '                                                              ' + C.reset);
  console.log('\n' + C.bwhite + C.bright + '  Server is running on ' + C.bcyan + `http://localhost:${PORT}` + C.reset);
  console.log(C.dim + '  Waiting for activity from your website…' + C.reset);
  console.log('\n' + line('═', 60) + '\n');
  console.log(C.bgreen  + '  👥  User Registrations  ' + C.reset + C.dim + '→ POST /api/register' + C.reset);
  console.log(C.bblue   + '  🔑  User Logins         ' + C.reset + C.dim + '→ POST /api/login'    + C.reset);
  console.log(C.byellow + '  💳  Orders & Payments   ' + C.reset + C.dim + '→ POST /api/order'    + C.reset);
  console.log('\n' + line('═', 60) + '\n');
  console.log(C.dim + `  Started at: ${now()}` + C.reset + '\n');
});
