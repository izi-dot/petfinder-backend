import type { RowDataPacket } from "mysql2/index.js";
import type { User } from "./user.domain.js";

export class Post {
  id: string;
  createdBy: string;
  userAvatar: string;
  createdAt: string;
  petName: string;
  location: string;
  photos: string;
  description: string;
  interactionsCount: number;
  solved: boolean;
  comments?: Comment[];
  animalType?: string;
  breed?: string;

  constructor(data: RowDataPacket, comments?: Comment[]) {
    this.id = data.id;
    this.createdBy = data.created_by;
    this.userAvatar = data.user_avatar;
    const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const createdAtTime = new Date(data.created_at).getTime();
    this.createdAt = new Date(createdAtTime - timeZoneOffset).toISOString();
    this.petName = data.pet_name;
    this.location = data.location;
    this.photos = data.photos.toString();
    this.description = data.description;
    this.interactionsCount = data.interactions_count;
    this.solved = data.solved === 1;
    this.animalType = data.animal_type;
    this.breed = data.breed;

    if (comments) {
      this.comments = comments;
    }
  }
}

export interface NewPostRequest {
  petName: string;
  location: string;
  photos: string;
  description: string;
  animalType: string;
  breed: string; 
}

export interface AddCommentRequest {
  postId: string;
  comment: string;
}

export class Comment {
  id: string;
  comment: string;
  user?: User;

  constructor(data: RowDataPacket, users: User[]) {
    this.id = data.id;
    this.comment = data.comment;

    if (users[0]) {
      this.user = users[0];
    }
  }
}