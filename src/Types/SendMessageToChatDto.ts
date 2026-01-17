import { MessageRecipientDto } from "./MessageRecipientDto";

export interface SendMessageToChatDto {
  senderId: string;
  conversationId: string;
  messageRecipients: MessageRecipientDto[];
}
