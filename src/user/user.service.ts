import { Injectable } from '@nestjs/common';

import { RegisterUserDto } from './dto/register-user.dto';
import * as firebaseAdmin from 'firebase-admin';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
  import { validate as isUUID } from 'uuid';

@Injectable()
export class UserService {
 constructor(
  @InjectRepository(User)
  private userRepository: Repository<User>,
 ){}

  async registerUser(registerUser: RegisterUserDto) {
    console.log(registerUser);
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: registerUser.firstName,
        email: registerUser.email,
        password: registerUser.password,
      });
      console.log('User Record:', userRecord);

     const newUser =  this.userRepository.create({
      firebaseUid: userRecord.uid, // Save Firebase UID
      email: registerUser.email,
      firstName: registerUser.firstName,
      lastName: registerUser.lastName,
      phoneNumber: registerUser.phoneNumber,
     });

     await this.userRepository.save(newUser); 
     return newUser;// Save user to the database.
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User registration failed'); // Handle errors gracefully
    }
  }
  
  
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const trimmedId = id.trim(); // Trim spaces
    
    // Validate UUID format
    if (!isUUID(trimmedId)) {
      throw new BadRequestException('Invalid UUID format');
    }
  
    // Filter out undefined and null values
    const updateData = Object.fromEntries(
      Object.entries(updateUserDto).filter(([_, v]) => v !== undefined && v !== null)
    );
  
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }
  
    // Perform update and check if user exists
    const updateResult = await this.userRepository.update(trimmedId, updateData);
    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with ID ${trimmedId} not found`);
    }
  
    return this.userRepository.findOne({ where: { id: trimmedId } });
  }
  
  
  async getUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
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
