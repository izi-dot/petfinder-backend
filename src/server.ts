import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import type { Request, Response } from 'express';
import type { NewPostRequest } from './domains/post.domain.js';
import type { LoginRequest, RegisterRequest, User } from './domains/user.domain.js';
import { config } from './config.js';
import { DatabaseController } from './database.controller.js';

const app = express();
const dbController = new DatabaseController();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cors());


const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    next();
  });
};

function getAuthUser(req: any): User {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  return jwt.verify(token, config.jwtSecret) as User;
}

// Register endpoint
app.post('/api/register', async (req: Request<{}, {}, RegisterRequest>, res)=> {
  try {
    const registerRequest = req.body;

    // Validation
    if (!registerRequest.firstName || !registerRequest.lastName
      || !registerRequest.email || !registerRequest.password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Password validation
    if (registerRequest.password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExist = await dbController.userExists(registerRequest.email);
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const createdId = await dbController.registerUser(registerRequest);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: createdId,
        email: registerRequest.email,
        firstName: registerRequest.firstName,
        lastName: registerRequest.lastName
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { 
        id: createdId, 
        firstName: registerRequest.firstName, 
        lastName: registerRequest.lastName, 
        email: registerRequest.email 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});


// Login endpoint
app.post('/api/login', async (req: Request<{}, {}, LoginRequest>, res) => {
  try {
    const loginRequest = req.body;

    // Validation
    if (!loginRequest.email || !loginRequest.password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

   const users = await dbController.findUserByEmail(loginRequest.email);

    if (users.length === 0 || users[0] === undefined) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(loginRequest.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// Refresh token endpoint
app.post('/api/refresh-token', authenticateToken, (req, res) => {
  const user = getAuthUser(req);
  const newToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  res.json({ token: newToken });
});

app.get('/api/posts', async (req, res) => {
  try {
    const search  = req.query.search;
    const results = await dbController.getPosts(search);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

app.post('/api/post', authenticateToken, async (req: Request<{}, {}, NewPostRequest>, res) => {
  try {
    const user = getAuthUser(req);
    await dbController.createPost(req.body, user);
    res.status(201).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});



app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});