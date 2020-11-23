export default interface SmsInterface {
  sendMessage(to: string, message: string): Promise<void>;
}
