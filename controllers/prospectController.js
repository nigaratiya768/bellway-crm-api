const Prospect = require("../models/prospectsModel");
const responseObject = require("../utils/apiResponse");
const { rootPath } = require("../app");
let converter = require("json-2-csv");
const fs = require("fs");
var XLSX = require("xlsx");
const callLogModel = require("../models/callLogModel");
const agentModel = require("../models/agentModel");
const CampaignModel = require("../models/campaignModel");
const path = require("path");
console.log("rootPath", __dirname, __dirname + "/../");

exports.createProspect = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return responseObject({
        res,
        status: 400,
        type: "error",
        message: "Name is required",
      });
    }
    const isProspectExist = await Prospect.findOne({ name });
    if (isProspectExist) {
      return responseObject({
        res,
        status: 400,
        type: "error",
        message: "Prospect Already Exist",
        data: null,
        error: null,
      });
    }
    const prospect = await Prospect.create(req.body);
    responseObject({
      res,
      status: 201,
      type: "success",
      message: "Prospect Added Successfully....",
      data: prospect,
      error: null,
    });
  } catch (err) {
    console.log("Create prospect", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.createBulkProspect = async (req, res, next) => {
  try {
    console.log(req.file.fieldname);

    const wb = XLSX.readFile(
      __dirname.replace("controllers", "") + req.file.path
    );
    // console.log(wb.Sheets["Sheet1"]);
    var prospectArr = XLSX.utils.sheet_to_json(wb.Sheets["Sheet1"], {});
    // console.log(prospectArr);
    // if (prospects.length === 0) {
    //   return responseObject({
    //     res,
    //     status: 400,
    //     type: "error",
    //     message: "Prospects are required",
    //   });
    // }
    // const agents = await agentModel.find({ agent_status: 1 });
    const campaign = await CampaignModel.findOne({
      IsActive: true,
    })
      .sort({ createdAt: -1 })
      .select("name");
    console.log("campaignName", campaign);
    // const prospectPerAgent = Math.ceil(prospectArr.length / agents.length);
    let prospects = [];
    // for (let i = 0; i < agents.length; i++) {
    //   // const agent = agents[i];
    //   const agentProspects = prospectArr.splice(0, prospectPerAgent);
    //   const assignAgentToProspect = agentProspects.map((prospect) => {
    //     return {
    //       ...prospect,
    //       // assignPhone: agent.agent_mobile,
    //       // assignTo: agent.agent_email,
    //       // agent: agent._id,
    //       campaignName: campaign.name,
    //       campaignId: campaign._id,
    //       totalCalls: 0,
    //       lastCallDate: new Date(),
    //     };
    //   });
    //   // console.log("assignAgentToProspect", assignAgentToProspect);
    //   const prospectData = await Prospect.insertMany(assignAgentToProspect, {
    //     ordered: false,
    //   });
    //   // console.log("---------------------------------");
    //   console.log("prospectData", prospectData);
    //   prospect = [...prospect, ...prospectData];
    // }

    for (let i = 0; i < prospectArr.length; i++) {
      const assignAgentToProspect = {
        ...prospectArr[i],
        campaignName: campaign.name,
        campaignId: campaign._id,
        totalCalls: 0,
        lastCallDate: new Date(),
      };
      // const prospectData = await Prospect.create(assignAgentToProspect);
      // console.log("---------------------------------");
      // console.log("prospectData", prospectData);
      prospects = [...prospects, assignAgentToProspect];
    }

    console.log("total propect",prospects.length);

    const prospectRes = await Prospect.insertMany(prospects, {
      ordered: false,
    });

    console.log("prospect", prospectRes);

    responseObject({
      res,
      status: 201,
      type: "success",
      message: "Prospects Added Successfully....",
      data: prospectRes,
      error: null,
    });
  } catch (err) {
    console.log("Create bulk prospect", err);
    if (err.message.includes("E11000 duplicate")) {
      console.log("Duplicate", {
        duplicate: err?.writeErrors,
        inserted: err?.insertedDocs,
      });
      return responseObject({
        res,
        status: 200,
        type: "error",
        message: "Prospect Already Exist",
        data: {
          duplicate: err?.writeErrors?.length,
          inserted: err?.insertedDocs?.length,
        },
        error: null,
      });
    }
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.downloadProspect = async (req, res, next) => {
  try {
    const { agentEmail, disposition, campaignName } = req.query;
    const filter = {
      ...(agentEmail && agentEmail != "All" && { assignTo: agentEmail }),
      ...(disposition && disposition != "All" && { disposition }),
      ...(campaignName && campaignName != "All" && { campaignName }),
    };

    console.log("filter", agentEmail, filter);
    const prospects = await Prospect.find(filter)
      .select("-_id -callLogId -__v -campaignId -agent")
      .lean();

    const csv = await converter.json2csv(prospects, {});
    return res.attachment(`prospects-${agentEmail}.csv`).send(csv);
  } catch (err) {
    console.log("Get prospects", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.getAllProspect = async (req, res, next) => {
  try {
    const {
      agentEmail = "All",
      disposition = "All",
      campaignName = "All",
      page = 1,
      perPage = 10,
    } = req.query;
    const filter = {
      ...(agentEmail && agentEmail != "All" && { assignTo: agentEmail }),
      ...(disposition && disposition != "All" && { disposition }),
      ...(campaignName && campaignName != "All" && { campaignName }),
    };
    const skip = (Number(page) - 1) * Number(perPage);
    console.log("filter", skip, agentEmail, filter);
    const prospects = await Prospect.find(filter)
      .sort("createdAt")
      .skip(skip)
      .limit(Number(perPage));
    const total = await Prospect.countDocuments();

    responseObject({
      res,
      status: 200,
      type: "success",

      message: "your prospects",
      data: { prospects, total: Math.ceil(total / perPage) },
      error: null,
    });
  } catch (err) {
    console.log("Get prospects", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.getAllFilter = async (req, res, next) => {
  try {
    const prospectFilter = await Prospect.aggregate([
      {
        $facet: {
          agents: [
            {
              $group: {
                _id: "$assignTo",
              },
            },
          ],
          campaigns: [
            {
              $group: {
                _id: "$campaignName",
              },
            },
          ],
        },
      },
    ]);
    responseObject({
      res,
      status: 200,
      type: "success",
      message: "your prospects",
      data: prospectFilter.length > 0 ? prospectFilter[0] : null,
      error: null,
    });
  } catch (err) {
    console.log("Get prospects", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const prospects = await Prospect.aggregate([
      {
        $facet: {
          upcomingFollowups: [
            { $match: { totalCalls: 0 } },
            { $count: "count" },
          ],
          totalOverdue: [
            {
              $match: {
                scheduledDate: {
                  $lt: new Date(),
                },
              },
            },
            { $count: "count" },
          ],
          totalPendingCalls: [
            {
              $match: {
                scheduledDate: {
                  $gt: new Date(),
                },
              },
            },
            { $count: "count" },
          ],
          totalProspects: [{ $count: "count" }],
          totalFreshProspects: [
            {
              $match: {
                disposition: "Lead Generation",
              },
            },
            { $count: "count" },
          ],
          totalAgents: [{ $group: { _id: "$assignTo" } }, { $count: "count" }],
        },
      },
      {
        $project: {
          upcomingFollowups: {
            $ifNull: [
              {
                $arrayElemAt: ["$upcomingFollowups.count", 0],
              },
              0,
            ],
          },
          totalOverdue: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalOverdue.count", 0],
              },
              0,
            ],
          },
          totalPendingCalls: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalPendingCalls.count", 0],
              },
              0,
            ],
          },
          totalProspects: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalProspects.count", 0],
              },
              0,
            ],
          },
          totalFreshProspects: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalFreshProspects.count", 0],
              },
              0,
            ],
          },
          totalAgents: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalAgents.count", 0],
              },
              0,
            ],
          },
        },
      },
    ]);
    responseObject({
      res,
      status: 200,
      type: "success",
      message: "your prospects",
      data: prospects,
      error: null,
    });
  } catch (err) {
    console.log("Get prospects", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.getProspect = async (req, res, next) => {
  try {
    const prospect = await Prospect.findById(req.params.id);
    if (!prospect) {
      return responseObject({
        res,
        status: 400,
        type: "error",
        message: "Prospect Not Found",
        data: null,
        error: null,
      });
    }
    responseObject({
      res,
      status: 201,
      type: "success",
      message: "your prospect",
      data: prospect,
      error: null,
    });
  } catch (err) {
    console.log("Get prospect", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.updateProspect = async (req, res, next) => {
  try {
    const prospectId = req.params.id;
    console.log("prospect id ", prospectId);
    const prospect = await Prospect.findById(prospectId);
    if (!prospect) {
      return responseObject({
        res,
        status: 400,
        type: "error",
        message: "Prospect Not Found",
        data: null,
        error: null,
      });
    }
    const {
      remarks,
      lastCaller,
      phone_number,
      scheduledDate,
      callInitiatedTime,
      callEndTime,
      duration,
      disposition,
      quit = false,
      agentEmail,
    } = req.body;
    prospect.remarks = remarks;
    prospect.lastCaller = lastCaller;
    prospect.lastCallDate = new Date();
    prospect.totalCalls = prospect.totalCalls + 1;
    prospect.scheduledDate = scheduledDate;
    prospect.disposition = disposition;

    console.log("-------------", prospect);

    const newCallLogs = new callLogModel({
      user_id: prospect._id,
      agentEmail,
      agent_id: prospect.agent,
      callInitiatedTime,
      callEndTime,
      duration,
      phone_number,
      callStatus: disposition,
    });

    prospect.callLogId = newCallLogs._id;
    await newCallLogs.save();
    await prospect.save();

    if (!quit) {
      const newProspect = await Prospect.findOne({
        $and: [{ campaignId: prospect.campaignId }, { totalCalls: 0 }],
      });

      if (!newProspect) {
        return responseObject({
          res,
          status: 200,
          type: "error",
          message: "Prospect Not Found",
          data: null,
          error: null,
        });
      }

      const assignTo = agentEmail;
      newProspect.assignTo = assignTo;
      newProspect.lastCallDate = new Date();
      newProspect.totalCalls = newProspect.totalCalls + 1;
      newProspect.assignPhone = prospect.phone;
      newProspect.agent = prospect.agent;

      await newProspect.save();
      // console.log("newProspect", newProspect, agentEmail);
      return responseObject({
        res,
        status: 200,
        type: "success",
        message: "your prospect",
        data: newProspect,
        error: null,
      });
    }

    responseObject({
      res,
      status: 201,
      type: "success",
      message: "your prospect",
      data: prospect,
      error: null,
    });
  } catch (err) {
    console.log("Update prospect", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.startCalling = async (req, res, next) => {
  try {
    const agentEmail = req.query.agentEmail;
    const campaignId = req.query.campaignId;

    // assignPhone: agent.agent_mobile,
    // assignTo: agent.agent_email,
    // agent: agent._id,

    // const prospect = await Prospect.findOne({
    //   $and: [{ assignTo: agent }, { campaignId }, { totalCalls: 0 }],
    // }).sort("lastCallDate");
    const prospect = await Prospect.findOne({
      $and: [{ campaignId }, { totalCalls: 0 }, { assignTo: "N/A" }],
    }).sort("lastCallDate");

    if (!prospect) {
      return responseObject({
        res,
        status: 400,
        type: "error",
        message: "Prospect Not Found",
        data: null,
        error: null,
      });
    }

    const agent = await agentModel.findOne({
      agent_email: agentEmail,
    });

    if (!agent) {
      return responseObject({
        res,
        status: 400,
        type: "error",
        message: "Agent Not Found",
        data: null,
        error: null,
      });
    }
    const assignTo = agent.agent_email;
    prospect.assignTo = assignTo;
    prospect.lastCallDate = new Date();
    prospect.totalCalls = prospect.totalCalls + 1;
    prospect.assignPhone = agent.agent_mobile;
    prospect.agent = agent._id;

    await prospect.save();

    console.log("prospect", prospect);
    responseObject({
      res,
      status: 200,
      type: "success",
      message: "your prospect",
      data: prospect,
      error: null,
    });
  } catch (err) {
    console.log("Start Calling", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.freshCalling = async (req, res, next) => {
  try {
    const agentEmail = req.query.agentEmail;
    const campaignId = req.query.campaignId;
    const prospect = await Prospect.findOne({
      $and: [{ campaignId }, { totalCalls: 0 }, { assignTo: "N/A" }],
    }).skip(1);
    if (!prospect) {
      return responseObject({
        res,
        status: 400,
        type: "error",
        message: "Prospect Not Found",
        data: null,
        error: null,
      });
    }

    const agent = await agentModel.findOne({
      agent_email: agentEmail,
    });

    if (!agent) {
      return responseObject({
        res,
        status: 400,
        type: "error",
        message: "Agent Not Found",
        data: null,
        error: null,
      });
    }
    const assignTo = agent.agent_email;
    prospect.assignTo = assignTo;
    prospect.lastCallDate = new Date();
    prospect.totalCalls = prospect.totalCalls + 1;
    prospect.assignPhone = agent.agent_mobile;
    prospect.agent = agent._id;

    await prospect.save();

    responseObject({
      res,
      status: 200,
      type: "success",
      message: "your prospect",
      data: prospect,
      error: null,
    });
  } catch (err) {
    console.log("Start Calling", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.overDueCalling = async (req, res, next) => {
  try {
    const agent = req.query.agentEmail;
    const campaignId = req.query.campaignId;
    const prospect = await Prospect.findOne({
      $and: [
        { assignTo: agent },
        { campaignId },
        {
          scheduledDate: {
            $lt: new Date(),
          },
        },
      ],
    }).sort("scheduledDate");

    console.log("prospect over due", prospect);

    responseObject({
      res,
      status: 200,
      type: "success",
      message: "your prospect",
      data: prospect,
      error: null,
    });
  } catch (err) {
    console.log("Over due Calling", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

// {
//         // Filter for calls initiated today
//         $match: {
//           callInitiatedDate: {
//             $gte: new Date(new Date().setHours(0, 0, 0, 0)),
//             $lt: new Date(new Date().setHours(23, 59, 59, 999)),
//           },
//         },
//       },

exports.prospectWiseReport = async (req, res, next) => {
  try {
    const reportPwise = await Prospect.aggregate([
      {
        $facet: {
          agentWise: [
            {
              $match: {
                disposition: {
                  $ne: "Lead Generation",
                },
                lastCallDate: {
                  $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                  $lt: new Date(new Date().setHours(23, 59, 59, 999)),
                },
              },
            },
            {
              $group: {
                _id: "$agent",
                assignTo: {
                  $first: "$assignTo",
                },
                assignPhone: {
                  $first: "$assignPhone",
                },
                totalCount: {
                  $sum: 1,
                },
              },
            },
            {
              $lookup: {
                from: "crm_agents",
                localField: "assignTo",
                foreignField: "agent_email",
                as: "agents",
              },
            },
            {
              $addFields: {
                agents: {
                  $first: "$agents",
                },
              },
            },
            {
              $project: {
                _id: 1,
                assignTo: 1,
                assignPhone: 1,
                totalCount: 1,
                agentName: "$agents.agent_name",
              },
            },
          ],

          campaignWise: [
            {
              $group: {
                _id: "campaignId",
                campaignName: {
                  $first: "$campaignName",
                },
                totalCount: {
                  $sum: 1,
                },
              },
            },
          ],

          totalNotInterested: [
            {
              $match: {
                disposition: "Not Interested",
              },
            },
            { $count: "count" },
          ],
          totalInterested: [
            { $match: { disposition: "Interested" } },
            { $count: "count" },
          ],
          totalNotContacted: [
            {
              $match: { disposition: "Not Contacted" },
            },
            { $count: "count" },
          ],
          totalNotAnswered: [
            {
              $match: { disposition: "Not Answered" },
            },
            { $count: "count" },
          ],
          totalCallback: [
            { $match: { disposition: "Callback" } },
            { $count: "count" },
          ],
          totalNotReachable: [
            {
              $match: { disposition: "Not Reachable" },
            },
            { $count: "count" },
          ],
          totalCallDisconnected: [
            {
              $match: {
                disposition: "Call Disconnected",
              },
            },
            { $count: "count" },
          ],
          totalBusy: [
            {
              $match: {
                disposition: "Busy",
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $project: {
          agentWise: 1,
          campaignWise: 1,
          totalNotInterested: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalNotInterested.count", 0],
              },
              0,
            ],
          },
          totalInterested: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalInterested.count", 0],
              },
              0,
            ],
          },
          totalNotContacted: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalNotContacted.count", 0],
              },
              0,
            ],
          },
          totalNotAnswered: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalNotAnswered.count", 0],
              },
              0,
            ],
          },
          totalCallback: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalCallback.count", 0],
              },
              0,
            ],
          },
          totalNotReachable: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalNotReachable.count", 0],
              },
              0,
            ],
          },
          totalCallDisconnected: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalCallDisconnected.count", 0],
              },
              0,
            ],
          },
          totalBusy: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalBusy.count", 0],
              },
              0,
            ],
          },
        },
      },
    ]);

    responseObject({
      res,
      status: 200,
      type: "success",
      message: "your prospect",
      data: reportPwise.length > 0 ? reportPwise[0] : null,
      error: null,
    });
  } catch (err) {
    console.log("Over due Calling", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.getAgentWiseStates = async (req, res, next) => {
  try {
    const agent = await agentModel.findOne({
      agent_name: req.params.agentId,
    });
    const prospects = await Prospect.aggregate([
      {
        $match: {
          assignTo: agent.agent_email,
          lastCallDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      },
      {
        $facet: {
          totalNotInterested: [
            {
              $match: {
                disposition: "Not Interested",
              },
            },
            {
              $count: "count",
            },
          ],
          totalInterested: [
            {
              $match: {
                disposition: "Interested",
              },
            },
            {
              $count: "count",
            },
          ],
          totalNotContacted: [
            {
              $match: {
                disposition: "Not Contacted",
              },
            },
            {
              $count: "count",
            },
          ],
          totalNotAnswered: [
            {
              $match: {
                disposition: "Not Answered",
              },
            },
            {
              $count: "count",
            },
          ],
          totalCallback: [
            {
              $match: {
                disposition: "Callback",
              },
            },
            {
              $count: "count",
            },
          ],
          totalNotReachable: [
            {
              $match: {
                disposition: "Not Reachable",
              },
            },
            {
              $count: "count",
            },
          ],
          totalBusy: [
            {
              $match: {
                disposition: "Busy",
              },
            },
            {
              $count: "count",
            },
          ],
          totalCallDisconnected: [
            {
              $match: {
                disposition: "Call Disconnected",
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $project: {
          totalNotInterested: {
            $ifNull: [{ $arrayElemAt: ["$totalNotInterested.count", 0] }, 0],
          },
          totalInterested: {
            $ifNull: [{ $arrayElemAt: ["$totalInterested.count", 0] }, 0],
          },
          totalNotContacted: {
            $ifNull: [{ $arrayElemAt: ["$totalNotContacted.count", 0] }, 0],
          },
          totalNotAnswered: {
            $ifNull: [{ $arrayElemAt: ["$totalNotAnswered.count", 0] }, 0],
          },
          totalCallback: {
            $ifNull: [{ $arrayElemAt: ["$totalCallback.count", 0] }, 0],
          },
          totalNotReachable: {
            $ifNull: [{ $arrayElemAt: ["$totalNotReachable.count", 0] }, 0],
          },
          totalCallDisconnected: {
            $ifNull: [{ $arrayElemAt: ["$totalCallDisconnected.count", 0] }, 0],
          },
          totalBusy: {
            $ifNull: [{ $arrayElemAt: ["$totalBusy.count", 0] }, 0],
          },
        },
      },
    ]);
    responseObject({
      res,
      status: 200,
      type: "success",
      message: "your prospects",
      data: prospects.length > 0 ? prospects[0] : null,
      error: null,
    });
  } catch (err) {
    console.log("Get prospects", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.getProspectFiles = async (req, res, next) => {
  try {
    //list all files form upload folder

    const files = fs.readdirSync("uploads/");
    console.log("files", files);
    responseObject({
      res,
      status: 200,
      type: "success",
      message: "your files",
      data: files,
      error: null,
    });
  } catch (err) {
    console.log("Get files", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.downloadUploadedProspect = async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, "../uploads/" + req.params.fileName);
    res.download(filePath);
    // res.attachment(req.params.fileName).send(csv);
  } catch (err) {
    console.log("Get files", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};

exports.getCallLogsState = async (req, res, next) => {
  try {
    const logs = await callLogModel.aggregate([
      {
        $addFields: {
          callInitiatedDate: {
            $dateFromString: { dateString: "$callInitiatedTime" },
          },
        },
      },
      {
        // Filter for calls initiated today
        $match: {
          callInitiatedDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      },
      {
        $project: {
          // Calculate the 2-hour block by dividing the hour by 2 and flooring it
          twoHourBlock: {
            $floor: {
              $divide: [
                { $hour: { date: "$callInitiatedDate", timezone: "+0530" } },
                2,
              ],
            },
          },
          duration: "$duration",
          totalCalls: { $literal: 1 },
          notConnected: {
            $cond: [{ $eq: ["$callStatus", "Not Contacted"] }, 1, 0],
          },
          callback: { $cond: [{ $eq: ["$callStatus", "Callback"] }, 1, 0] },
        },
      },
      {
        $group: {
          _id: "$twoHourBlock",
          duration: { $sum: "$duration" },
          totalCalls: { $sum: "$totalCalls" },
          notConnectedCount: { $sum: "$notConnected" },
          callbackCount: { $sum: "$callback" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          interval: {
            $concat: [
              // Determine if the start of the interval is AM or PM
              {
                $cond: [
                  {
                    $lt: [
                      {
                        $multiply: ["$_id", 2],
                      },
                      12,
                    ],
                  },
                  {
                    $toString: {
                      $multiply: ["$_id", 2],
                    },
                  },
                  {
                    $toString: {
                      $subtract: [
                        {
                          $multiply: ["$_id", 2],
                        },
                        12,
                      ],
                    },
                  },
                ],
              },
              {
                $cond: [
                  {
                    $lt: [
                      {
                        $multiply: ["$_id", 2],
                      },
                      12,
                    ],
                  },
                  "AM-",
                  "PM-",
                ],
              },
              // Determine if the end of the interval is AM or PM
              {
                $cond: [
                  {
                    $lt: [
                      {
                        $add: [
                          {
                            $multiply: ["$_id", 2],
                          },
                          2,
                        ],
                      },
                      12,
                    ],
                  },
                  {
                    $toString: {
                      $add: [
                        {
                          $multiply: ["$_id", 2],
                        },
                        2,
                      ],
                    },
                  },
                  {
                    $toString: {
                      $subtract: [
                        {
                          $add: [
                            {
                              $multiply: ["$_id", 2],
                            },
                            2,
                          ],
                        },
                        12,
                      ],
                    },
                  },
                ],
              },
              {
                $cond: [
                  {
                    $lt: [
                      {
                        $add: [
                          {
                            $multiply: ["$_id", 2],
                          },
                          2,
                        ],
                      },
                      12,
                    ],
                  },
                  "AM",
                  "PM",
                ],
              },
            ],
          },
          duration: 1,
          totalCalls: 1,
          notConnectedCount: 1,
          callbackCount: 1,
        },
      },
    ]);

    responseObject({
      res,
      status: 200,
      type: "success",
      message: "Call Logs",
      data: logs,
      error: null,
    });
  } catch (err) {
    console.log("Get files", err);
    responseObject({
      res,
      status: 500,
      type: "error",
      message: "server error",
      error: err,
      data: null,
    });
  }
};
