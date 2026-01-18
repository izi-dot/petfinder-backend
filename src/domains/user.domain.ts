import type { RowDataPacket } from "mysql2/index.js";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export class User {
  id: string;
  firstName: string;
  lastName: string;
  profilPic?: string;
  email: string;
  password: string;

  constructor(data: RowDataPacket) {
    this.id = data.id;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.profilPic = data.profile_pic;
    this.email = data.email;
    this.password = data.password;
  }
}