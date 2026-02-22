import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import * as jwksRsa from 'jwks-rsa'

// [TODO] change to env variables
@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          'https://auth.daynlight.pl/realms/Big-data-server-users/protocol/openid-connect/certs'
      }),
      audience: 'account',
      issuer: 'https://auth.daynlight.pl/realms/Big-data-server-users',
      algorithms: ['RS256']
    })
  }

  async validate(payload: any) {
    return payload
  }
}