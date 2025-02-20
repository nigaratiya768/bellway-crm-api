const express = require("express");

const {
  createProspect,
  createBulkProspect,
  getProspect,
  updateProspect,
  getAllProspect,
  startCalling,
  freshCalling,
  overDueCalling,
  prospectWiseReport,
  getAgentWiseStates,
  downloadProspect,
  getAllFilter,
  getStats,
  getProspectFiles,
  downloadUploadedProspect,
} = require("../controllers/prospectController");
const upload = require("../middleware/upload");

const router = express.Router();

router.route("/add_prospect").post(createProspect);
router.post(
  "/add_bulk_prospect",
  upload.single("prospects"),
  createBulkProspect
);
router.route("/get_all_prospects").get(getAllProspect);
router.route("/get_prospect/:id").get(getProspect);
router.route("/update_prospect/:id").put(updateProspect);
router.route("/start_calling").get(startCalling);
router.route("/fresh_calling").get(freshCalling);
router.route("/overdue_call").get(overDueCalling);
router.route("/report_prospects_wise").get(prospectWiseReport);
router.route("/report_prospects_wise/:agentId").get(getAgentWiseStates);
router.route("/download_prospects").get(downloadProspect);
router.route("/get_all_prospects_filters").get(getAllFilter);
router.route("/get_dashboard_stats").get(getStats);
router.route("/get_all_prospects_files").get(getProspectFiles);
router.route("/download_prospect/:fileName").get(downloadUploadedProspect);
module.exports = router;
