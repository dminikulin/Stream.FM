import { query } from "express"

let stations

export default class StationsDAO {
    static async injectDB(conn) {
        if (stations) {
            return
        }
        try {
            stations = await conn.db(process.env.STATIONS_NS).collection("stations")
        }
        catch (e) {
            console.error(
                "Unable to establish a collection handle in StationsDAO: " + e
            )
        }
    }

    static async getStations({
        filters = null
    } = {}) {
        let query
        if (filters) {
            if ("country" in filters && "name" in filters) {
                query = {
                    "country": { $eq: filters["country"] }, $text: {$search: filters["name"]}}
            }
            else if ("country" in filters) {
                    query = { "country": { $eq: filters["country"] } }
                } else if ("name" in filters) {
                    query = { $text: { $search: filters["name"] } }
                }
            }

            let cursor

            try {
                cursor = await stations
                    .find(query);
            } catch (e) {
                console.error(`Unable to issue this command, ${e}`)
                return { stationsList: [], totalNumStations: 0 }
            }

            const displayCursor = cursor;

            try {
                const stationsList = await displayCursor.toArray()
                const totalNumStations = await stations.countDocuments(query)

                return { stationsList, totalNumStations }
            } catch (e) {
                console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
                return { stationsList: [], totalNumStations: 0 }
            }
        }

    static async getCountries() {
        let countries = []
        try {
            countries = await stations.distinct("country")
            return countries
        }
        catch (e) {
            console.error(`Unable to get countries, ${e}`)
            return countries
        }
    }

}