// ╔══════════════════════════════════════════════════════════════╗
// ║          PipaliyaPlates — Live Terminal Logger               ║
// ║   Shows every Login / Register / Order in real-time         ║
// ╚══════════════════════════════════════════════════════════════╝

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ── Serve website HTML files statically ──
app.use(express.static(path.join(__dirname)));

// ── GET / → Redirect to index.html ──
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// ── GET /status → Nice server status page ──
app.get('/status', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Server Status | PipaliyaPlates</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #0b0f1a; color: #f1f5f9; display:flex; align-items:center; justify-content:center; min-height:100vh; }
        .card { background: #151d2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
        .emoji { font-size: 3rem; margin-bottom: 16px; }
        h1 { font-size: 1.6rem; margin-bottom: 8px; color: #ebb454; }
        p  { color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.6; }
        .status-dot { display:inline-block; width:10px; height:10px; border-radius:50%; background:#10b981; margin-right:8px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 50%{box-shadow:0 0 0 6px rgba(16,185,129,0)} }
        .routes { background: #0f1523; border-radius: 10px; padding: 18px; text-align: left; margin-top: 20px; }
        .route { display:flex; gap:12px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.82rem; }
        .route:last-child { border-bottom: none; }
        .method { background:#734060; color:#fff; padding:2px 8px; border-radius:4px; font-weight:700; font-size:0.72rem; }
        .path { color:#94a3b8; }
        a { color: #ebb454; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }
        .btn { display:inline-block; margin-top:20px; padding:12px 28px; background:linear-gradient(135deg,#734060,#9a5a7e); color:#fff; border-radius:50px; font-weight:700; font-size:0.9rem; text-decoration:none; }
        .btn:hover { opacity:0.9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="emoji">🍕</div>
        <h1>PipaliyaPlates Server</h1>
        <p><span class="status-dot"></span><strong style="color:#10b981">Online</strong> — Live Terminal Logger is running!<br>
        All user logins, registrations &amp; orders will appear in your terminal.</p>
        <div class="routes">
          <div class="route"><span class="method">POST</span><span class="path">/api/login</span></div>
          <div class="route"><span class="method">POST</span><span class="path">/api/register</span></div>
          <div class="route"><span class="method">POST</span><span class="path">/api/order</span></div>
        </div>
        <a href="/index.html" class="btn">🏠 Open Website</a>
      </div>
    </body>
    </html>
  `);
});


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
