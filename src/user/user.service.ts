import { Injectable } from '@nestjs/common';

import { RegisterUserDto } from './dto/register-user.dto';
import * as firebaseAdmin from 'firebase-admin';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  async registerUser(registerUser: RegisterUserDto) {
    console.log(registerUser);
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: registerUser.firstName,
        email: registerUser.email,
        password: registerUser.password,
      });
      console.log('User Record:', userRecord);
      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User registration failed'); // Handle errors gracefully
    }
  }
  async loginUser(payload: LoginDto) {
    const { email, password } = payload;
    try {
      const { idToken, refreshToken, expiresIn } = await this.signInWithEmailAndPassword(email, password) as { idToken: string, refreshToken: string, expiresIn: string };
      return { idToken, refreshToken, expiresIn };
    } catch (error: any) {
      if (error.message.includes('EMAIL_NOT_FOUND')) {
        throw new Error('User not found.');
      } else if (error.message.includes('INVALID_PASSWORD')) {
        throw new Error('Invalid password.');
      } else {
        throw new Error(error.message);
      }
    }
  }
  private async signInWithEmailAndPassword(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    });
  }
  private async sendPostRequest(url: string, data: any) {
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.log('error', error);
    }
  }
}
