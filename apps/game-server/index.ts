import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8089 });

wss.on("connection", function connection(ws: any) {
  ws.on("message", function message(data: string) {
    console.log("received: %sasdasd", data);
    ws.send("something");
    wss.clients.forEach((element: any) => {
      console.log(element);
    });
  });

  ws.send("something");
});
