import { WebSocketServer } from 'ws'
import cors from 'cors'
import express from 'express'
import http from 'http'
import { RedisSubscriptionManager } from './Redis'
const app = express()
app.use(cors())
const port = 8080
const server = http.createServer(app)

const wss = new WebSocketServer({ server })

const players: {
    [key: string]: {
        room: string
        ws: any
    }
} = {}

interface Message {
    type: string
    payload: {
        roomId: string
        message: string
    }
}

const rooms = new Map<string, number>()
const emptyRooms: string[] = []
//WebSocketServer logic
wss.on('connection', async function connection(ws: any) {
    const wsId: string = generateRandomString(12)
    ws.on('message', (message: string) => {
        console.log('received: %s', message)
        const data: Message = JSON.parse(message.toString())

        if (data.type === 'join') {
            emptyRooms.push(data.payload.roomId)
            // if (rooms.get(data.payload.roomId)) {
            //     rooms.set(
            //         data.payload.roomId,
            //         rooms.get(data.payload.roomId) + 1
            //     )
            // }
            players[wsId] = {
                room: data.payload.roomId,
                ws,
            }
            RedisSubscriptionManager.getInstance().subscribe(
                wsId,
                data.payload.roomId,
                ws
            )
        }
        if (data.type === 'message') {
            const roomId = players[wsId].room
            const message = data.payload.message

            RedisSubscriptionManager.getInstance().playMove(roomId, message)
        }
        ws.on('disconnect', () => {
            RedisSubscriptionManager.getInstance().unsubscribe(
                wsId.toString(),
                players[wsId].room
            )
        })
        // wss.clients.forEach((element: any) => {
        //     console.log(element)
        // })
    })
})

const generateRandomString = (length: number): string => {
    return Math.random().toString(20).substr(2, length)
}

// api routes to get the roomId
app.get('/create-room', (req, res) => {
    const roomId: string = generateRandomString(12)
    rooms.set(roomId, 0)
    res.send(roomId)
})

app.get('/join-room', (req, res) => {
    if (emptyRooms.length !== 0) {
        res.send(emptyRooms.shift())
    }
    res.send(generateRandomString(12))
})
server.listen(port)
