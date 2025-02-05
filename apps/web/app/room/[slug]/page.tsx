import axios from "axios"
import { BACKEND_URL } from "../../config"
import { Chatroom } from "../../../components/Chatroom"

async function getRoomId(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    return response.data.room.id;
}

export default async function ChatRoom({ params }: { params: { slug: string } }) {
  try {
    const roomid = await getRoomId((await params).slug);
    return <Chatroom id={(roomid)} />
  } catch (error) {
    console.error('Failed to load room:', error);
    return <div>Failed to load chat room</div>
  }
}