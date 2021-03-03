import * as env from 'dotenv';
env.config();

export default class CodeGenerator {
  generate(): string {
    if (process.env.SMSPANEL) {
      console.log(process.env.SMSPANEL);
      return '12345';
    }
    return this.getRandomArbitrary(10001, 99998).toString();
  }
  getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
