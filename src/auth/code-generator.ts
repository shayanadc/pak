export default class CodeGenerator {
  generate(): string {
    return this.getRandomArbitrary(10000, 99999).toString;
  }
  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
}
