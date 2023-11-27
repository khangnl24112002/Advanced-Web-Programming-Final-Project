import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ROLES } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) { }
  async generateAccessToken(payload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.SECRET_KEY,
    });
  }
  async signUpByEmail(createUserDTO: any) {
    const { firstName, lastName, email, password, role } = createUserDTO;
    const roleId: number = ROLES[role?.toUpperCase() || 'USER'] as unknown as number
    const encryptedPassword = await hashPassword(password);
    let user = await this.prismaService.users.findFirst({
      where: {
        email,
      },
    });
    if (user.emailVerified) {
      throw new HttpException({
        status: false,
        message: "Tài khoản đã tồn tại"
      }, HttpStatus.BAD_REQUEST)
    }
    if (user && !user.emailVerified) {
      user = await this.prismaService.users.update({
        where: {
          id: user.id,
        },
        data: {
          firstName,
          lastName,
          encryptedPassword,
          roleId
        }
      })
    } else if (!user){
      user = await this.prismaService.users.create({
        data: {
          firstName,
          lastName,
          email,
          encryptedPassword,
          roleId
        },
      });
    }
    const accessToken = await this.generateAccessToken({
      email: email,
      id: user.id,
    });
    return {
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(data: LoginDto) {
    const { email, password } = data;
    const ex_user = await this.prismaService.users.findFirst({
      where: {
        email,
      },
    });
    if (!ex_user) {
      throw new HttpException({
        status: false,
        data: null,
        message: "Tài khoản không tồn tại"
      }, HttpStatus.BAD_REQUEST)
    }

    const { encryptedPassword } = ex_user;
    const isValidPassword = await comparePassword(password, encryptedPassword);
    if (!isValidPassword) {
      throw new HttpException({
        status: false,
        daa: null,
        message: 'Mật khẩu bạn đã nhập không chính xác.',
      }, HttpStatus.BAD_REQUEST)

    }
    const access_token = await this.generateAccessToken({
      email: email,
      id: ex_user.id,
    });
    return {
      status: true,
      data: {
        token: access_token,
        user: {
          id: ex_user.id,
          email: ex_user?.email,
          firstName: ex_user.firstName,
          lastName: ex_user.lastName,
        },
      },
      message: 'Đăng nhập thành công',
    };
  }

  async findUserByEmailAndProvider(email: string, provider: string) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
        provider,
      },
    });
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
      },
    });
    return user;
  }

  async findUserVerifyEmail(email: string) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
        emailVerified: true,
      },
    });
    return user;
  }
  async verifyUser(id: string) {
    const user = await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
      },
    });
    return user;
  }

  async updatePassword(id: string, password: string) {
    const encryptedPassword = await hashPassword(password);
    const user = await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        encryptedPassword,
      },
    });
    return user;
  }
}
