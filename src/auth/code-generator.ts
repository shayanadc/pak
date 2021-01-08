export default class CodeGenerator {
  generate(): string {
    const code = this.getRandomArbitrary(10001, 99998).toString();
    return code;
  }
  getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
