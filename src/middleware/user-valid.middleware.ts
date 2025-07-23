import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserExistsMiddleware implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    if (!userId) {
      throw new ForbiddenException('User ID is missing in the request.');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!userExists) {
      throw new ForbiddenException('User not found.');
    }

    return true;
  }
}
