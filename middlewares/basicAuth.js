require('dotenv').config();

function basicAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    // No Authorization header sent
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const [type, credentials] = authHeader.split(' ');
  if (type !== 'Basic' || !credentials) {
    // Header is not in proper Basic format
    return res.status(401).json({ error: 'Invalid authorization format' });
  }

  const decoded = Buffer.from(credentials, 'base64').toString(); // "username:password"
  const [username, password] = decoded.split(':');

  // Define valid credentials (change as needed)
  const validUser = process.env.BASIC_AUTH_USER;
  const validPass = process.env.BASIC_AUTH_PASS;

  if (username === validUser && password === validPass) {
    next(); // Allow access to the route
  } else {
    // Invalid username or password
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}

module.exports = basicAuth;
