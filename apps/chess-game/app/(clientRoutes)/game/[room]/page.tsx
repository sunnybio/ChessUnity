'use client'
import Chessboard from 'chessboardjsx'
import { Chess } from 'chess.ts'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

interface SocketMessage {
    type: string
    payload: { message: MessageType }
}
interface MessageType {
    to: string
    from: string
    color: string
    flags: string
    piece: string
    san: string
}

const GameRoom = (): JSX.Element => {
    const [position, setPostion] = useState('start')
    const [msgList] = useState(['hello'])
    const [msg, setMsg] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const [ws, setWs] = useState<WebSocket | undefined>(undefined)
    const [game, setGame] = useState(new Chess())
    // const game = new Chess()
    const param: Params = useParams()
    console.log(`router param ${param.room}`)
    const roomId: string = param.room
    console.log(`creating conneciton ${roomId}`)

    const sendMsg = (_: any) => {
        ws?.send(msg)
        setMsg('')
    }
    const movePieceOnDrag = (square: string) => {
        console.log(square)
    }

    const pieceMove = (moveInfo: {
        sourceSquare: string
        targetSquare: string
        piece: string
    }) => {
        const move = game.move(moveInfo.targetSquare)

        if (move !== null) {
            const moveMsg = {
                type: 'message',
                payload: {
                    message: move,
                },
            }
            ws?.send(JSON.stringify(moveMsg))
            // setTimeout(() => {
            setPostion(game.fen())
            // }, 500)
        } else {
            console.log('move is not valid')
        }
    }

    useEffect(() => {
        console.log(process.env)
        let WEBSOCKETSERVER_URL: string | undefined =
            process.env.WEBSOCKETSERVER_URL

        WEBSOCKETSERVER_URL = 'ws://localhost:8080'

        console.log('here')
        console.log(WEBSOCKETSERVER_URL)
        if (!WEBSOCKETSERVER_URL) {
            throw new Error('websocket server url not found in env variable')
        }
        const websocket = new WebSocket(WEBSOCKETSERVER_URL)
        setWs(websocket)
        websocket.onopen = (_) => {
            console.log('opened ws')
            const joinReq = {
                type: 'join',
                payload: {
                    roomId: roomId,
                },
            }
            console.log('passing dict', joinReq)
            websocket.send(JSON.stringify(joinReq))
        }

        websocket.onmessage = (event) => {
            if (event.data instanceof Blob) {
                const reader = new FileReader()

                reader.onload = () => {
                    // const newMessages = [...msgList, reader.result as string]
                    // setmsgList(newMessages)
                    console.log('blobdatra', reader.result as string)
                }

                reader.readAsText(event.data)
            } else {
                // const newMessages = [...msgList, event.data]
                // setmsgList(newMessages)
                const data: SocketMessage = JSON.parse(event.data)
                console.log(data)
                if (data.type === 'start-game') {
                    setIsLoading(false)
                }

                if (data.type === 'message') {
                    const message: MessageType = data.payload.message
                    game.move(message.to)

                    setPostion(game.fen())
                }
            }
        }

        websocket.onclose = () => {
            console.log(`Websocket closed!`)
            setWs(undefined)
        }
    }, [roomId])

    if (isLoading) {
        return (
            <div className="h-screen w-full content-center text-4xl">
                loading...
            </div>
        )
    } else {
        if (typeof window !== 'undefined') {
            return (
                <div className="grid grid-cols-4 h-screen w-full bg-black">
                    <div className="col-span-1 bg-gray-400">
                        <div className="block h-1/3 bg-zinc-500 rounded-l ">
                            {msgList.map((message, index) => (
                                <div key={index}>{message}</div>
                            ))}
                        </div>
                        <input
                            className="p-1 w-full"
                            type="text"
                            name="message"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                        />
                        <button onClick={sendMsg}>Send</button>
                    </div>
                    <div className="col-span-3 mx-auto">
                        <Chessboard
                            onDrop={pieceMove}
                            position={position}
                            onDragOverSquare={movePieceOnDrag}
                        />
                    </div>
                </div>
            )
        }
    }
    return <div>window not connected</div>
}

export default GameRoom
