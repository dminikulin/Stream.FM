import express from "express";
import StationsCtrl from "./stations.controller.js";

const router = express.Router();

router.route("/").get(StationsCtrl.apiGetStations)
router.route("/countries").get(StationsCtrl.apiGetStationCountries)

export default router