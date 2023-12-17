'use client'

import { useRouter } from 'next/navigation'
import axios from 'axios'
const MainPage = () => {
    const router = useRouter()
    const createGame = () => {
        axios
            .get('http://localhost:8080/create-room')
            .then((data) => {
                console.log(data)
                router.push(`/game/${data.data}`)
            })
            .catch((e) => console.error(e))
        // console.log(roomId)
        // console.log(roomId.data)
        // router.push(`/game/${roomId.data}`)
    }

    const joinGame = () => {
        axios
            .get('http://localhost:8080/join-room')
            .then((data) => {
                console.log(data)
                router.push(`/game/${data.data}`)
            })
            .catch((e) => console.error(e))
        // const joinRoomId = await axios.get('http://localhost:8080/join-room')

        // console.log('new room id', joinRoomId)
        // router.push(`/game/${joinRoomId.data}`)
    }
    return (
        <div className="block bg-black h-screen w-full justify-center">
            <div className="content-center">
                <button
                    className="bg-white hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-full"
                    onClick={createGame}
                >
                    start game
                </button>

                <button
                    onClick={joinGame}
                    className="bg-white hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-full"
                >
                    join game
                </button>
            </div>
        </div>
    )
}

export default MainPage
