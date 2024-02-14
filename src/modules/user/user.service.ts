import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: number): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: any): Promise<User> {
    return await this.prisma.user
      .create({
        data: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });
  }
}
