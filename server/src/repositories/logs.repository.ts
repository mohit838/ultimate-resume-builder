import { Collection, Db, MongoClient } from "mongodb"

import { DB_CONFIG } from "@/config/AppConstant"

let mongoClient: MongoClient | null = null

const getMongoClient = async (): Promise<MongoClient> => {
    if (!mongoClient) {
        mongoClient = new MongoClient(DB_CONFIG.mongoUrl)
        await mongoClient.connect()
    }
    return mongoClient
}

const getLogCollection = async (
    collectionName: string
): Promise<Collection> => {
    const client = await getMongoClient()
    const db: Db = client.db()
    return db.collection(collectionName)
}

export const fetchLogs = async (
    collection: string,
    limit = 50,
    skip = 0
): Promise<any[]> => {
    const logsCollection = await getLogCollection(collection)

    return logsCollection
        .find({})
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .toArray()
}
