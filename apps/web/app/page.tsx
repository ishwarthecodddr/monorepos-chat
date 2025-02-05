'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
    }}>
      <input style={{
        padding: "5px", 
        margin: "5px",
      }} type="text" placeholder="Room Name" onChange={(e)=>{setRoomId(e.target.value)}} />
      <button onClick={()=>{router.push(`/room/${roomId}`)}}>Join Room</button>
    </div>
  );
}
