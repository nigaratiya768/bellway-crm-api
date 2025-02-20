const Lead = require("../models/leadModel");
const agent = require("../models/agentModel");
const Agentss = require("../models/agentModel");
const { ObjectId } = require('mongoose').Types;
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
//const useragent = require('useragent');
const useragent = require("express-useragent");
//const geoip = require('geoip-lite');
/// creat Lead
const multer = require("multer");
const upload = multer();
const xlsx = require("xlsx");
const FollowupLead = require('../models/followupModel');
const LeadAttechment = require('../models/leadattechmentModel')
exports.Add_Lead = catchAsyncErrors(async (req, res, next) => {
  const { contact_no } = req.body;
  const existingLead = await Lead.findOne({ contact_no });
if (existingLead) { 
    return res.status(400).json({
      success: false,
      message: "Contact number already exists. Please provide a unique contact number.",
    });
  }
  const lead = await Lead.create(req.body);
  const lead_id = lead._id;
  const assign_to_agent = lead.assign_to_agent;
  const commented_by = req.body.commented_id;
  const followup_status_id = lead.status;
  const followup_date = lead.followup_date;
  const followup_desc = lead.description;

  const update_data = {
    assign_to_agent: assign_to_agent, commented_by: commented_by, lead_id: lead_id,
    followup_status_id: followup_status_id, followup_date: followup_date,
    followup_desc: followup_desc
  };
  const followup_lead = await FollowupLead.create(update_data); 
    console.log(followup_lead);

  res.status(201).json({
    success: true,
    message: "lead  Has Been Added Successfully",
    lead,
    followup_lead,
  });
});

//// get All Lead
exports.getAllLead = catchAsyncErrors(async (req, res, next) => {
  const lead = await Lead.aggregate([
    {
      $lookup: {
        from: "crm_agents",
        let: { assign_to_agentString: "$assign_to_agent" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
              },
            },
          },
          {
            $project: {
              agent_name: 1,
            },
          },
        ],
        as: "agent_details",
      },
    },

    {
      $lookup: {
        from: "crm_product_services",
        let: { serviceString: "$service" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$serviceString" }],
              },
            },
          },
          {
            $project: {
              product_service_name: 1,
            },
          },
        ],
        as: "service_details",
      },
    },

    {
      $lookup: {
        from: "crm_statuses",
        let: { statusString: "$status" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$statusString" }],
              },
            },
          },
          {
            $project: {
              status_name: 1,
            },
          },
        ],
        as: "status_details",
      },
    },

    {
      $lookup: {
        from: "crm_lead_sources",
        // localField:'lead_source',
        // foreignField:'_id',
        let: { lead_sourceString: "$lead_source" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                // $cond: {
                //   if: { $ne: ["$$lead_sourceString", ""] },
                //   then: { $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }] },
                //   else: false,
                // },
              },
            },
          },
          {
            $project: {
              lead_source_name: 1,
            },
          },
        ],
        as: "lead_source_details",
      },

    },

    {
      $sort: {
        followup_date: 1, // 1 for ascending(123) order, -1 for descending(321) order
      },
    },
  ]);

  res.status(200).json({
    success: true,

    lead,
  });
});


//////// get All New Lead  (For New Leads) (For Admin)
exports.getAllNewLead = catchAsyncErrors(async (req, res, next) => {
  let lead = await Lead.aggregate([
    {
      $lookup: {
        from: "crm_agents",
        let: { assign_to_agentString: "$assign_to_agent" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
              },
            },
          },
          {
            $project: {
              agent_name: 1,
            },
          },
        ],
        as: "agent_details",
      },
    },

    {
      $lookup: {
        from: "crm_product_services",
        let: { serviceString: "$service" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$serviceString" }],
              },
            },
          },
          {
            $project: {
              product_service_name: 1,
            },
          },
        ],
        as: "service_details",
      },
    },

    {
      $lookup: {
        from: "crm_statuses",
        let: { statusString: "$status" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$statusString" }],
              },
            },
          },
          {
            $project: {
              status_name: 1,
            },
          },
        ],
        as: "status_details",
      },
    },

    {
      $lookup: {
        from: "crm_lead_sources",
        // localField:'lead_source',
        // foreignField:'_id',
        let: { lead_sourceString: "$lead_source" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                // $cond: {
                //   if: { $ne: ["$$lead_sourceString", ""] },
                //   then: { $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }] },
                //   else: false,
                // },
              },
            },
          },
          {
            $project: {
              lead_source_name: 1,
            },
          },
        ],
        as: "lead_source_details",
      },

    },

    {
      $sort: {
        followup_date: 1, // 1 for ascending(123) order, -1 for descending(321) order
      },
    },
  ]);
  ////  get only first followup lead
  const filteredLeads = [];     

  for (const singleLead of lead) {
    const lead_id = singleLead?._id;
    const leadstatusid=singleLead?.status;
   
     if(leadstatusid.toString()==='65a904fc4473619190494486'){
      filteredLeads.push(singleLead);
    }else{
      const count = await FollowupLead.countDocuments({ lead_id });
      if (count <= 1) {
        filteredLeads.push(singleLead);
      }
    }
    
  }

  res.status(200).json({
    success: true,
    lead: filteredLeads,
  });
});

//////// get All New Lead  (For New Leads) (For Agent)
exports.getAllNewLeadBYAgentId = catchAsyncErrors(async (req, res, next) => {

  const { assign_to_agent } = req.body;
  if (!assign_to_agent) {
    return next(new ErrorHander("assign_to_agent is required..!", 404));
  }
  const matchConditions = {};
  const agentObjectId = new ObjectId(assign_to_agent);
  matchConditions.assign_to_agent = agentObjectId;

  let lead = await Lead.aggregate([
    {
      $match: matchConditions,
    },
    {
      $lookup: {
        from: "crm_agents",
        let: { assign_to_agentString: "$assign_to_agent" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
              },
            },
          },
          {
            $project: {
              agent_name: 1,
            },
          },
        ],
        as: "agent_details",
      },
    },

    {
      $lookup: {
        from: "crm_product_services",
        let: { serviceString: "$service" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$serviceString" }],
              },
            },
          },
          {
            $project: {
              product_service_name: 1,
            },
          },
        ],
        as: "service_details",
      },
    },

    {
      $lookup: {
        from: "crm_statuses",
        let: { statusString: "$status" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$statusString" }],
              },
            },
          },
          {
            $project: {
              status_name: 1,
            },
          },
        ],
        as: "status_details",
      },
    },

    {
      $lookup: {
        from: "crm_lead_sources",
        // localField:'lead_source',
        // foreignField:'_id',
        let: { lead_sourceString: "$lead_source" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                // $cond: {
                //   if: { $ne: ["$$lead_sourceString", ""] },
                //   then: { $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }] },
                //   else: false,
                // },
              },
            },
          },
          {
            $project: {
              lead_source_name: 1,
            },
          },
        ],
        as: "lead_source_details",
      },

    },

    {
      $sort: {
        followup_date: 1, // 1 for ascending(123) order, -1 for descending(321) order
      },
    },
  ]);
  ////  get only first followup lead
  const filteredLeads = [];

  for (const singleLead of lead) {
    const lead_id = singleLead?._id;
    const leadstatusid=singleLead?.status;
   
    if(leadstatusid.toString()==='65a904fc4473619190494486'){
     filteredLeads.push(singleLead);
   }else{
     const count = await FollowupLead.countDocuments({ lead_id });
     if (count <= 1) {
       filteredLeads.push(singleLead);
     }
   }
  }

  res.status(200).json({
    success: true,
    lead: filteredLeads,
  });
});






////// get Alll lead For Followup
exports.getAllLeadFollowup = catchAsyncErrors(async (req, res, next) => {
  const lead = await Lead.aggregate([
    {
      $lookup: {
        from: "crm_agents",
        let: { assign_to_agentString: "$assign_to_agent" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
              },
            },
          },
          {
            $project: {
              agent_name: 1,
            },
          },
        ],
        as: "agent_details",
      },
    },

    {
      $lookup: {
        from: "crm_product_services",
        let: { serviceString: "$service" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$serviceString" }],
              },
            },
          },
          {
            $project: {
              product_service_name: 1,
            },
          },
        ],
        as: "service_details",
      },
    },

    {
      $lookup: {
        from: "crm_statuses",
        let: { statusString: "$status" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$statusString" }],
              },
            },
          },
          {
            $project: {
              status_name: 1,
            },
          },
        ],
        as: "status_details",
      },
    },

    {
      $lookup: {
        from: "crm_lead_sources",
        let: { lead_sourceString: "$lead_source" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
              },
            },
          },
          {
            $project: {
              lead_source_name: 1,
            },
          },
        ],
        as: "lead_source_details",
      },
    },
    /////for  loss status remove
    {
      $match: {
        status: {
          $nin: [
            new ObjectId("65a904e04473619190494482"),
            new ObjectId("65a904ed4473619190494484"),
            new ObjectId("65a904fc4473619190494486")
          ],
        },
      },
    },

    {
      $sort: {
        followup_date: 1, // 1 for ascending(123) order, -1 for descending(321) order
      },
    },
  ]);

  res.status(200).json({
    success: true,

    lead,
  });
});

/// get  lead by by agent id for user without status loss and won

exports.getLeadbyagentidandwithoutstatus = catchAsyncErrors(
  async (req, res, next) => {
    const { assign_to_agent } = req.body;
    if (!assign_to_agent) {
      return next(new ErrorHander("assign_to_agent is required..!", 404));
    }
    const matchConditions = {};
    const agentObjectId = new ObjectId(assign_to_agent);
    matchConditions.assign_to_agent = agentObjectId;
    const lead = await Lead.aggregate([
      {
        $match: matchConditions,
      },

      {
        $lookup: {
          from: "crm_agents",
          let: { assign_to_agentString: "$assign_to_agent" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
                },
              },
            },
            {
              $project: {
                agent_name: 1,
              },
            },
          ],
          as: "agent_details",
        },
      },

      {
        $lookup: {
          from: "crm_product_services",
          let: { serviceString: "$service" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$serviceString" }],
                },
              },
            },
            {
              $project: {
                product_service_name: 1,
              },
            },
          ],
          as: "service_details",
        },
      },

      {
        $lookup: {
          from: "crm_statuses",
          let: { statusString: "$status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$statusString" }],
                },
              },
            },
            {
              $project: {
                status_name: 1,
              },
            },
          ],
          as: "status_details",
        },
      },

      {
        $lookup: {
          from: "crm_lead_sources",
          let: { lead_sourceString: "$lead_source" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                },
              },
            },
            {
              $project: {
                lead_source_name: 1,
              },
            },
          ],
          as: "lead_source_details",
        },
      },
      /////for  loss and won status remove
      {
        $match: {
          status: {
            //$nin: ["65a904e04473619190494482", "65a904ed4473619190494484"],
            $nin: [
              new ObjectId("65a904e04473619190494482"),
              new ObjectId("65a904ed4473619190494484"),
              new ObjectId("65a904fc4473619190494486")
            ],
          },
        },
      },

      {
        $sort: {
          followup_date: 1,
        },
      },
    ]);

    if (lead.length == 0) {
      return next(new ErrorHander("Lead is not Avilable of This user", 201));
    }

    res.status(200).json({
      success: true,

      lead,
    });
  }
);

/// get  lead by by agent id for user with status loss and won

exports.getLeadbyagentidandwithstatus = catchAsyncErrors(
  async (req, res, next) => {
    const { assign_to_agent } = req.body;
    if (!assign_to_agent) {
      return next(new ErrorHander("assign_to_agent is required..!", 404));
    }
    const matchConditions = {};
    const agentObjectId = new ObjectId(assign_to_agent);
    matchConditions.assign_to_agent = agentObjectId;
    const lead = await Lead.aggregate([
      {
        $match: matchConditions,
      },

      {
        $lookup: {
          from: "crm_agents",
          let: { assign_to_agentString: "$assign_to_agent" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
                },
              },
            },
            {
              $project: {
                agent_name: 1,
              },
            },
          ],
          as: "agent_details",
        },
      },

      {
        $lookup: {
          from: "crm_product_services",
          let: { serviceString: "$service" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$serviceString" }],
                },
              },
            },
            {
              $project: {
                product_service_name: 1,
              },
            },
          ],
          as: "service_details",
        },
      },

      {
        $lookup: {
          from: "crm_statuses",
          let: { statusString: "$status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$statusString" }],
                },
              },
            },
            {
              $project: {
                status_name: 1,
              },
            },
          ],
          as: "status_details",
        },
      },

      {
        $lookup: {
          from: "crm_lead_sources",
          let: { lead_sourceString: "$lead_source" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                },
              },
            },
            {
              $project: {
                lead_source_name: 1,
              },
            },
          ],
          as: "lead_source_details",
        },
      },

      {
        $sort: {
          followup_date: 1,
        },
      },
    ]);

    if (lead.length == 0) {
      return next(new ErrorHander("Lead is not Avilable of This user", 201));
    }

    res.status(200).json({
      success: true,

      lead,
    });
  }
);

////////get All Lead According to Team Leader  
exports.getLeadbyTeamLeaderidandwithstatus = catchAsyncErrors(
  async (req, res, next) => {
    const { assign_to_agent } = req.body;
    if (!assign_to_agent) {
      return next(new ErrorHander("assign_to_agent is required..!", 404));
    }
    // const allAgents = await agent.find({ assigntl: assign_to_agent });
    const [agentsByAssigntl, agentsById] = await Promise.all([
      agent.find({ assigntl: assign_to_agent }),
      agent.find({ _id: assign_to_agent })
  ]);
  
  // Merge the results into a single array
  const allAgents = [...agentsByAssigntl, ...agentsById];
   
    if (allAgents.length < 1) {
      return next(new ErrorHander("No Lead..!", 404));
    }
    const matchConditions = {
      assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) }
    };
    const lead = await Lead.aggregate([
      {
        $match: matchConditions,
      },

      {
        $lookup: {
          from: "crm_agents",
          let: { assign_to_agentString: "$assign_to_agent" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
                },
              },
            },
            {
              $project: {
                agent_name: 1,
              },
            },
          ],
          as: "agent_details",
        },
      },

      {
        $lookup: {
          from: "crm_product_services",
          let: { serviceString: "$service" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$serviceString" }],
                },
              },
            },
            {
              $project: {
                product_service_name: 1,
              },
            },
          ],
          as: "service_details",
        },
      },

      {
        $lookup: {
          from: "crm_statuses",
          let: { statusString: "$status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$statusString" }],
                },
              },
            },
            {
              $project: {
                status_name: 1,
              },
            },
          ],
          as: "status_details",
        },
      },

      {
        $lookup: {
          from: "crm_lead_sources",
          let: { lead_sourceString: "$lead_source" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                },
              },
            },
            {
              $project: {
                lead_source_name: 1,
              },
            },
          ],
          as: "lead_source_details",
        },
      },

      {
        $sort: {
          followup_date: 1,
        },
      },
    ]);

    if (lead.length == 0) {
      return next(new ErrorHander("Lead is not Avilable of This user", 201));
    }

    res.status(200).json({
      success: true,
      lead,
    });
  }
);

////////get All Lead According to Team Leader  Without Won Loss Lead
exports.getLeadbyTeamLeaderidandwithoutstatus = catchAsyncErrors(
  async (req, res, next) => {
    const { assign_to_agent } = req.body;
    if (!assign_to_agent) {
      return next(new ErrorHander("assign_to_agent is required..!", 404));
    }
    // const allAgents = await agent.find({ assigntl: assign_to_agent });
    const [agentsByAssigntl, agentsById] = await Promise.all([
      agent.find({ assigntl: assign_to_agent }),
      agent.find({ _id: assign_to_agent })
  ]);
  
  // Merge the results into a single array
  const allAgents = [...agentsByAssigntl, ...agentsById];
    if (allAgents.length < 1) {
      return next(new ErrorHander("No Lead..!", 404));
    }
    const matchConditions = {
      assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) }
    };
    const lead = await Lead.aggregate([
      {
        $match: matchConditions,
      },

      {
        $lookup: {
          from: "crm_agents",
          let: { assign_to_agentString: "$assign_to_agent" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
                },
              },
            },
            {
              $project: {
                agent_name: 1,
              },
            },
          ],
          as: "agent_details",
        },
      },

      {
        $lookup: {
          from: "crm_product_services",
          let: { serviceString: "$service" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$serviceString" }],
                },
              },
            },
            {
              $project: {
                product_service_name: 1,
              },
            },
          ],
          as: "service_details",
        },
      },

      {
        $lookup: {
          from: "crm_statuses",
          let: { statusString: "$status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$statusString" }],
                },
              },
            },
            {
              $project: {
                status_name: 1,
              },
            },
          ],
          as: "status_details",
        },
      },

      {
        $lookup: {
          from: "crm_lead_sources",
          let: { lead_sourceString: "$lead_source" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                },
              },
            },
            {
              $project: {
                lead_source_name: 1,
              },
            },
          ],
          as: "lead_source_details",
        },
      },
      /////for  loss and won status remove
      {
        $match: {
          status: {
             $nin: [
              new ObjectId("65a904e04473619190494482"),
              new ObjectId("65a904ed4473619190494484"),
              new ObjectId("65a904fc4473619190494486")
            ],
          },
        },
      },

      {
        $sort: {
          followup_date: 1,
        },
      },
    ]);

    if (lead.length == 0) {
      return next(new ErrorHander("Lead is not Avilable of This user", 201));
    }

    res.status(200).json({
      success: true,
      lead,
    });
  }
);

///////get All ScheduleEvent Lead 
exports.getLeadbyScheduleEventid = catchAsyncErrors(
  async (req, res, next) => {
    const { assign_to_agent, status_id, role } = req.body;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    const formattedDate1 = currentDate.toISOString();
    const targetDate = new Date(formattedDate1);
    const targetDateOnly = new Date(targetDate.toISOString().split('T')[0]);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1); // Get next day from targetDate
    let matchConditions = {};
   
    if (role==='TeamLeader') {
    
        const [agentsByAssigntl, agentsById] = await Promise.all([
            agent.find({ assigntl: assign_to_agent }),
            agent.find({ _id: assign_to_agent })
        ]);
        const allAgents = [...agentsByAssigntl, ...agentsById];
        matchConditions.assign_to_agent = { $in: allAgents.map(agent => new ObjectId(agent._id)) };
    } else if (role==='user') {
        matchConditions.assign_to_agent = new ObjectId(assign_to_agent);
    }

    matchConditions.$or = [
        {
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
                    { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } }
                ]
            }
        },
        {
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
                    { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
                ]
            }
        }
    ];
    
    const lead = await Lead.aggregate([
      {
        $match: matchConditions,
      },
     
      {
        $lookup: {
          from: "crm_agents",
          let: { assign_to_agentString: "$assign_to_agent" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
                },
              },
            },
            {
              $project: {
                agent_name: 1,
              },
            },
          ],
          as: "agent_details",
        },
      },

      {
        $lookup: {
          from: "crm_product_services",
          let: { serviceString: "$service" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$serviceString" }],
                },
              },
            },
            {
              $project: {
                product_service_name: 1,
              },
            },
          ],
          as: "service_details",
        },
      },

      {
        $lookup: {
          from: "crm_statuses",
          let: { statusString: "$status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$statusString" }],
                },
              },
            },
            {
              $project: {
                status_name: 1,
              },
            },
          ],
          as: "status_details",
        },
      },

      {
        $lookup: {
          from: "crm_lead_sources",
          let: { lead_sourceString: "$lead_source" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                },
              },
            },
            {
              $project: {
                lead_source_name: 1,
              },
            },
          ],
          as: "lead_source_details",
        },
      },
      {
        $match: {
          status: new ObjectId(status_id),
           },
        
      },

      {
        $sort: {
          followup_date: 1,
        },
      },
    ]);

    if (lead.length == 0) {
      return next(new ErrorHander("Lead is not Avilable of This user", 201));
    }

    res.status(200).json({
      success: true,
      lead,
    });
  }
);


//// get Lead By Id

exports.getLeadById = catchAsyncErrors(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorHander("lead is not found"));
  } else {
    const leads = await Lead.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$_id", { $toObjectId: req.params.id }],
          },
        },
      },

      {
        $lookup: {
          from: "crm_agents",
          let: { assign_to_agentString: "$assign_to_agent" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
                },
              },
            },
            {
              $project: {
                agent_name: 1,
              },
            },
          ],
          as: "agent_details",
        },
      },

      {
        $lookup: {
          from: "crm_product_services",
          let: { serviceString: "$service" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$serviceString" }],
                },
              },
            },
            {
              $project: {
                product_service_name: 1,
              },
            },
          ],
          as: "service_details",
        },
      },

      {
        $lookup: {
          from: "crm_statuses",
          let: { statusString: "$status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$statusString" }],
                },
              },
            },
            {
              $project: {
                status_name: 1,
              },
            },
          ],
          as: "status_details",
        },
      },

      {
        $lookup: {
          from: "crm_lead_sources",
          let: { lead_sourceString: "$lead_source" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                },
              },
            },
            {
              $project: {
                lead_source_name: 1,
              },
            },
          ],
          as: "lead_source_details",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      leads,
    });
  }
});

/// delete all lead

exports.deleteAllLead = catchAsyncErrors(async (req, res, next) => {
  await Lead.deleteMany();
  res.status(200).json({
    success: true,
    message: "Delete All Lead Successfully",
  });
});

///// Bulk Lead assigne Update
exports.BulkLeadUpdate = catchAsyncErrors(async (req, res, next) => {
  const { leads, Leadagent, LeadStatus } = req.body;

  if (leads.length === 0) {
    return next(new ErrorHander("Please select leads", 404));
  }

  const updatePromises = leads.map(async (lead) => {
    const condition = { _id: lead };
    const update_data = {
      assign_to_agent: Leadagent?.agent,
      status: LeadStatus?.status,
      type:'followup',

    };
    return Lead.updateOne(condition, update_data);
  });

  // Wait for all updates to complete before sending the response
  await Promise.all(updatePromises);

  res.status(201).json({
    success: true,
    message: "Leads have been successfully updated",
  });
});
/////// Lead Transfer To Other Agent 
exports.LeadTransfer = catchAsyncErrors(async (req, res, next) => {

  const { totransfer, oftransfer } = req.body;
  const leads = await Lead.find({ assign_to_agent: oftransfer });
  if (leads.length === 0) {
    return next(new ErrorHander("Please select leads", 404));
  }
  const updatePromises = leads.map(async (lead) => {
    const condition = { _id: lead._id };
    const update_data = {
      assign_to_agent: totransfer,
    };
    return Lead.updateOne(condition, update_data);
  });

  // Wait for all updates to complete before sending the response
  await Promise.all(updatePromises);

  res.status(201).json({
    success: true,
    message: "Leads have been Transfer successfully..",
  });
});

/////// Advance Fillter sarch Api
exports.getAdvanceFillter = catchAsyncErrors(async (req, res, next) => {
  const { agent, Status, startDate, endDate, user_id, role } = req.body;


  if (role === 'admin') {
    const matchConditions = {};
    if (agent) {
      if (agent == 'Unassigne') {
        matchConditions.assign_to_agent = null;
      } else {
        const agentObjectId = new ObjectId(agent);
        matchConditions.assign_to_agent = agentObjectId;
      }
    }
    if (Status) {
      const StatusObjectId = new ObjectId(Status);
      matchConditions.status = StatusObjectId;
    }
    if (startDate && endDate) {
      matchConditions.followup_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const lead = await Lead.aggregate([
      {
        $lookup: {
          from: "crm_agents",
          let: { assign_to_agentString: "$assign_to_agent" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
                },
              },
            },
            {
              $project: {
                agent_name: 1,
              },
            },
          ],
          as: "agent_details",
        },
      },

      {
        $lookup: {
          from: "crm_product_services",
          let: { serviceString: "$service" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$serviceString" }],
                },
              },
            },
            {
              $project: {
                product_service_name: 1,
              },
            },
          ],
          as: "service_details",
        },
      },

      {
        $lookup: {
          from: "crm_statuses",
          let: { statusString: "$status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$statusString" }],
                },
              },
            },
            {
              $project: {
                status_name: 1,
              },
            },
          ],
          as: "status_details",
        },
      },

      {
        $lookup: {
          from: "crm_lead_sources",
          let: { lead_sourceString: "$lead_source" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                },
              },
            },
            {
              $project: {
                lead_source_name: 1,
              },
            },
          ],
          as: "lead_source_details",
        },
      },

      {
        $match: matchConditions,
      },

      {
        $sort: {
          followup_date: 1, // 1 for ascending(123) order, -1 for descending(321) order
        },
      },
    ]);
    res.status(200).json({
      success: true,
      lead,
    });
  }
  if (role === 'user') {
    const matchConditions = {};

    const agentObjectId = new ObjectId(user_id);
    matchConditions.assign_to_agent = agentObjectId;

    if (Status) {
      const StatusObjectId = new ObjectId(Status);
      matchConditions.status = StatusObjectId;
    }
    if (startDate && endDate) {
      matchConditions.followup_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const lead = await Lead.aggregate([
      {
        $lookup: {
          from: "crm_agents",
          let: { assign_to_agentString: "$assign_to_agent" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
                },
              },
            },
            {
              $project: {
                agent_name: 1,
              },
            },
          ],
          as: "agent_details",
        },
      },

      {
        $lookup: {
          from: "crm_product_services",
          let: { serviceString: "$service" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$serviceString" }],
                },
              },
            },
            {
              $project: {
                product_service_name: 1,
              },
            },
          ],
          as: "service_details",
        },
      },

      {
        $lookup: {
          from: "crm_statuses",
          let: { statusString: "$status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$statusString" }],
                },
              },
            },
            {
              $project: {
                status_name: 1,
              },
            },
          ],
          as: "status_details",
        },
      },

      {
        $lookup: {
          from: "crm_lead_sources",
          let: { lead_sourceString: "$lead_source" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                },
              },
            },
            {
              $project: {
                lead_source_name: 1,
              },
            },
          ],
          as: "lead_source_details",
        },
      },

      {
        $match: matchConditions,
      },

      {
        $sort: {
          followup_date: 1, // 1 for ascending(123) order, -1 for descending(321) order
        },
      },
    ]);
    res.status(200).json({
      success: true,
      lead,
    });
  }
  if (role === 'TeamLeader') {
    const matchConditions = {};
    if (!agent) {
      const allUsers = await Agentss.find({ assigntl: user_id });
      const users = allUsers.map(user => user?._id); // Extracting user IDs from the fetched users
      matchConditions.assign_to_agent = { $in: users };

    } else {
      if (agent == 'Unassigne') {
        matchConditions.assign_to_agent = null;
      } else {
        const agentObjectId = new ObjectId(agent);
        matchConditions.assign_to_agent = agentObjectId;
      }
    }



    if (Status) {
      const StatusObjectId = new ObjectId(Status);
      matchConditions.status = StatusObjectId;
    }
    if (startDate && endDate) {
      matchConditions.followup_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const lead = await Lead.aggregate([
      {
        $lookup: {
          from: "crm_agents",
          let: { assign_to_agentString: "$assign_to_agent" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
                },
              },
            },
            {
              $project: {
                agent_name: 1,
              },
            },
          ],
          as: "agent_details",
        },
      },

      {
        $lookup: {
          from: "crm_product_services",
          let: { serviceString: "$service" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$serviceString" }],
                },
              },
            },
            {
              $project: {
                product_service_name: 1,
              },
            },
          ],
          as: "service_details",
        },
      },

      {
        $lookup: {
          from: "crm_statuses",
          let: { statusString: "$status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$statusString" }],
                },
              },
            },
            {
              $project: {
                status_name: 1,
              },
            },
          ],
          as: "status_details",
        },
      },

      {
        $lookup: {
          from: "crm_lead_sources",
          let: { lead_sourceString: "$lead_source" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
                },
              },
            },
            {
              $project: {
                lead_source_name: 1,
              },
            },
          ],
          as: "lead_source_details",
        },
      },

      {
        $match: matchConditions,
      },

      {
        $sort: {
          followup_date: 1, // 1 for ascending(123) order, -1 for descending(321) order
        },
      },
    ]);
    res.status(200).json({
      success: true,
      lead,
    });
  }



});

//////  Bulk Excel Uplode
 
exports.BulkLeadUplodeExcel = catchAsyncErrors(async (req, res, next) => {
  try {
    const fileBuffer = req.file.buffer;
    const leadSheet = xlsx.read(fileBuffer, { type: "buffer" }).Sheets["Lead"];
    const leadData = xlsx.utils.sheet_to_json(leadSheet);
    console.log(leadData);
    res
      .status(200)
      .json({ success: true, message: "Leads uploaded successfully" });
  } catch (error) {
    console.error("Error uploading leads:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

exports.BulkDeleteLead = catchAsyncErrors(async (req, res, next) => {
  const leadIds = req.body.ids; // Assuming you send an array of lead _id values in the request body

  const result = await Lead.deleteMany({ _id: { $in: leadIds } });
  res.status(200).json({
    success: true,
    message: "Lead Has Been Deleted",
  });
});

///////// lead Edit
exports.UpdateLeadByLeadId = catchAsyncErrors(async (req, res, next) => {
  let lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new ErrorHander("Lead Not Found"));
  }

  lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Lead Update Successfully",
    lead,
  });
});



////////// Lead Attechment History
exports.leadattechmenthistory = catchAsyncErrors(async (req, res, next) => {
  const lead = await LeadAttechment.find({ lead_id: req.params.id });
  if (!lead) {
    return next(new ErrorHander("lead is not found"));
  }
  res.status(200).json({
    success: true,
    message: "lead  Has Been Get Successfully",
    lead
  })

})

////////// Lead Attechment History Delete

exports.deleteLeadAttechmentHistory = catchAsyncErrors(async (req, res, next) => {
  const lead = await LeadAttechment.find({ _id: req.params.id });
  if (!lead) {
    return next(new ErrorHander("lead is not found"));
  }
  await LeadAttechment.deleteOne();
  res.status(200).json({
    success: true,
    message: "lead  Has Been Delete Successfully",
    lead
  })
});

//////////  User Wish Active Lead 
exports.ActiveLeadUserWish = catchAsyncErrors(async (req, res, next) => {

});



/////// getAllUnassignLead sarch Api
exports.getAllUnassignLead = catchAsyncErrors(async (req, res, next) => {
  const matchConditions = {};
  matchConditions.assign_to_agent = null;


  const lead = await Lead.aggregate([
    {
      $lookup: {
        from: "crm_agents",
        let: { assign_to_agentString: "$assign_to_agent" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$assign_to_agentString" }],
              },
            },
          },
          {
            $project: {
              agent_name: 1,
            },
          },
        ],
        as: "agent_details",
      },
    },

    {
      $lookup: {
        from: "crm_product_services",
        let: { serviceString: "$service" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$serviceString" }],
              },
            },
          },
          {
            $project: {
              product_service_name: 1,
            },
          },
        ],
        as: "service_details",
      },
    },

    {
      $lookup: {
        from: "crm_statuses",
        let: { statusString: "$status" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$statusString" }],
              },
            },
          },
          {
            $project: {
              status_name: 1,
            },
          },
        ],
        as: "status_details",
      },
    },

    {
      $lookup: {
        from: "crm_lead_sources",
        let: { lead_sourceString: "$lead_source" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$lead_sourceString" }],
              },
            },
          },
          {
            $project: {
              lead_source_name: 1,
            },
          },
        ],
        as: "lead_source_details",
      },
    },

    {
      $match: matchConditions,
    },

    {
      $sort: {
        followup_date: 1, // 1 for ascending(123) order, -1 for descending(321) order
      },
    },
  ]);

  res.status(200).json({
    success: true,
    lead,
  });
});
