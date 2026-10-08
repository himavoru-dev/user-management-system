import { AdminGuard } from './admin.guard.js';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service.js';
import { User } from './user.entity.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  async create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<User>) {
    return this.usersService.update(Number(id), userData);
  }

@UseGuards(AuthGuard('jwt'), AdminGuard)
@Delete(':id')
async delete(@Param('id') id: string) {
  const deleted = await this.usersService.delete(Number(id));

  if (!deleted) {
    return {
      message: 'User not found',
    };
  }

  return {
    message: 'User deleted successfully',
  };
}
}