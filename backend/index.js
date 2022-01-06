import app from './server.js';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import StationsDAO from "./dao/stationsDAO.js";

const MongoClient = mongodb.MongoClient
dotenv.config();

const port = process.env.PORT || 5000

MongoClient.connect(
    process.env.STATIONS_DB_URI, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true
}).catch(err => {
    console.error(err.stack)
    process.exit(1)
}).then(async client => {
    await StationsDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})