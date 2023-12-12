'use client'
import Chessboard from 'chessboardjsx'
import { Chess, Piece } from 'chess.ts'
import { useEffect, useState } from 'react'

const ws = new WebSocket('ws://localhost:8080')
const game = new Chess()

const GameRoom = (): JSX.Element => {
    const [position, setPostion] = useState('start')
    const [msgList, setmsgList] = useState(['hello'])
    const [msg, setMsg] = useState('')

    ws.onmessage = (event) => {
        if (event.data instanceof Blob) {
            const reader = new FileReader()

            reader.onload = () => {
                const newMessages = [...msgList, reader.result as string]
                setmsgList(newMessages)
            }

            reader.readAsText(event.data)
        } else {
            const newMessages = [...msgList, event.data]
            setmsgList(newMessages)
        }
    }

    const sendMsg = async (_: any) => {
        ws.send(msg)
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
            // setTimeout(() => {
            setPostion(game.fen())
            // }, 500)
        } else {
            console.log('move is not valid')
        }
    }

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
                        onPieceClick={(piece: any) => {
                            console.log(piece)
                        }}
                        onDragOverSquare={movePieceOnDrag}
                    />
                </div>
            </div>
        )
    }
    return <div>window not connected</div>
}

export default GameRoom
