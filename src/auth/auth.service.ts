import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { AuthCredentialDTO } from './authCredential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import SmsInterface from './sms.interface';
import CodeGenerator from './code-generator';
import CacheInterface from './cache.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepo: UserRepository,
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
  async isCodeMatch(authCredential: AuthCredentialDTO) {
    const savedCode = await this.cacheProvider.get(authCredential.phone);
    if (savedCode === authCredential.activation_code) {
      //Todo : find any activation code for this phone number
      return true;
    }
    return false;
  }
  async retrieveToken(
    authCredential: AuthCredentialDTO,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOneOrFail({
      phone: authCredential.phone,
    });
    const isMatch = await this.isCodeMatch(authCredential);
    if (!isMatch) {
      throw new NotFoundException('Code is not Valid');
    }
    const payload: JwtPayload = authCredential;
    const accessToken = await this.jwtService.sign(payload);
    //Todo : remove activation code after retrieve from cache
    return { accessToken };
  }
}
