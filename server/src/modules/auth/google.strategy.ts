import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3333/auth/google-redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };
    const provider = 'google';
    let existUser: any = await this.authService.findUserByEmail(user.email);
    if (!existUser) {
      const password = Math.random().toString(36).slice(-8);
      // create new user
      existUser = await this.authService.signUpByEmail({
        ...user,
        provider,
        password,
      });
    }
    const access_token = await this.authService.generateAccessToken({ id: existUser.id, email: existUser.email });
    done(null, {
      ...user,
      id: existUser.id,
      accessToken: access_token
    });
  }
}
