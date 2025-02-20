const express = require("express");

const {
  createCampaign,
  getAllCampaign,
  getCampaign,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaignController");

const router = express.Router();

router.route("/add_campaign").post(createCampaign);
router.route("/get_all_campaign").get(getAllCampaign);
router.route("/get_campaign_by_id/:id").get(getCampaign);
router.route("/update_campaign/:id").put(updateCampaign);
router.route("/delete_campaign/:id").delete(deleteCampaign);
module.exports = router;
