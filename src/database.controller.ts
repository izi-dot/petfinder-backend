import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import { Post, type NewPostRequest } from './domains/post.domain.js';
import type { RegisterRequest } from './domains/user.domain.js';
import { User } from './domains/user.domain.js';


export class DatabaseController {

  db: Pool;

  constructor() {
    this.db = mysql.createPool({
      host: config.dbUrl,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName
    });
  }

  async getPosts(search?: string): Promise<Post[]> {
    if (search) {
      const query = `
        SELECT * FROM post
        WHERE pet_name LIKE ? 
          OR created_by LIKE ? 
          OR location LIKE ?
        ORDER BY created_at DESC
      `;
    
      const searchPattern = `%${search}%`;
      const [results] = await this.db.query<RowDataPacket[]>(query, [searchPattern, searchPattern, searchPattern]);
      return results.map((row) => {
        return new Post(row);
      })    
    }
    const query = 'SELECT * FROM post ORDER BY created_at DESC';
    const [results] = await this.db.query<RowDataPacket[]>(query);
    return results.map((row) => {
      return new Post(row);
    });
  }

  async createPost(request: NewPostRequest, user: User): Promise<void> {
    const query = `INSERT INTO post 
      (id, created_by, user_avatar, pet_name, location, photos, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      uuidv4(),
      `${user.firstName} ${user.lastName}`,
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png", //TODO ziskat od usera
      request.petName,
      request.location,
      request.photos,
      request.description
    ];

    await this.db.execute(query, values);
    return;
  }

  async userExists(email: string): Promise<boolean> {
    const query = 'SELECT id FROM users WHERE email = ?';
    const [results] = await this.db.query<RowDataPacket[]>(query, [email]);
    return results.length > 0;
  }
  
  async registerUser(request: RegisterRequest): Promise<string> {
    const hashedPassword = await bcrypt.hash(request.password, 10);
    const id = uuidv4();

    const query = 'INSERT INTO users (id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)';
    const values = [
      id,
      request.firstName, 
      request.lastName, 
      request.email, 
      hashedPassword
    ];
    
    await this.db.execute(query, values);
    return id;
  }  

  async findUserByEmail(email: string): Promise<User[]> {
    const query = 'SELECT id, first_name, last_name, email, password FROM users WHERE email = ?';
    const [users] = await this.db.query<RowDataPacket[]>(query, [email]);
    return users.map((row) => {
      return new User(row);
    });
  }
  
}