import { WebSocketServer } from "ws";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
const wss = new WebSocketServer({ port: 8080 });
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {
      return null;
    }
    if (!decode || !(decoded as JwtPayload).userId) {
      return null;
    }
    return decoded.userId;
  } catch (e) {
    console.log("Error in checkUser" + e);
    return null;
  }
}
interface User {
  ws: import("ws").WebSocket;
  rooms: string[];
  userId: string;
}
const users: User[] = [];
wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) return;
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);
  if (!userId) {
    ws.close();
    return;
  }
  ws.on("error", console.error);
  users.push({
    userId,
    rooms: [],
    ws,
  });
  ws.on("message",async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);
    try {
      if (parsedData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        if (!user) {
          return;
        }
        user.rooms.push(parsedData.roomId);
      } else if (parsedData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (!user) {
          return;
        }
        user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
      }
      if (parsedData.type === "chat") {
        const message = parsedData.message;
        const roomId = parsedData.roomId;

        await prismaClient.chat.create({
          data: {
            userId,
            roomId,
            message,
          }
        })

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            try {
              user.ws.send(
              JSON.stringify({
                type: "chat",
                message,
                roomId,
              })
              );
            } catch (err) {
              console.error("Error sending message to user:", err);
            }
          }
        });
      }
    } catch (e) {
      console.log("some error occured in ws-server" + e);
    }
  });
});
