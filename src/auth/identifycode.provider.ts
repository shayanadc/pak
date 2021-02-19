import IdentifyCodeInterface from './identifyCode.interface';

export class IdentifyCodeProvider implements IdentifyCodeInterface {
  generate(): String {
    return Math.random()
      .toString(36)
      .substr(2, 6);
  }
}
