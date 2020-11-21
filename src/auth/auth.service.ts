import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { AuthCredentialDTO } from './authCredential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import SmsInterface from './sms.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepo: UserRepository,
    private jwtService: JwtService,
    @Inject('SmsInterface')
    private smsProvider: SmsInterface,
  ) {}
  async findOrCreateUserWithPhone(loginDTO: LoginDto): Promise<UserEntity> {
    const code = this.generateCode();
    this.smsProvider.sendMessage(loginDTO.phone, code);
    // this.setInMemory(loginDTO.phone, code);
    return await this.userRepo.findOrCreate(loginDTO);
  }
  isCodeMatch(authCredential: AuthCredentialDTO) {
    //Todo : find any activation code for this phone number
    return true;
  }
  async retrieveToken(
    authCredential: AuthCredentialDTO,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOne({ phone: authCredential.phone });
    if (!user || !this.isCodeMatch(authCredential)) {
      throw new NotFoundException('User Not Found');
    }
    const payload: JwtPayload = authCredential;
    const accessToken = await this.jwtService.sign(payload);
    //Todo : delete activation code after retrieve
    return { accessToken };
  }
  generateCode(): string {
    //Todo: generate 5 digit
    return '';
  }
  setInMemory(phone: string, code: number) {
    //Todo: set in cache
    return '';
  }
}
