import type { RowDataPacket } from "mysql2/index.js";

export class Post {
  id: string;
  createdBy: string;
  userAvatar: string;
  createdAt: string;
  petName: string;
  location: string;
  photos: string;
  interactionsCount: number;
  solved: boolean;

  constructor(data: RowDataPacket) {
    this.id = data.id;
    this.createdBy = data.created_by;
    this.userAvatar = data.user_avatar;
    this.createdAt = new Date(data.created_at).toLocaleString();
    this.petName = data.pet_name;
    this.location = data.location;
    this.photos = data.photos;
    this.interactionsCount = data.interactions_count;
    this.solved = data.solved === 1;
  }
}

export interface NewPostRequest {
  createdBy: string;
  userAvatar: string;
  petName: string;
  location: string;
  photos: string;
}
