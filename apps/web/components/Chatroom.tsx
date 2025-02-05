import axios from "axios";
import { BACKEND_URL } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";

interface Message {
  id: number;
  roomId: number;
  userId: string;
  message: string;
}

interface ChatroomProps {
  id: string;
}

async function getChats(roomId: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/room/messages/${roomId}`);
    const messages = response.data || [];
    return messages.map((msg: Message) => ({
      message: msg.message
    }));
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return [];
  }
}

export const Chatroom = async ({ id }: ChatroomProps) => {
  const chats = await getChats(id);
  return <ChatRoomClient messages={chats} id={id} />;
};