const Agent = require("../models/agentModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const LoginHistory = require("../models/LoginHistory");
const bcrypt = require("bcryptjs");
const useragent = require("express-useragent");
const mongoose = require("mongoose");
exports.createAgent = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.create(req.body);

  res.status(201).json({
    success: true,
    agent,
    message: "Agent Added Successfully....",
  });
});

// Delete Agent --admin

exports.deleteAgent = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    return next(new ErrorHander("Agent Not Found", 404));
  }
  await agent.deleteOne();

  res.status(200).json({
    success: true,
    message: "Agent Delete Successfully",
    agent,
  });
});

// get all agent --admin
exports.getAllAgent = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.aggregate([
    {
      $lookup: {
        from: "crm_agents",
        let: { assigntlString: "$assigntl" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", { $toObjectId: "$$assigntlString" }],
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
  ]);

  res.status(201).json({
    success: true,
    agent,
  });
});

///// Gwt All Users According to Team Leader
exports.getAllAgentByTeamLeader = catchAsyncErrors(async (req, res, next) => {
  const { assign_to_agent } = req.body;
  const [agentsByAssigntl, agentsById] = await Promise.all([
    Agent.find({ assigntl: assign_to_agent }),
    Agent.find({ _id: assign_to_agent }),
  ]);
  // Merge the results into a single array
  const allAgents = [...agentsByAssigntl, ...agentsById];
  //  const agent = await Agent.find({ assigntl: assign_to_agent });
  res.status(201).json({
    success: true,
    agent: allAgents,
  });
});

////// Get All Agent Of A Team

exports.getAllAgentofATeamByAgent = catchAsyncErrors(async (req, res, next) => {
  const { assign_to_agent } = req.body;

  try {
    // Find the agent by ID
    let agent = await Agent.findById({ _id: assign_to_agent });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    // Now check if this agent is assigned or not
    const assignedTeamId = agent.assigntl;

    if (assignedTeamId) {
      // If the agent is assigned, find all agents with the same assigned team
      agent = await Agent.find({ assigntl: assignedTeamId });
    } else {
      // If the agent is not assigned, return all agents with no assigned team
      agent = await Agent.find({
        assigntl: { $exists: false },
        role: { $ne: "TeamLeader" },
      });
    }

    return res.status(200).json({
      success: true,
      agent,
    });
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// get Teal --

exports.getAllTeamLeader = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.find({ role: "TeamLeader" });
  res.status(201).json({
    success: true,
    agent,
  });
});

// get Agent  details

exports.getAgentDetails = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    return next(new ErrorHander("Agent Not Found", 404));
  }
  res.status(201).json({
    success: true,
    agent,
  });
});

// login Agent

exports.loginAgent = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHander("Plz Enter Email And Password", 400));
  }
  const agent = await Agent.findOne({ agent_email: email }).select(
    "+agent_password"
  );
  console.log(agent);
  if (!agent) {
    return next(new ErrorHander("Invalid email Or password", 400));
  }
  //TODO remove static true password
  const isPasswordMatched = true; // await agent.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email Or password", 400));
  }
  const userAgent = req.useragent;
  console.log(userAgent);
  const token = agent.getJWTToken();
  console.log(token);
  sendToken(agent, 200, res);
});
/// update Client Access
exports.updateClientAccess = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    return next(new ErrorHander("Invalid email Or password", 400));
  }
  const agent_access = await agent.client_access;
  if (agent_access === "yes") {
    const agent = await Agent.updateOne(
      { _id: req.params.id },
      { $set: { client_access: "no" } }
    );
  }
  if (agent_access === "no") {
    const agent = await Agent.updateOne(
      { _id: req.params.id },
      { $set: { client_access: "yes" } }
    );
  }
  res.status(201).json({
    success: true,
    agent,
  });
});

exports.EditAgentDetails = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id).select("+agent_password");
  if (!agent) {
    return next(new ErrorHander("Invalid email Or password", 400));
  }
  if (!req.body.agent_password) {
    const updateagent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      updateagent,
    });
  } else {
    const isPasswordMatched = await agent.comparePassword(
      req.body.agent_password
    );
    if (!isPasswordMatched) {
      const convertohashpass = await bcrypt.hash(req.body.agent_password, 10);
      const { agent_password, ...newAaa } = await req.body;
      const updatekrnewaladata = await {
        ...newAaa,
        agent_password: convertohashpass,
      };
      const updateagent = await Agent.findByIdAndUpdate(
        req.params.id,
        updatekrnewaladata,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json({
        success: true,
        updateagent,
      });
    } else {
      const updateagent = await Agent.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json({
        success: true,
        updateagent,
      });
    }
  }
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  //    const {email,new_password}=req.body;
});
