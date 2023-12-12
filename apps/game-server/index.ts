import { WebSocketServer } from 'ws'
import express from 'express'
import http from 'http'

const app = express()
const port = 8080
const server = http.createServer(app)

const wss = new WebSocketServer({ server })

const players: {
    [key: string]: {
        room: string
        ws: any
        numberOfPlayers: number
    }
} = {}

const generateRandomString = (length: number): string => {
    return Math.random().toString(20).substr(2, length)
}
wss.on('connection', async function connection(ws: any) {
    ws.on('message', function message(data: string) {
        console.log('received: %s', data)

        ws.send(data)
        // wss.clients.forEach((element: any) => {
        //     console.log(element)
        // })
    })
})
app.get('/create-room', (req, res) => {
    res.send(generateRandomString(12))
})

app.get('/join-room', (req, res) => {
    Object.keys(players).forEach((roomId) => {
        if (players[roomId]['numberOfPlayers'] < 2) {
            res.send(roomId)
        }
    })
    res.send(generateRandomString(12))
})
server.listen(port)
