// PipaliyaPlates — Live Terminal Logger
// Shows Login / Register / Order in real-time in the terminal

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve website HTML files statically (so localhost:5000 opens the site)
app.use(express.static(path.join(__dirname)));

// GET / → open website
app.get('/', (req, res) => res.redirect('/index.html'));

// ── ANSI Colors ──
const R = '\x1b[0m',  B = '\x1b[1m',  D = '\x1b[2m';
const CG = '\x1b[92m', CY = '\x1b[93m', CB = '\x1b[94m';
const CM = '\x1b[95m', CC = '\x1b[96m', CW = '\x1b[97m';
const CR = '\x1b[91m', BGM = '\x1b[45m', BK = '\x1b[30m';

function now() {
  return new Date().toLocaleString('en-IN', {
    day:'2-digit', month:'short', year:'numeric',
    hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true
  });
}
function box(title, color) {
  const pad = 58, lbl = ` ${title} `;
  const l = Math.floor((pad - lbl.length) / 2), r = pad - lbl.length - l;
  console.log('\n' + D + '┌' + '─'.repeat(pad) + '┐' + R);
  console.log(D + '│' + R + ' '.repeat(l) + color + B + lbl + R + ' '.repeat(r) + D + '│' + R);
  console.log(D + '├' + '─'.repeat(pad) + '┤' + R);
}
function row(key, val, kc = CB, vc = CW) {
  console.log(D + '│' + R + kc + B + `  ${key}`.padEnd(22) + R + vc + String(val) + R);
}
function end() { console.log(D + '└' + '─'.repeat(58) + '┘' + R); }

// Default admin user
const DEFAULT_USER = { name: 'Hardik Pipaliya', email: 'hardik@gmail.com', password: 'Hardik@2005' };

// ── POST /api/login ──
app.post('/api/login', (req, res) => {
  const { email, password, name } = req.body;
  const match = DEFAULT_USER.email === email && DEFAULT_USER.password === password;

  if (match) {
    box('🔑  USER LOGGED IN', CG);
    row('👤  Name',   DEFAULT_USER.name || name || 'Unknown', CB);
    row('📧  Email',  email, CB);
    row('🕐  Time',   now(), CY);
    row('✅  Status', 'Login Successful', CG);
    end();
    res.json({ success: true, message: 'Login successful!', name: DEFAULT_USER.name });
  } else {
    box('❌  FAILED LOGIN ATTEMPT', CR);
    row('📧  Email',  email || '(none)', CB);
    row('🕐  Time',   now(), CY);
    row('⛔  Status', 'Invalid Credentials', CR);
    end();
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// ── POST /api/register ──
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Missing fields' });

  box('🎉  NEW USER REGISTERED', CM);
  row('👤  Name',     name, CB);
  row('📧  Email',    email, CB);
  row('🔒  Password', '*'.repeat(password.length) + `  (${password.length} chars)`, D);
  row('🕐  Time',     now(), CY);
  row('✅  Status',   'Registration Successful', CG);
  end();

  res.json({ success: true, message: 'Registered successfully' });
});

// ── POST /api/order ──
app.post('/api/order', (req, res) => {
  const { orderId, userEmail, userName, items, total, paymentMethod, status, address, city, pincode } = req.body;
  const sc = status === 'success' ? CG : status === 'pending' ? CY : CR;
  const si = status === 'success' ? '✅ SUCCESS' : status === 'pending' ? '🕐 PENDING' : '❌ FAILED';

  box('💳  NEW ORDER & PAYMENT', CY);
  row('🆔  Order ID',  orderId       || 'N/A',     CC);
  row('👤  Customer',  userName      || 'Unknown', CB);
  row('📧  Email',     userEmail     || 'N/A',     CB);
  row('🍽️   Items',     items         || 'N/A',     CW);
  row('💰  Total',     `₹${total}`   || '₹0',      CY);
  row('💳  Payment',   paymentMethod || 'N/A',     CW);
  row('📍  Address',   `${address||''}, ${city||''} - ${pincode||''}`, D + CW);
  row('📊  Status',    si,                          sc);
  row('🕐  Time',      now(),                       CY);
  end();

  res.json({ success: true, message: 'Order logged' });
});

// ── Start ──
const PORT = 5000;
app.listen(PORT, () => {
  console.clear();
  console.log('\n' + BGM + BK + B + '                                                              ' + R);
  console.log(BGM + BK + B       + '        🍕  PipaliyaPlates — Live Activity Terminal           ' + R);
  console.log(BGM + BK + B       + '                                                              ' + R);
  console.log('\n' + CW + B + '  Server → ' + CC + `http://localhost:${PORT}` + R);
  console.log(D + '  Waiting for activity…' + R);
  console.log('\n' + D + '═'.repeat(60) + R);
  console.log(CG  + '  👥 Registrations  ' + R + D + '→ /api/register' + R);
  console.log(CB  + '  🔑 Logins         ' + R + D + '→ /api/login'    + R);
  console.log(CY  + '  💳 Orders         ' + R + D + '→ /api/order'    + R);
  console.log(D + '═'.repeat(60) + R);
  console.log(D + `\n  Started: ${now()}\n` + R);
});
