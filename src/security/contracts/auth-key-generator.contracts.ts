import { RefreshToken } from '../../domain/entity/refresh-token.entity';
import { JwtDto } from '../data/jwt.dto';

export interface AuthKeyGenerator{
  generateJwt(refreshToken: RefreshToken): Promise<JwtDto>
}

