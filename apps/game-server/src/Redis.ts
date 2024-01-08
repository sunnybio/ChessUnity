import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

export class RedisSubscriptionManager {
    private static instance: RedisSubscriptionManager
    private subscriber: RedisClientType
    public publisher: RedisClientType
    private subscriptions: Map<string, string[]>

    private reverseSubscription: Map<
        string,
        { [userId: string]: { userId: string; ws: any } }
    >

    private constructor() {
        const redisUrl: string | undefined = process.env.REDIS_URL
        console.log('redis url==================', redisUrl)
        if (!redisUrl) {
            throw new Error('redis url not found ')
        }
        this.subscriber = createClient({ url: redisUrl })
        this.publisher = createClient({ url: redisUrl })

        this.publisher.connect()
        this.subscriber.connect()

        this.subscriptions = new Map<string, string[]>()
        this.reverseSubscription = new Map<
            string,
            { [userId: string]: { userId: string; ws: any } }
        >()
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RedisSubscriptionManager()
        }
        return this.instance
    }
    subscribe(userId: string, room: string, ws: any) {
        this.subscriptions.set(userId, [
            ...(this.subscriptions.get(userId) || []),
            room,
        ])

        this.reverseSubscription.set(room, {
            ...(this.reverseSubscription.get(room) || {}),
            [userId]: { userId: userId, ws },
        })

        if (
            Object.keys(this.reverseSubscription.get(room) || {})?.length === 1
        ) {
            this.subscriber.subscribe(room, (payload) => {
                try {
                    console.log('in sub', payload)
                    const subscribers = this.reverseSubscription.get(room) || {}
                    Object.values(subscribers).forEach(({ ws }) => {
                        ws.send(payload)
                    })
                } catch (e) {
                    console.error('error in payload')
                }
            })
        }
    }

    unsubscribe(userId: string, room: string) {
        this.subscriptions.set(
            userId,
            this.subscriptions.get(userId)?.filter((x) => x !== room) || []
        )
        if (this.subscriptions.get(userId)?.length !== 0) {
            this.subscriptions.delete(userId)
        }

        delete this.reverseSubscription.get(room)?.[userId]
        if (
            !this.reverseSubscription.get(room) ||
            Object.keys(this.reverseSubscription.get(room) || {}).length === 0
        ) {
            console.log('unsubscribing from ' + room)
            this.subscriber.unsubscribe(room)
            this.reverseSubscription.delete(room)
        }
    }

    playMove(room: string, message: string) {
        this.publish(room, {
            type: 'message',
            payload: {
                message,
            },
        })
    }

    startgame(
        room: string,
        message: { orientation: string; postionFen: string }
    ) {
        this.publish(room, {
            type: 'start-game',
            payload: {
                message,
            },
        })
    }
    publish(room: string, message: any) {
        console.log(`publishing to the room ${room} ${message}`)
        this.publisher.publish(room, JSON.stringify(message))
    }
}
