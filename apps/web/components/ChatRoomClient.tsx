'use client'
import React, { useEffect, useState } from 'react'
import { useSocket } from '../hooks/useSocket'

export const ChatRoomClient = ({ messages, id }: { messages: { message: string }[], id: string }) => {
    const [chats, setChats] = useState(messages);
    const { loading, socket } = useSocket()
    const [currmessage, setCurrmessage] = useState("");
    useEffect(() => {
        if (socket && !loading) {
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    setChats(c => [...c, parsedData.message])
                }
            }
        }
    }, [socket, loading, id])
    return (
        <div style={{
            display: "flex",
            flexDirection:"column",
            justifyContent: "center",
            alignItems: "center",
            height:"100vh"
        }}>
            {chats.map((m, index) => <div key={index}>{m.message}</div>)}
            <input type="text" value={currmessage} onChange={(e) => {
                setCurrmessage(e.target.value)
            }} placeholder='message' />
            <button onClick={() => {
                socket?.send(JSON.stringify({
                    type: "chat",
                    roomId: id,
                    message: currmessage
                }))
                setCurrmessage("");
            }}>Send Message</button>
        </div>
    )
}
