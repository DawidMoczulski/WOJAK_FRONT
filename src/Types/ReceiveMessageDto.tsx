export interface ReceiveMessageDto {
  id: number;
  senderId: string;
  timestamp: string;
  encryptedMessage: string;
}
