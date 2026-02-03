import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get current user (from JWT payload)
   */
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        auth0Id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Get user by ID (admin or self only)
   */
  async getUserById(id: string, requestingUserId: string, requestingUserRole: UserRole) {
    // Allow if admin or requesting own data
    if (requestingUserRole !== UserRole.ADMIN && id !== requestingUserId) {
      throw new ForbiddenException('You can only view your own profile');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        auth0Id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            soldAssets: true,
            orders: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user profile (self only)
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto, requestingUserId: string) {
    // Only allow users to update their own profile
    if (id !== requestingUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        auth0Id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role: updateUserRoleDto.role },
      select: {
        id: true,
        auth0Id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          auth0Id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              soldAssets: true,
              orders: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
