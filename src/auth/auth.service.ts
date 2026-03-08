import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { JwtPayload } from './types/jwt-payload.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email)

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误')
    }

    const passwordMatched = await bcrypt.compare(dto.password, user.passwordHash)

    if (!passwordMatched) {
      throw new UnauthorizedException('邮箱或密码错误')
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    const access_token = await this.jwtService.signAsync(payload)

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }
}