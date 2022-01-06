import StationsDAO from "../dao/stationsDAO.js";

export default class StationsController {
    static async apiGetStations(req, res, next) {

        let filters = {}
        if(req.query.country && req.query.name){
            filters.country = req.query.country
            filters.name = req.query.name
        }
        if (req.query.country) {
            filters.country = req.query.country
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { stationsList, totalNumStations } = await StationsDAO.getStations({
            filters
        })

        let response = {
            stations: stationsList,
            filters: filters,
            total_stations: totalNumStations
        }
        res.json(response)
    }

    static async apiGetStationCountries(req, res, next) {
        try {
            let country = await StationsDAO.getCountries();
            res.json(country);
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
}