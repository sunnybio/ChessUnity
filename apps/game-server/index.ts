import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', async function connection(ws: any) {
    ws.on('message', function message(data: string) {
        console.log('received: %sasdasd', data)
        ws.send(data)
        // wss.clients.forEach((element: any) => {
        //     console.log(element)
        // })
    })
})
