'use client'

import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import axios from 'axios'
const MainPage = (): JSX.Element => {
    const router = useRouter()
    const createGame = async () => {
        const roomId = await axios.get('http://localhost:8080/create-room')
        console.log(roomId)
        console.log(roomId.data)
        router.push(`/game/${roomId.data}`)
    }
    return (
        <div>
            <button onClick={createGame}>start game</button>

            <button>join game</button>
        </div>
    )
}

export default MainPage
