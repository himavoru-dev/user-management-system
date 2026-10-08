import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create User
  async create(userData: Partial<User>): Promise<Partial<User>> {
    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const createdUser = await this.userRepository.save(user);

    const { password, ...safeUser } = createdUser;

    return safeUser;
  }

  // Get All Users
  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();

    return users.map(({ password, ...user }) => user);
  }

  // Find User by Email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // Get User by ID
  async findById(id: number): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  // Update User
  async update(
    id: number,
    userData: Partial<User>,
  ): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return null;
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    Object.assign(user, userData);

    const updatedUser = await this.userRepository.save(user);

    const { password, ...safeUser } = updatedUser;

    return safeUser;
  }

  // Delete User
 async delete(id: number): Promise<boolean> {
  const result = await this.userRepository.delete(id);

  return result.affected === 1;
}
}