const express = require("express");
const cookieParser = require("cookie-parser");
const useragent = require("express-useragent");
const app = express();
var cors = require("cors");
const errorMiddleware = require("./middleware/error");
const scheduleJob1 = require("./controllers/sentNotificationWebController");
// const housingapi=require("./controllers/housingapiControllers");

app.use(useragent.express());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
const agent = require("./routes/agentRoute");
const product_service = require("./routes/productserviceRoute");
const lead_source = require("./routes/leadsourceRoute");
const lead_status = require("./routes/statusRoute");
const lead = require("./routes/leadRoute");
const countries_state = require("./routes/country_stateRoute");
const followup = require("./routes/followupRoute");
const calllog = require("./routes/calllogRoute");
const lostreason = require("./routes/lostreasonRoute");
const YearlySaleApi = require("./routes/genralapiRoute");
const Updateandsavenotification = require("./routes/notificationRoute");
const excelUplode = require("./routes/excelUplodeRoute");
const uploadcontact = require("./routes/uplodecontactRoute");
const LeadFileUplode = require("./routes/leadFileRoute");
const Report = require("./routes/allReportRoute");
const socialmedialead = require("./routes/socialmedialeadRoute");
const transactional = require("./routes/transactionalsmsRoute");
const smsreport = require("./routes/smsRoute");
const campaginRoute = require("./routes/campaignRoute");
const prospectRoute = require("./routes/prospectRoute");
// const updateandsavenotification1=require('./routes/sentNotificationWebRoute')

// scheduleJob1();
// housingapi();
app.use(cors());
app.use("/api/v1/", agent);
app.use("/api/v1/", prospectRoute);
app.use("/api/v1/", product_service);
app.use("/api/v1/", lead_source);
app.use("/api/v1/", lead_status);
app.use("/api/v1/", lead);
app.use("/api/v1/", countries_state);
app.use("/api/v1/", followup);
app.use("/api/v1/", calllog);
app.use("/api/v1/", lostreason);
app.use("/api/v1/", YearlySaleApi);
app.use("/api/v1/", Updateandsavenotification);
app.use("/api/v1/", transactional);
app.use("/api/v1/", campaginRoute);
app.use("/", excelUplode);
app.use("/", LeadFileUplode);
app.use("/", uploadcontact);
app.use("/api/v1/", Report);
app.use("/api/v1/", smsreport);
app.use(socialmedialead);
// app.use("/api/v1/",updateandsavenotification1)

app.get("/", function (req, res) {
  try {
    res.status(200).send({
      success: true,
      massage: "Backend Get  Product",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Middleware for Error
app.use(errorMiddleware);

// module.exports = app;
module.exports = {
  rootPath: __dirname,
  app
};
