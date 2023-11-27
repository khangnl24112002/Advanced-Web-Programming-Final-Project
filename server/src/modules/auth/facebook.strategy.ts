import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.APP_FB_ID,
      clientSecret: process.env.APP_FB_SECRET,
      callbackURL: 'http://localhost:3333/auth/facebook-redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    const provider = 'facebook';
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
    const token = await this.authService.generateAccessToken({
      id: existUser.id,
      email: existUser.email,
    })
    done(null, {
        ...user,
        id: existUser.id,
        accessToken: token,
    });
  }
}
