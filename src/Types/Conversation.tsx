import Pin from "./Pin";
import { ConversationParticipant } from "./ConversationParticipant";

export interface Conversation {
  id: number;
  name: string;
  description?: string;
  users: ConversationParticipant[];
  pins: Pin[];
}
