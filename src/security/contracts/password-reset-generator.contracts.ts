import { PasswordResetRequest } from '../../domain/entity/password-reset-request.entity';
import { JwtDto } from '../data/jwt.dto';

export interface PasswordResetGenerator {
  generateJwt(passwordResetRequest: PasswordResetRequest): Promise<JwtDto>
}

export const PasswordResetGenerator = Symbol('PasswordResetGenerator');