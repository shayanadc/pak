import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { AuthCredentialDTO } from './authCredential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import SmsInterface from './sms.interface';
import CacheInterface from './cache.interface';
import CodeGenerator from './code-generator';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepo: UserRepository,
    private jwtService: JwtService,
    @Inject('SmsInterface')
    private smsProvider: SmsInterface,
    @Inject('CacheInterface')
    private cacheProvider: CacheInterface,
    private codeGen: CodeGenerator,
  ) {}
  async findOrCreateUserWithPhone(loginDTO: LoginDto): Promise<UserEntity> {
    const code = this.codeGen.generate();
    this.smsProvider.sendMessage(loginDTO.phone, code);
    this.cacheProvider.set(loginDTO.phone, code);
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
}
