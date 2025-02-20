const Campaign = require("../models/campaignModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const responseObject = require("../utils/apiResponse");

exports.createCampaign = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return responseObject({
        res,
        status: 200,
        type: "error",
        message: "Name is required",
      });
    }

    const isCampaignExist = await Campaign.findOne({ name });

    if (isCampaignExist) {
      return responseObject({
        res,
        status: 200,
        type: "error",
        message: "Campaign Already Exist",
        data: null,
        error: null,
      });
    }

    const update = await Campaign.updateMany(
      { IsActive: true },
      { $set: { IsActive: false } },
      { overwrite: true }
    );
    console.log("update", update);
    const campaign = await Campaign.create(req.body);

    responseObject({
      res,
      status: 201,
      type: "success",
      message: "Campaign Added Successfully....",
      data: campaign,
      error: null,
    });
  } catch (err) {
    console.log("Create Campaign", err);
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

exports.getAllCampaign = async (req, res, next) => {
  try {
    const { isActive = true } = req.query;
    // const campaigns = await Campaign.find({ IsActive: isActive });
    const campaigns = await Campaign.aggregate([
      {
        $lookup: {
          from: "crm_prospects",
          localField: "_id",
          foreignField: "campaignId",
          as: "result",
          pipeline: [
            {
              $facet: {
                upcomingFollowups: [
                  { $match: { totalCalls: 0 } },
                  { $count: "count" },
                ],
                totalOverdue: [
                  { $match: { scheduledDate: { $lt: new Date() } } },
                  { $count: "count" },
                ],
                totalPendingCalls: [
                  { $match: { scheduledDate: { $gt: new Date() } } },
                  { $count: "count" },
                ],
                totalProspects: [{ $count: "count" }],
              },
            },
            {
              $project: {
                upcomingFollowups: {
                  $ifNull: [
                    { $arrayElemAt: ["$upcomingFollowups.count", 0] },
                    0,
                  ],
                },
                totalOverdue: {
                  $ifNull: [{ $arrayElemAt: ["$totalOverdue.count", 0] }, 0],
                },
                totalPendingCalls: {
                  $ifNull: [
                    { $arrayElemAt: ["$totalPendingCalls.count", 0] },
                    0,
                  ],
                },
                totalProspects: {
                  $ifNull: [{ $arrayElemAt: ["$totalProspects.count", 0] }, 0],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          stats: { $first: "$result" },
        },
      },
    ]);

    responseObject({
      res,
      status: 200,
      type: "success",
      message: "your campaigns",
      data: campaigns,
      error: null,
    });
  } catch (err) {
    console.log("Get Campaigns", err);
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

exports.getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    responseObject({
      res,
      status: 201,
      type: "success",
      message: "your campaign",
      data: campaign,
      error: null,
    });
  } catch (err) {
    console.log("Get Campaign", err);
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

exports.deleteCampaign = async (req, res, next) => {
  try {
    await Campaign.findByIdAndUpdate(req.params.id, {
      IsActive: false,
    });

    return responseObject({
      res,
      status: 201,
      type: "success",
      message: "Campaign Deleted Successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    console.log("Delete Campaign", err);
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

exports.updateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    responseObject({
      res,
      status: 200,
      type: "success",
      message: "Campaign Updated Successfully",
      data: campaign,
      error: null, 
    }); 
  } catch (err) {
    console.log("Update Campaign", err);
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
