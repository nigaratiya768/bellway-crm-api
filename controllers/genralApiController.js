const Lead = require("../models/leadModel");
const agent = require("../models/agentModel");
const FollowupLead = require("../models/followupModel");
const lead_status = require("../models/statusModel");
const Status = require('../models/statusModel');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const { param } = require("../app");
const leadsourceModel = require("../models/leadsourceModel");
const Setting = require('../models/settingModel');
const { Agent } = require("express-useragent");
const wtspmessageModel = require("../models/wtspmessageModel");
const { ObjectId } = require('mongoose').Types;
const Notification=require("../models/notificationModel");
const FCM = require("fcm-node");
const serverKey = "AAAAnus9Ao0:APA91bGCHcEiRwMsFRbsnN8od663jhfhdnuq10H2jMMmFzVrCVBACE4caGSZ-mAwf3VB6n_fUmrHxKPou1oyBaKXfUfcnAz6J2TTJm12woXqJVTleay2RSE0KPzuRTI2QppI3rrYY2HQ"; // Replace with your actual server key
const fcm = new FCM(serverKey);

///////// RealestateApi
exports.RealestateApi = catchAsyncErrors(async (req, res, next) => {
  const { email, name, mobile, inquiry_id, subject, details, property_id, recv_date, lookinf_for } = req.body;


  const lead = await Lead.create({
    full_name: name,
    email_id: email,
    lead_source: '65fd17a3d02e1071c601efc0',
    contact_no: mobile,
    service: '65f01532ca9cacbc217ccdfe',
    status: '65a90407447361919049447e',
    description: subject + ' ' + details + ' ' + lookinf_for,
    apartment_names: lookinf_for,
    service_type: inquiry_id,
    flat_id: property_id,
    lead_date: recv_date,
  });
  res.status(200).json({
    success: true,
    message: "Save Realestate Lead On This Route",
    data: lead
  });
});

///////// MagicbricksApi
exports.MagicbricksApi = catchAsyncErrors(async (req, res, next) => {
  const { email, name, mobile, inquiry_id, subject, details, property_id, recv_date, lookinf_for } = req.body;


  const lead = await Lead.create({
    full_name: name,
    email_id: email,
    lead_source: '665815bd0a83c253e02177e3',
    contact_no: mobile,
    // service: '65f01532ca9cacbc217ccdfe',
    status: '65a904fc4473619190494486',
    description: subject + ' ' + details + ' ' + lookinf_for,
    apartment_names: lookinf_for,
    service_type: inquiry_id,
    flat_id: property_id,
    lead_date: recv_date,
  });
  res.status(200).json({
    success: true,
    message: "Save Realestate Lead On This Route",
    data: lead
  });
});

//////// 99AcresApi
exports.AcresApi = catchAsyncErrors(async (req, res, next) => {
  const { email, name, mobile, inquiry_id, subject, details, property_id, recv_date, lookinf_for } = req.body;


  const lead = await Lead.create({
    full_name: name,
    email_id: email,
    lead_source: '665815b20a83c253e02177e1',
    contact_no: mobile,
    // service: '65f01532ca9cacbc217ccdfe',
    status: '65a904fc4473619190494486',
    description: subject + ' ' + details + ' ' + lookinf_for,
    apartment_names: lookinf_for,
    service_type: inquiry_id,
    flat_id: property_id,
    lead_date: recv_date,
  });
  res.status(200).json({
    success: true,
    message: "Save Realestate Lead On This Route",
    data: lead
  });
});  

///////// wtsp notification api
exports.bwnotification = catchAsyncErrors(async (req, res, next) => {

  const { fromphone, message, fromname } = req.query;
  const wtspmessage = await wtspmessageModel.create({
    fromname: fromname,
    fromphone: fromphone,
    message: message,
  });

  const tokentable = await Notification.find({ user_id: '65a8eee17dd25ded3ca0fb99' });
 const token = tokentable ? tokentable[0].token : null;

  if (!message) {
    message = message;
  }

  const notificationData = {
    collapse_key: "your_collapse_key",
    notification: {
      title: fromname +' '+'(Business WA)',
      body: message,
      icon:"https://www.clickpro.in/img/notificationicon.jpg"
    },
    data: {
      my_key: "my value",
      my_another_key: "my another value",
    },
  };

  if (token) {
    notificationData.to = token;
    fcm.send(notificationData, function (err, response) {
      if (err) {
        console.error("Error sending notification:", err);
      } else {
        console.log("Notification sent successfully:", response);
      }
    });
  } else {
    console.log('Token not found for agent:', agent_id);
  } 

  res.status(200).json({
    success: true,
    message: "Get a message",
    data: wtspmessage,
  });
})
//////// get All Businesswtsp message
exports.Businesswtspmessage = catchAsyncErrors(async (req, res, next) => {
  const wtspmessage = await wtspmessageModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: wtspmessage,  
  }); 
})



//// Income Graph Overview For Admin

exports.IncomeGraphOverview = catchAsyncErrors(async (req, res, next) => {
  const wonstatu = await lead_status.find({ status_name: "Won" });

  const wonStatus_id = wonstatu["0"]._id;
  const monthlyIncom = [];
  ////// for jan
  let total1 = 0;
  const lead1 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        1, // November
      ],
    },
  });
  lead1.map((lead11) => {
    total1 += parseInt(lead11.followup_won_amount);
  });
  monthlyIncom.push(total1);
  //// for fav
  let total12 = 0;
  const lead2 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        2, // November
      ],
    },
  });
  lead2.map((lead22) => {
    total12 += parseInt(lead22.followup_won_amount);
  });
  monthlyIncom.push(total12);

  /// mar
  let total13 = 0;
  const lead3 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        3,
      ],
    },
  });
  lead3.map((lead33) => {
    total13 += parseInt(lead33.followup_won_amount);
  });
  monthlyIncom.push(total13);

  /// apirl
  let total14 = 0;
  const lead4 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        4, // November
      ],
    },
  });
  lead4.map((lead44) => {
    total14 += parseInt(lead44.followup_won_amount);
  });
  monthlyIncom.push(total14);

  ////// may

  let total15 = 0;
  const lead5 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        5, // November
      ],
    },
  });
  lead5.map((lead55) => {
    total15 += parseInt(lead55.followup_won_amount);
  });
  monthlyIncom.push(total15);
  // june

  let total16 = 0;
  const lead6 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        6, // November
      ],
    },
  });
  lead6.map((lead66) => {
    total16 += parseInt(lead66.followup_won_amount);
  });
  monthlyIncom.push(total16);

  //// july
  let total17 = 0;
  const lead7 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        7, // November
      ],
    },
  });
  lead7.map((lead77) => {
    total17 += parseInt(lead77.followup_won_amount);
  });
  monthlyIncom.push(total17);

  // august
  let total18 = 0;
  const lead8 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        8, // November
      ],
    },
  });
  lead8.map((lead88) => {
    total18 += parseInt(lead88.followup_won_amount);
  });
  monthlyIncom.push(total18);
  /// setember

  let total19 = 0;
  const lead9 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        9, // November
      ],
    },
  });
  lead9.map((lead99) => {
    total19 += parseInt(lead99.followup_won_amount);
  });
  monthlyIncom.push(total19);
  //octuber
  let total110 = 0;
  const lead10 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        10, // November
      ],
    },
  });
  lead10.map((lead1010) => {
    total110 += parseInt(lead1010.followup_won_amount);
  });
  monthlyIncom.push(total110);
  /// nomber
  let total111 = 0;
  const lead111 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        11, // November
      ],
    },
  });
  lead111.map((lead1111) => {
    total111 += parseInt(lead1111.followup_won_amount);
  });
  monthlyIncom.push(total111);
  /// december

  let total1112 = 0;
  const lead1112 = await Lead.find({
    status: wonStatus_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        12, // November
      ],
    },
  });
  lead1112.map((lead11112) => {
    total1112 += parseInt(lead11112.followup_won_amount);
  });
  monthlyIncom.push(total1112);

  res.status(201).json({
    success: true,
    message: "Successfully Leads Source Overview",
    monthlyIncom,
  });
});

//// Income Graph Overview For User

exports.IncomeGraphOverviewForUser = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.body;
  const wonstatu = await lead_status.find({ status_name: "Won" });

  const wonStatus_id = wonstatu["0"]._id;
  const monthlyIncom = [];
  ////// for jan
  let total1 = 0;
  const lead1 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        1, // November
      ],
    },
  });
  lead1.map((lead11) => {
    total1 += parseInt(lead11.followup_won_amount);
  });
  monthlyIncom.push(total1);
  //// for fav
  let total12 = 0;
  const lead2 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        2, // November
      ],
    },
  });
  lead2.map((lead22) => {
    total12 += parseInt(lead22.followup_won_amount);
  });
  monthlyIncom.push(total12);

  /// mar
  let total13 = 0;
  const lead3 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        3,
      ],
    },
  });
  lead3.map((lead33) => {
    total13 += parseInt(lead33.followup_won_amount);
  });
  monthlyIncom.push(total13);

  /// apirl
  let total14 = 0;
  const lead4 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        4, // November
      ],
    },
  });
  lead4.map((lead44) => {
    total14 += parseInt(lead44.followup_won_amount);
  });
  monthlyIncom.push(total14);

  ////// may

  let total15 = 0;
  const lead5 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        5, // November
      ],
    },
  });
  lead5.map((lead55) => {
    total15 += parseInt(lead55.followup_won_amount);
  });
  monthlyIncom.push(total15);
  // june

  let total16 = 0;
  const lead6 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        6, // November
      ],
    },
  });
  lead6.map((lead66) => {
    total16 += parseInt(lead66.followup_won_amount);
  });
  monthlyIncom.push(total16);

  //// july
  let total17 = 0;
  const lead7 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        7, // November
      ],
    },
  });
  lead7.map((lead77) => {
    total17 += parseInt(lead77.followup_won_amount);
  });
  monthlyIncom.push(total17);

  // august
  let total18 = 0;
  const lead8 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        8, // November
      ],
    },
  });
  lead8.map((lead88) => {
    total18 += parseInt(lead88.followup_won_amount);
  });
  monthlyIncom.push(total18);
  /// setember

  let total19 = 0;
  const lead9 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        9, // November
      ],
    },
  });
  lead9.map((lead99) => {
    total19 += parseInt(lead99.followup_won_amount);
  });
  monthlyIncom.push(total19);
  //octuber
  let total110 = 0;
  const lead10 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        10, // November
      ],
    },
  });
  lead10.map((lead1010) => {
    total110 += parseInt(lead1010.followup_won_amount);
  });
  monthlyIncom.push(total110);
  /// nomber
  let total111 = 0;
  const lead111 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        11, // November
      ],
    },
  });
  lead111.map((lead1111) => {
    total111 += parseInt(lead1111.followup_won_amount);
  });
  monthlyIncom.push(total111);
  /// december

  let total1112 = 0;
  const lead1112 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: user_id,
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        12, // November
      ],
    },
  });
  lead1112.map((lead11112) => {
    total1112 += parseInt(lead11112.followup_won_amount);
  });
  monthlyIncom.push(total1112);

  res.status(201).json({
    success: true,
    message: "Successfully Leads Source Overview",
    monthlyIncom,
  });
});

//// Income Graph Overview For TeamLeader

exports.IncomeGraphOverviewForTeamLeader = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.body;
  const agents = await agent.find({ assigntl: user_id }).select('_id');
  const agentIds = agents.map(agent => agent._id);

  const wonstatu = await lead_status.find({ status_name: "Won" });

  const wonStatus_id = wonstatu["0"]._id;
  const monthlyIncom = [];
  ////// for jan
  let total1 = 0;
  const lead1 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        1, // November
      ],
    },
  });
  lead1.map((lead11) => {
    total1 += parseInt(lead11.followup_won_amount);
  });
  monthlyIncom.push(total1);
  //// for fav
  let total12 = 0;
  const lead2 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        2, // November
      ],
    },
  });
  lead2.map((lead22) => {
    total12 += parseInt(lead22.followup_won_amount);
  });
  monthlyIncom.push(total12);

  /// mar
  let total13 = 0;
  const lead3 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        3,
      ],
    },
  });
  lead3.map((lead33) => {
    total13 += parseInt(lead33.followup_won_amount);
  });
  monthlyIncom.push(total13);

  /// apirl
  let total14 = 0;
  const lead4 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        4, // November
      ],
    },
  });
  lead4.map((lead44) => {
    total14 += parseInt(lead44.followup_won_amount);
  });
  monthlyIncom.push(total14);

  ////// may

  let total15 = 0;
  const lead5 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        5, // November
      ],
    },
  });
  lead5.map((lead55) => {
    total15 += parseInt(lead55.followup_won_amount);
  });
  monthlyIncom.push(total15);
  // june

  let total16 = 0;
  const lead6 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        6, // November
      ],
    },
  });
  lead6.map((lead66) => {
    total16 += parseInt(lead66.followup_won_amount);
  });
  monthlyIncom.push(total16);

  //// july
  let total17 = 0;
  const lead7 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        7, // November
      ],
    },
  });
  lead7.map((lead77) => {
    total17 += parseInt(lead77.followup_won_amount);
  });
  monthlyIncom.push(total17);

  // august
  let total18 = 0;
  const lead8 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        8, // November
      ],
    },
  });
  lead8.map((lead88) => {
    total18 += parseInt(lead88.followup_won_amount);
  });
  monthlyIncom.push(total18);
  /// setember

  let total19 = 0;
  const lead9 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        9, // November
      ],
    },
  });
  lead9.map((lead99) => {
    total19 += parseInt(lead99.followup_won_amount);
  });
  monthlyIncom.push(total19);
  //octuber
  let total110 = 0;
  const lead10 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        10, // November
      ],
    },
  });
  lead10.map((lead1010) => {
    total110 += parseInt(lead1010.followup_won_amount);
  });
  monthlyIncom.push(total110);
  /// nomber
  let total111 = 0;
  const lead111 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        11, // November
      ],
    },
  });
  lead111.map((lead1111) => {
    total111 += parseInt(lead1111.followup_won_amount);
  });
  monthlyIncom.push(total111);
  /// december

  let total1112 = 0;
  const lead1112 = await Lead.find({
    status: wonStatus_id,
    assign_to_agent: { $in: agentIds },
    $expr: {
      $eq: [
        { $month: "$followup_date" }, // Replace 'yourDateField' with the actual field name
        12, // November
      ],
    },
  });
  lead1112.map((lead11112) => {
    total1112 += parseInt(lead11112.followup_won_amount);
  });
  monthlyIncom.push(total1112);

  res.status(201).json({
    success: true,
    message: "Successfully Leads Source Overview",
    monthlyIncom,
  });
});
////for Admin
exports.GetCalandarData = catchAsyncErrors(async (req, res, next) => {

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
      $match: {
        add_to_calender: 'yes'
      },
    },

  ])

  res.status(201).json({
    success: true,
    message: "Successfully Get Calandar Data",
    lead,
  });
});
////for Teamleader
exports.GetCalandarDataByTeamLeader = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.body;

  // Execute both queries concurrently
  const [agentsByAssigntl, agentsById] = await Promise.all([
    agent.find({ assigntl: user_id }).select('_id'),
    agent.find({ _id: user_id }).select('_id'),
  ]);

  // Merge the results into a single array
  const allAgents = [...agentsByAssigntl, ...agentsById];

  const agentIds = allAgents.map(agent => agent._id); // Use allAgents instead of agents

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
      $match: {
        add_to_calender: 'yes',
        assign_to_agent: { $in: agentIds }, // Use agentIds here
      },
    },
  ]);

  res.status(201).json({
    success: true,
    message: "Successfully Get Calandar Data",
    lead,
  });
});

////for User 
exports.GetCalandarDataByUser = catchAsyncErrors(async (req, res, next) => {
  const user_id = new ObjectId(req.body.user_id);
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
      $match: {
        add_to_calender: 'yes',
        assign_to_agent: user_id
      },
    },

  ])

  res.status(201).json({
    success: true,
    message: "Successfully Get Calandar Data",
    lead,
  });
});



/////// Yearly Base Sale Api For Admin
exports.YearlySaleApi = catchAsyncErrors(async (req, res, next) => {
  try {
    const details = [];
    let TotalAmountWon = 0;
    let TotalAmountLost = 0;
    let TotalAmountwonmanthely = 0;
    const andialTimezoneOffset = 5 * 60 * 60 * 1000 // Offset in milliseconds
    const andialTimezoneOffset1 = 30 * 60 * 1000 // Offset in milliseconds
    const currentDate = new Date();
    const currentUTCTime = Date.now();
    const andialTime = new Date(currentUTCTime + (andialTimezoneOffset + andialTimezoneOffset1));

    const ThirtyDaysAgoDate = new Date();
    ThirtyDaysAgoDate.setDate(ThirtyDaysAgoDate.getDate() - 30);
    const formattedThirtyDaysAgoDate = ThirtyDaysAgoDate.toISOString();

    const wonstatu = await lead_status.findOne({ status_name: "Won" });
    const loststatu = await lead_status.findOne({ status_name: "Lost" });
    const wonStatus_id = wonstatu._id;
    const lostStatus_id = loststatu._id;

    const wonlead = await Lead.find({ status: wonStatus_id });
    const lostlead = await Lead.find({ status: lostStatus_id });

    const wonleadforthirtyday = await Lead.find({
      status: wonStatus_id,
      followup_date: { $gte: formattedThirtyDaysAgoDate, $lte: andialTime },
    });

    const Yearly_lead_count_won = wonlead.length;
    const Yearly_lead_count_Lost = lostlead.length;
    const wonleadforthirtyday_count_lead = wonleadforthirtyday.length;


    TotalAmountWon = wonlead.reduce((total, lead) => total + parseInt(lead.followup_won_amount), 0);
    TotalAmountLost = lostlead.reduce((total, lead) => total + parseInt(lead.lead_cost), 0);
    TotalAmountwonmanthely = wonleadforthirtyday.reduce((total, lead) => total + parseInt(lead.followup_won_amount), 0);

    details.push({
      Yearly_lead_count_for_won: Yearly_lead_count_won,
      Yearly_lead_count_Lost: Yearly_lead_count_Lost,
      TotalAmountWon: TotalAmountWon,
      TotalAmountLost: TotalAmountLost,
      wonleadforthirtyday_count_lead: wonleadforthirtyday_count_lead,
      TotalAmountwonmanthely: TotalAmountwonmanthely,
    });

    res.status(201).json({
      success: true,
      message: "Successfully Get Data",
      details,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/////// Yearly Base Sale Api For TeamLeader
exports.YearlySaleApiForTeamLeader = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.body;
  const [agentsByAssigntl, agentsById] = await Promise.all([
    agent.find({ assigntl: user_id }).select('_id'),
    agent.find({ _id: user_id }).select('_id'),
  ]);

  // Merge the results into a single array
  const allAgents = [...agentsByAssigntl, ...agentsById];

  const agentIds = allAgents.map(agent => agent._id); // Use allAgents instead of agents
  try {
    const details = [];
    let TotalAmountWon = 0;
    let TotalAmountLost = 0;
    let TotalAmountwonmanthely = 0;
    const andialTimezoneOffset = 5 * 60 * 60 * 1000 // Offset in milliseconds
    const andialTimezoneOffset1 = 30 * 60 * 1000 // Offset in milliseconds
    const currentDate = new Date();
    const currentUTCTime = Date.now();
    const andialTime = new Date(currentUTCTime + (andialTimezoneOffset + andialTimezoneOffset1));

    const ThirtyDaysAgoDate = new Date();
    ThirtyDaysAgoDate.setDate(ThirtyDaysAgoDate.getDate() - 30);
    const formattedThirtyDaysAgoDate = ThirtyDaysAgoDate.toISOString();

    const wonstatu = await lead_status.findOne({ status_name: "Won" });
    const loststatu = await lead_status.findOne({ status_name: "Lost" });
    const wonStatus_id = wonstatu._id;
    const lostStatus_id = loststatu._id;

    const wonlead = await Lead.find({ status: wonStatus_id, assign_to_agent: { $in: agentIds } });
    const lostlead = await Lead.find({ status: lostStatus_id, assign_to_agent: { $in: agentIds } });

    const wonleadforthirtyday = await Lead.find({
      status: wonStatus_id,
      assign_to_agent: { $in: agentIds },
      followup_date: { $gte: formattedThirtyDaysAgoDate, $lte: andialTime },
    });

    const Yearly_lead_count_won = wonlead.length;
    const Yearly_lead_count_Lost = lostlead.length;
    const wonleadforthirtyday_count_lead = wonleadforthirtyday.length;


    TotalAmountWon = wonlead.reduce((total, lead) => total + parseInt(lead.followup_won_amount), 0);
    TotalAmountLost = lostlead.reduce((total, lead) => total + parseInt(lead.lead_cost), 0);
    TotalAmountwonmanthely = wonleadforthirtyday.reduce((total, lead) => total + parseInt(lead.followup_won_amount), 0);

    details.push({
      Yearly_lead_count_for_won: Yearly_lead_count_won,
      Yearly_lead_count_Lost: Yearly_lead_count_Lost,
      TotalAmountWon: TotalAmountWon,
      TotalAmountLost: TotalAmountLost,
      wonleadforthirtyday_count_lead: wonleadforthirtyday_count_lead,
      TotalAmountwonmanthely: TotalAmountwonmanthely,
    });

    res.status(201).json({
      success: true,
      message: "Successfully Get Data",
      details,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/////// Yearly Base Sale Api For User
exports.YearlySaleApiForUser = catchAsyncErrors(async (req, res, next) => {
  const user_id = new ObjectId(req.body.user_id);
  try {
    const details = [];
    let TotalAmountWon = 0;
    let TotalAmountLost = 0;
    let TotalAmountwonmanthely = 0;
    const andialTimezoneOffset = 5 * 60 * 60 * 1000 // Offset in milliseconds
    const andialTimezoneOffset1 = 30 * 60 * 1000 // Offset in milliseconds
    const currentDate = new Date();
    const currentUTCTime = Date.now();
    const andialTime = new Date(currentUTCTime + (andialTimezoneOffset + andialTimezoneOffset1));

    const ThirtyDaysAgoDate = new Date();
    ThirtyDaysAgoDate.setDate(ThirtyDaysAgoDate.getDate() - 30);
    const formattedThirtyDaysAgoDate = ThirtyDaysAgoDate.toISOString();

    const wonstatu = await lead_status.findOne({ status_name: "Won" });
    const loststatu = await lead_status.findOne({ status_name: "Lost" });
    const wonStatus_id = wonstatu._id;
    const lostStatus_id = loststatu._id;

    const wonlead = await Lead.find({ status: wonStatus_id, assign_to_agent: user_id });
    const lostlead = await Lead.find({ status: lostStatus_id, assign_to_agent: user_id });

    const wonleadforthirtyday = await Lead.find({
      status: wonStatus_id,
      assign_to_agent: user_id,
      followup_date: { $gte: formattedThirtyDaysAgoDate, $lte: andialTime },
    });

    const Yearly_lead_count_won = wonlead.length;
    const Yearly_lead_count_Lost = lostlead.length;
    const wonleadforthirtyday_count_lead = wonleadforthirtyday.length;


    TotalAmountWon = wonlead.reduce((total, lead) => total + parseInt(lead.followup_won_amount), 0);
    TotalAmountLost = lostlead.reduce((total, lead) => total + parseInt(lead.lead_cost), 0);
    TotalAmountwonmanthely = wonleadforthirtyday.reduce((total, lead) => total + parseInt(lead.followup_won_amount), 0);

    details.push({
      Yearly_lead_count_for_won: Yearly_lead_count_won,
      Yearly_lead_count_Lost: Yearly_lead_count_Lost,
      TotalAmountWon: TotalAmountWon,
      TotalAmountLost: TotalAmountLost,
      wonleadforthirtyday_count_lead: wonleadforthirtyday_count_lead,
      TotalAmountwonmanthely: TotalAmountwonmanthely,
    });

    res.status(201).json({
      success: true,
      message: "Successfully Get Data",
      details,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/////  Leads Source Overview  Api For Admin
exports.LeadSourceOverviewApi = catchAsyncErrors(async (req, res, next) => {
  try {
    const lead_source = await leadsourceModel.find();

    const Lead_source_id = lead_source.map((lead_source1) => lead_source1._id);
    const Lead_source_name = lead_source.map((lead_source1) => lead_source1.lead_source_name);

    const Lead_source_countPromises = Lead_source_id.map(async (Lead_source_id1) => {
      const lead = await Lead.find({ lead_source: Lead_source_id1 });
      const lead_length = lead.length;

      return lead_length;
    });

    const Lead_source_count = await Promise.all(Lead_source_countPromises);

    res.status(201).json({
      success: true,
      message: "Successfully Leads Source Overview",
      Lead_source_count,
      Lead_source_name,
      Lead_source_id,
    });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/////  Leads Source Overview  Api For TeamLeader
exports.LeadSourceOverviewApiForTeamLeader = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.body;
  const [agentsByAssigntl, agentsById] = await Promise.all([
    agent.find({ assigntl: user_id }).select('_id'),
    agent.find({ _id: user_id }).select('_id'),
  ]);

  // Merge the results into a single array
  const allAgents = [...agentsByAssigntl, ...agentsById];

  const agentIds = allAgents.map(agent => agent._id); // Use allAgents instead of agents
  try {
    const lead_source = await leadsourceModel.find();

    const Lead_source_id = lead_source.map((lead_source1) => lead_source1._id);
    const Lead_source_name = lead_source.map((lead_source1) => lead_source1.lead_source_name);

    const Lead_source_countPromises = Lead_source_id.map(async (Lead_source_id1) => {
      const lead = await Lead.find({ lead_source: Lead_source_id1, assign_to_agent: { $in: agentIds } });
      const lead_length = lead.length;

      return lead_length;
    });

    const Lead_source_count = await Promise.all(Lead_source_countPromises);

    res.status(201).json({
      success: true,
      message: "Successfully Leads Source Overview",
      Lead_source_count,
      Lead_source_name,
      Lead_source_id,
    });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/////  Leads Source Overview  Api For User
exports.LeadSourceOverviewApiForUser = catchAsyncErrors(async (req, res, next) => {
  const user_id = new ObjectId(req.body.user_id);
  try {
    const lead_source = await leadsourceModel.find();

    const Lead_source_id = lead_source.map((lead_source1) => lead_source1._id);
    const Lead_source_name = lead_source.map((lead_source1) => lead_source1.lead_source_name);

    const Lead_source_countPromises = Lead_source_id.map(async (Lead_source_id1) => {
      const lead = await Lead.find({ lead_source: Lead_source_id1, assign_to_agent: user_id });
      const lead_length = lead.length;

      return lead_length;
    });

    const Lead_source_count = await Promise.all(Lead_source_countPromises);

    res.status(201).json({
      success: true,
      message: "Successfully Leads Source Overview",
      Lead_source_count,
      Lead_source_name,
      Lead_source_id,
    });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});



//////// Company Information Setting
exports.CompanyDetails = catchAsyncErrors(async (req, res, next) => {
  const existingSettings = await Setting.find();

  if (existingSettings.length > 0) {
    // If settings exist, update them
    const updateResult = await Setting.updateOne({}, req.body);

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Information Updated Successfully",
        setting: req.body, // Assuming you want to send the updated settings in the response
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No changes made. Information remains the same.",
      });
    }
  } else {
    // If no settings exist, create new settings
    const newSetting = await Setting.create(req.body);

    res.status(201).json({
      success: true,
      message: "Information Added Successfully",
      setting: newSetting,
    });
  }
});

exports.GetCompanyDetails = catchAsyncErrors(async (req, res, next) => {
  const existingSettings = await Setting.find();
  if (!existingSettings) {
    return next(new ErrorHander("Details not found!...", 404));
  }
  res.status(200).json({
    success: true,
    message: "Details found Successfully.",
    setting: existingSettings,
  });
})




///////// UnAssigned Lead Count In Case Of Admin
exports.UnAssignedDashboardLeadCount = catchAsyncErrors(async (req, res, next) => {
  let array = [];
  const lead = await Lead.find({ assign_to_agent: null });
  const TotalLead = lead.length;

  array.push(
    { ['name']: 'UnAssigned Lead', ['Value']: TotalLead },
  );
  res.status(201).json({
    success: true,
    message: "Get Lead Count Successfully",
    Count: array,
  });
});



// Assuming 'agent' and 'Lead' are imported correctly

exports.AgentWishLeadCount = catchAsyncErrors(async (req, res, next) => {
  try {

    const agents = await agent.find({ role: 'user' });
    const array = [];

    for (const agent1 of agents) {
      const leads = await Lead.find({ assign_to_agent: agent1?._id });
      array.push({ 'name': agent1?.agent_name, 'Value': leads?.length });
    }

    res.status(201).json({
      success: true,
      message: "Get Lead Count Successfully",
      Count: array,
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
});

exports.AgentWishLeadCount1 = catchAsyncErrors(async (req, res, next) => {
  try {
    const { role, user_id } = req.body;
    let agents = [];

    // Fetch agents based on role
    if (role === 'user') {
      agents = await agent.find({ role: 'user', _id: user_id });
    } else if (role === 'admin') {
      agents = await agent.find({ role: 'user' });
    } else if (role === 'TeamLeader') {
      agents = await agent.find({ role: 'user', assigntl: user_id });
    }

    const array = [];

    // Fetch lead counts for each agent
    for (const agent1 of agents) {
      const leads = await Lead.find({ assign_to_agent: agent1._id });
      array.push({ 'name': agent1.agent_name, 'Value': leads.length });
    }

    res.status(201).json({
      success: true,
      message: "Get Lead Count Successfully",
      Count: array,
    });
  } catch (error) {
    // Specific error handling for database queries
    console.error("Error fetching lead count:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lead count" });
  }
});


///////// dashboard data for lead type  In Case Of Admin
exports.DashboardLeadCount = catchAsyncErrors(async (req, res, next) => {
  let array = [];
  const lead = await Lead.find();
  const TotalLead = lead.length;
  const Agent = await agent.find();
  const TotalAgent = Agent.length;
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 5);
  currentDate.setMinutes(currentDate.getMinutes() + 30);
  const formattedDate1 = currentDate.toISOString();
  const targetDate = new Date(formattedDate1);
  const targetDateOnly = new Date(targetDate.toISOString().split('T')[0]);
  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1); // Get next day from targetDate
  ///// for Followup Lead count
  const followuplead = await Lead.find({

    status: {
      $nin: [
        new ObjectId("65a904e04473619190494482"),
        new ObjectId("65a904ed4473619190494484")
      ],
    },

  });


  ///// for meeting
  const meetinglead = await Lead.find({
    status: '65a904164473619190494480',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const meetingleadNextDay = await Lead.find({
    status: '65a904164473619190494480',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });

  const meetinglead_name = await Status.findOne({ _id: '65a904164473619190494480' });
  ///// for Call Back (Visit)
  const Visit = await Lead.find({
    status: '65a903f8447361919049447c',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const VisitleadNextDay = await Lead.find({
    status: '65a903f8447361919049447c',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });
  const Visit_name = await Status.findOne({ _id: '65a903f8447361919049447c' });

  ///// for Call Back (Re-Visit)
  const Re_Visit = await Lead.find({
    status: '65a903ca4473619190494478',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const Re_VisitleadNextDay = await Lead.find({
    status: '65a903ca4473619190494478',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });
  const Re_Visit_name = await Status.findOne({ _id: '65a903ca4473619190494478' });
  ///// for Call Back (Re-Visit)
  const Shedule_Visit = await Lead.find({
    status: '65a903e9447361919049447a',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const Shedule_VisitleadNextDay = await Lead.find({
    status: '65a903e9447361919049447a',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });
  const Shedule_Visit_name = await Status.findOne({ _id: '65a903e9447361919049447a' });
  array.push(
    { ['name']: 'Followup Lead', ['Value']: followuplead.length },
    { ['name']: 'Total Agent', ['Value']: TotalAgent },
    {
      ['name']: meetinglead_name?.status_name1, ['Value']: meetinglead.length, ['Value1']: meetingleadNextDay.length,
      ['id']: '65a904164473619190494480'
    },
    {
      ['name']: Visit_name?.status_name1, ['Value']: Visit.length, ['Value1']: VisitleadNextDay.length
      , ['id']: '65a903f8447361919049447c'
    },
    {
      ['name']: Re_Visit_name?.status_name1, ['Value']: Re_Visit.length, ['Value1']: Re_VisitleadNextDay.length,
      ['id']: '65a903ca4473619190494478'
    },
    {
      ['name']: Shedule_Visit_name?.status_name1, ['Value']: Shedule_Visit.length, ['Value1']: Shedule_VisitleadNextDay.length,
      ['id']: '65a903e9447361919049447a'
    },
  );
  res.status(201).json({
    success: true,
    message: "Get Lead Count Successfully",
    Count: array,
  });
});


///////// dashboard data for lead type  In Case Of User
exports.DashboardLeadCountOfUser = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.body;
  const agentObjectId = new ObjectId(user_id);
  let array = [];
  const lead = await Lead.find();
  const TotalLead = lead.length;
  const Agent = await agent.find();
  const TotalAgent = Agent.length;
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 5);
  currentDate.setMinutes(currentDate.getMinutes() + 30);
  const formattedDate1 = currentDate.toISOString();
  const targetDate = new Date(formattedDate1);
  const targetDateOnly = new Date(targetDate.toISOString().split('T')[0]);
  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1); // Get next day from targetDate
  ///// for Followup Lead count
  const followuplead = await Lead.find({
    assign_to_agent: agentObjectId,
    status: {
      $nin: [
        new ObjectId("65a904e04473619190494482"),
        new ObjectId("65a904ed4473619190494484")
      ],
    },

  });


  ///// for meeting
  const meetinglead = await Lead.find({
    assign_to_agent: agentObjectId,
    status: '65a904164473619190494480',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const meetingleadNextDay = await Lead.find({
    assign_to_agent: agentObjectId,
    status: '65a904164473619190494480',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });

  const meetinglead_name = await Status.findOne({ _id: '65a904164473619190494480' });
  ///// for Call Back (Visit)
  const Visit = await Lead.find({
    assign_to_agent: agentObjectId,
    status: '65a903f8447361919049447c',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const VisitleadNextDay = await Lead.find({
    assign_to_agent: agentObjectId,
    status: '65a903f8447361919049447c',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });
  const Visit_name = await Status.findOne({ _id: '65a903f8447361919049447c' });

  ///// for Call Back (Re-Visit)
  const Re_Visit = await Lead.find({
    assign_to_agent: agentObjectId,
    status: '65a903ca4473619190494478',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const Re_VisitleadNextDay = await Lead.find({
    assign_to_agent: agentObjectId,
    status: '65a903ca4473619190494478',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });
  const Re_Visit_name = await Status.findOne({ _id: '65a903ca4473619190494478' });
  ///// for Call Back (Re-Visit)
  const Shedule_Visit = await Lead.find({
    assign_to_agent: agentObjectId,
    status: '65a903e9447361919049447a',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const Shedule_VisitleadNextDay = await Lead.find({
    assign_to_agent: agentObjectId,
    status: '65a903e9447361919049447a',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });
  const Shedule_Visit_name = await Status.findOne({ _id: '65a903e9447361919049447a' });
  array.push(
    { ['name']: 'Followup Lead', ['Value']: followuplead.length },
    { ['name']: 'Total Agent', ['Value']: 1 },
    {
      ['name']: meetinglead_name?.status_name1, ['Value']: meetinglead.length, ['Value1']: meetingleadNextDay.length,
      ['id']: '65a904164473619190494480'
    },
    {
      ['name']: Visit_name?.status_name1, ['Value']: Visit.length, ['Value1']: VisitleadNextDay.length
      , ['id']: '65a903f8447361919049447c'
    },
    {
      ['name']: Re_Visit_name?.status_name1, ['Value']: Re_Visit.length, ['Value1']: Re_VisitleadNextDay.length,
      ['id']: '65a903ca4473619190494478'
    },
    {
      ['name']: Shedule_Visit_name?.status_name1, ['Value']: Shedule_Visit.length, ['Value1']: Shedule_VisitleadNextDay.length,
      ['id']: '65a903e9447361919049447a'
    },
  );
  res.status(201).json({
    success: true,
    message: "Get Lead Count Successfully",
    Count: array,
  });
});


///////// dashboard data for lead type  In Case Of All User By Team Leader
exports.DashboardLeadCountOfUserByTeamLeader = catchAsyncErrors(async (req, res, next) => {

  const { user_id } = req.body;
  // const agents = await agent.find({ assigntl: user_id }).select('_id');
  // const agentIds = agents.map(agent => agent._id);
  const [agentsByAssigntl, agentsById] = await Promise.all([
    agent.find({ assigntl: user_id }),
    agent.find({ _id: user_id })
  ]);

  // Merge the results into a single array
  const allAgents = [...agentsByAssigntl, ...agentsById];

  let array = [];
  const lead = await Lead.find();
  const TotalLead = lead.length;
  const Agent = await agent.find();
  const TotalAgent = Agent.length;
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 5);
  currentDate.setMinutes(currentDate.getMinutes() + 30);
  const formattedDate1 = currentDate.toISOString();
  const targetDate = new Date(formattedDate1);
  const targetDateOnly = new Date(targetDate.toISOString().split('T')[0]);
  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1); // Get next day from targetDate
  ///// for Followup Lead count

  const followuplead = await Lead.find({
    assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) },
    status: {
      $nin: [
        new ObjectId("65a904e04473619190494482"),
        new ObjectId("65a904ed4473619190494484")
      ],
    },

  });


  ///// for meeting
  const meetinglead = await Lead.find({
    assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) },
    status: '65a904164473619190494480',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const meetingleadNextDay = await Lead.find({
    assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) },
    status: '65a904164473619190494480',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });

  const meetinglead_name = await Status.findOne({ _id: '65a904164473619190494480' });
  ///// for Call Back (Visit)
  const Visit = await Lead.find({
    assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) },
    status: '65a903f8447361919049447c',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const VisitleadNextDay = await Lead.find({
    assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) },
    status: '65a903f8447361919049447c',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });
  const Visit_name = await Status.findOne({ _id: '65a903f8447361919049447c' });

  ///// for Call Back (Re-Visit)
  const Re_Visit = await Lead.find({
    assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) },
    status: '65a903ca4473619190494478',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const Re_VisitleadNextDay = await Lead.find({
    assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) },
    status: '65a903ca4473619190494478',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });
  const Re_Visit_name = await Status.findOne({ _id: '65a903ca4473619190494478' });
  ///// for Call Back (Re-Visit)
  const Shedule_Visit = await Lead.find({
    assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) },
    status: '65a903e9447361919049447a',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } }, // Convert followup_date to date string
        { $dateToString: { format: "%Y-%m-%d", date: targetDateOnly } } // Convert targetDateOnly to date string
      ]
    }
  });
  const Shedule_VisitleadNextDay = await Lead.find({
    assign_to_agent: { $in: allAgents.map(agent => new ObjectId(agent._id)) },
    status: '65a903e9447361919049447a',
    $expr: {
      $eq: [
        { $dateToString: { format: "%Y-%m-%d", date: "$followup_date" } },
        { $dateToString: { format: "%Y-%m-%d", date: nextDate } }
      ]
    }
  });
  const Shedule_Visit_name = await Status.findOne({ _id: '65a903e9447361919049447a' });
  array.push(
    { ['name']: 'Followup Lead', ['Value']: followuplead.length },
    { ['name']: 'Total Agent', ['Value']: allAgents.map(agent => new ObjectId(agent._id))?.length },
    {
      ['name']: meetinglead_name?.status_name1, ['Value']: meetinglead.length, ['Value1']: meetingleadNextDay.length,
      ['id']: '65a904164473619190494480'
    },
    {
      ['name']: Visit_name?.status_name1, ['Value']: Visit.length, ['Value1']: VisitleadNextDay.length
      , ['id']: '65a903f8447361919049447c'
    },
    {
      ['name']: Re_Visit_name?.status_name1, ['Value']: Re_Visit.length, ['Value1']: Re_VisitleadNextDay.length,
      ['id']: '65a903ca4473619190494478'
    },
    {
      ['name']: Shedule_Visit_name?.status_name1, ['Value']: Shedule_Visit.length, ['Value1']: Shedule_VisitleadNextDay.length,
      ['id']: '65a903e9447361919049447a'
    },
  );
  res.status(201).json({
    success: true,
    message: "Get Lead Count Successfully",
    Count: array,
  });


});







