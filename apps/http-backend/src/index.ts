import express, { Request, Response } from "express";
const app = express();
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import { RoomSchema, SignInSchema, UserSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
app.use(express.json());
app.post("/signup", async (req, res) => {
  const parseddata = UserSchema.safeParse(req.body);
  if (!parseddata.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  try {
    await prismaClient.user.create({
      data: {
        email: parseddata?.data.email,
        password: parseddata?.data.password,
        name: parseddata?.data.name,
      },
    });
    //@ts-ignore
    res.json({ msg: "signedup successfully", userid: req.userId });
  } catch (e) {
    res.status(411).json({
      msg: "Username already exits ",
    });
    console.log(e);
  }
});
app.post("/signin", async (req: Request, res: any) => {
  const parseddata = SignInSchema.safeParse(req.body);
  try {
    if (!parseddata.success) {
      return res.status(400).json({
        message: "Incorrect inputs",
      });
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: parseddata.data.email,
        password: parseddata.data.password,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return res.status(200).json({
      message: "Signed in successfully",
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
app.post(
  "/createroom",
  middleware,
  async (req: express.Request, res: express.Response): Promise<void> => {
    const parseddata = RoomSchema.safeParse(req.body);
    if (!parseddata.success) {
      res.status(401).json({
        msg: "Incorrect inputs",
      });
      return;
    }
    try {
      //@ts-ignore
      const userId = req.userId;
      const room = await prismaClient.room.create({
        data: {
          slug: parseddata.data?.name || "",
          adminId: userId,
        },
      });
      res.status(200).json({
        msg:"Room created"+room.id
      });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Room already exists",
      });
      return;
    }
  }
);
app.get('/room/:roomId', async (req, res) => {
  const roomId = Number(req.params.roomId)
  const messages = await prismaClient.chat.findMany({
    where: {
      roomId:roomId
    },
    orderBy: {
      id:"desc"
    },
    take:50
  })
  if (!messages) {
    res.json({msg:"unable to fetch messages"})
    return
  }
   res.json(messages);
})
app.listen(3002, () => {
  console.log("Listening...");
});
