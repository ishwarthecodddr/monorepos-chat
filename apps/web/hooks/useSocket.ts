import { useEffect, useState } from "react";
import { Ws_URL } from "../app/config";
// what this hook does is socket connection in client-side
export const useSocket = () => {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${Ws_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YThlNmQyZC0xZmMwLTRmZDYtYWU4Zi04MjE4NDlhZGJlNDciLCJpYXQiOjE3Mzg3MzQxMDl9.Azr9fPGjdfcwtXeaF0lqricdcdc_iy7yjqhfA5JRwBE`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
    return () => {
      ws.close();
    };
  }, []);
  return { loading, socket };
};
