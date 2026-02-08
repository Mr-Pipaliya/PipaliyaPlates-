// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy user data (for testing only!)
const users = [
  { email: 'hardik@gmail.com', password: 'Hardik@2005' }
];

// Login API
app.post('/api/login', (req, res) => {debugger
  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ success: true, message: 'Login successful!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
