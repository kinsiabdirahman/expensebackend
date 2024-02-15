// server.js

const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const secretKey = "your_secret_key"; // Replace with a secure secret key
const port = 3001;

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "exampleUser" && password === "password") {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

server.use((req, res, next) => {
  if (req.path === "/login") {
    return next();
  }

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
