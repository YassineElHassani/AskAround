import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current user profile
   * GET /users/me
   */
  @Get('me')
  async getCurrentUser(@CurrentUser() user: any) {
    return this.usersService.getCurrentUser(user.id);
  }

  /**
   * Get all users (admin only)
   * GET /users?page=1&limit=10
   */
  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.usersService.getAllUsers(page, limit);
  }

  /**
   * Get user by ID (admin or self only)
   * GET /users/:id
   */
  @Get(':id')
  async getUserById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.usersService.getUserById(id, user.id, user.role);
  }

  /**
   * Update user profile (self only)
   * PATCH /users/:id
   */
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.usersService.updateUser(id, updateUserDto, user.id);
  }

  /**
   * Update user role (admin only)
   * PATCH /users/:id/role
   */
  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRole(id, updateUserRoleDto);
  }
}
