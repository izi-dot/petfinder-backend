import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
import { config } from './config.js';
import { Post, type NewPostRequest } from './domains/post.domain.js';
import { v4 as uuidv4 } from 'uuid';


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

  async getAllPosts(): Promise<Post[]> {
    const query = 'SELECT * FROM post ORDER BY created_at DESC';
    const [results] = await this.db.query<RowDataPacket[]>(query);
    return results.map((row) => {
      return new Post(row);
    });
  }


  async createPost(request: NewPostRequest): Promise<void> {
    const query = `INSERT INTO post 
      (id, created_by, user_avatar, pet_name, location, photos, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      uuidv4(),
      request.createdBy,
      request.userAvatar,
      request.petName,
      request.location,
      request.photos,
      request.description
    ];

    await this.db.execute(query, values);
    return;
  }
}