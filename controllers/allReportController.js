const Lead_Source = require('../models/leadsourceModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHander = require("../utils/errorhander");
const Lead = require('../models/leadModel');
const Product = require('../models/productserviceModel');
const Agent = require('../models/agentModel');
const { ObjectId } = require('mongoose').Types;


/////// leadsource report 
exports.LeadSourceReport = catchAsyncErrors(async (req, res, next) => {
  const { leadsource_id, start_date, end_date } = req.body;
  if (!leadsource_id) {
    return next(new ErrorHander("Lead source is required", 400));
  }


  // Parse start_date and end_date into Date objects if provided
  const startDateObj = start_date ? new Date(start_date) : null;
  const endDateObj = end_date ? new Date(end_date) : null;

  const query = {
    lead_source: leadsource_id,
  };

  if (startDateObj && !isNaN(startDateObj)) {
    query.created = {
      $gte: startDateObj,
    };
  }

  if (endDateObj && !isNaN(endDateObj)) {
    // If query.created already exists, add $lte to it, otherwise, create a new object
    query.created = query.created || {};
    query.created.$lte = endDateObj;
  }

  const leadSource = await Lead.find(query).select("full_name lead_cost").maxTimeMS(30000);
  if (!leadSource || leadSource.length === 0) {
    return next(new ErrorHander("No Data Found Now", 404));
  }
  let total = 0;
  leadSource.map((hhhhh) => {
    if (hhhhh?.lead_cost) {
      total += parseInt(hhhhh.lead_cost);
    }

  })

  let addd = {
    full_name: "Total",
    lead_cost: total
  }
  await leadSource.push(addd)



  res.status(201).json({
    success: true,
    message: 'Lead Source Get Successfully',
    leadSource,
  });


})


//////// Product And Service Report By Default Graph

exports.LeadProductServiceOverviewApi = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.find();

    const product1_id = product.map((product1) => product1._id);
    const product_name = product.map((product2) => product2.product_service_name);

    const product_countPromises = product1_id.map(async (product1_id1) => {
      const lead = await Lead.find({ service: product1_id1 });
      const lead_length = lead.length;

      return lead_length;
    });

    const product_count = await Promise.all(product_countPromises);

    res.status(201).json({
      success: true,
      message: "Successfully Leads Source Overview",
      product_count,
      product_name,
      product1_id,
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


//////// Product And Service Report Date Wise Filter in Table

exports.GetProductReportDateWise = catchAsyncErrors(async (req, res, next) => {
  const { product_service_id, start_date, end_date } = req.body;
  if (!product_service_id) {
    return next(new ErrorHander("Product Service is required", 400));
  }
  const startDateObj = start_date ? new Date(start_date) : null;
  const endDateObj = end_date ? new Date(end_date) : null;

  const query = {
    service: product_service_id,
  };

  if (startDateObj && !isNaN(startDateObj)) {
    query.created = {
      $gte: startDateObj,
    };
  }

  if (endDateObj && !isNaN(endDateObj)) {
    // If query.created already exists, add $lte to it, otherwise, create a new object
    query.created = query.created || {};
    query.created.$lte = endDateObj;
  }

  const leadSource = await Lead.find(query).select("full_name followup_won_amount").maxTimeMS(30000);
  if (!leadSource || leadSource.length === 0) {
    return next(new ErrorHander("No Data Found Now", 404));
  }
  let total = 0;
  leadSource.map((hhhhh) => {
    if (hhhhh?.followup_won_amount) {
      total += parseInt(hhhhh.followup_won_amount);
    }

  })

  let addd = {
    full_name: "Total",
    followup_won_amount: total
  }
  await leadSource.push(addd)



  res.status(201).json({
    success: true,
    message: 'Lead Source Get Successfully',
    leadSource,
  });


});

///////  Employees Report 
exports.EmployeesReportDetail = catchAsyncErrors(async (req, res, next) => {
  try {
    let name = [];
    let value = [];
    let agents;
    if (req.body.assign_to_agent) {
      agents = await Agent.find({ role: 'user', assigntl: req.body.assign_to_agent });
    } else {
      agents = await Agent.find({ role: 'user' });
    }

    for (const agent of agents) {
      let totalAmount = 0;
      const leads = await Lead.find({ assign_to_agent: agent._id });

      leads.forEach((lead) => {
        totalAmount += lead.followup_won_amount || 0;
      });

      name.push(agent.agent_name);
      value.push(totalAmount);
    }

    res.status(200).json({
      success: true,
      message: "Successfully retrieved employees report details",
      name,
      value,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}); 


/////////  Employees report By Filter
exports.EmployeesReportDetailByFilter1 = catchAsyncErrors(async (req, res, next) => {
  const { agent, service, status, lead_source, startDate, endDate ,role,user_id } = req.body;

  let total = 0;
  let data = [];
  
  const matchConditions = {};
  if (agent) matchConditions.assign_to_agent = new ObjectId(agent);
  if (service) matchConditions.service = new ObjectId(service);
  if (status) matchConditions.status = new ObjectId(status);
  if (lead_source) matchConditions.lead_source = new ObjectId(lead_source);
  if (startDate && endDate) {
    matchConditions.followup_date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const lead = await Lead.aggregate([
    { $match: matchConditions },
    { $sort: { followup_date: 1 } }
  ]);
   const lead_length=await lead.length;
  const wonLeadCount = await Lead.aggregate([
    { $match: { status: new ObjectId('65a904e04473619190494482'), ...matchConditions } },
    { $count: "count" } 
  ]);

  const ratio = (wonLeadCount.length > 0 ? wonLeadCount[0].count : 0) / lead.length * 100 || 0; // Handle division by zero

  lead.forEach((lead1) => {
    total += parseInt(lead1.followup_won_amount) || 0;
  });
 data.push({ Total: lead_length, Won: wonLeadCount.length > 0 ? wonLeadCount[0].count : 0, Ratio: ratio.toFixed(2) + '%', Amount: total });

  res.status(200).json({
    success: true,
    message: "Successfully fetched data",
    lead: lead,
    data: data,
  });
});

/////////  Employees report By Filter
exports.EmployeesReportDetailByFilter = catchAsyncErrors(async (req, res, next) => {
  const { agent, service, status, lead_source, startDate, endDate ,role,user_id } = req.body;
    if(role==='admin'){
      let total = 0;
      let data = [];
      
      const matchConditions = {};
      if (agent) matchConditions.assign_to_agent = new ObjectId(agent);
      if (service) matchConditions.service = new ObjectId(service);
      if (status) matchConditions.status = new ObjectId(status);
      if (lead_source) matchConditions.lead_source = new ObjectId(lead_source);
      if (startDate && endDate) {
        matchConditions.followup_date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    
      const lead = await Lead.aggregate([
        { $match: matchConditions },
        { $sort: { followup_date: 1 } }
      ]);
       const lead_length=await lead.length;
      const wonLeadCount = await Lead.aggregate([
        { $match: { status: new ObjectId('65a904e04473619190494482'), ...matchConditions } },
        { $count: "count" } 
      ]);
    
      const ratio = (wonLeadCount.length > 0 ? wonLeadCount[0].count : 0) / lead.length * 100 || 0; // Handle division by zero
    
      lead.forEach((lead1) => {
        total += parseInt(lead1.followup_won_amount) || 0;
      });
     data.push({ Total: lead_length, Won: wonLeadCount.length > 0 ? wonLeadCount[0].count : 0, Ratio: ratio.toFixed(2) + '%', Amount: total });
    
      res.status(200).json({
        success: true,
        message: "Successfully fetched data",
        lead: lead,
        data: data,
      });
    }
    if(role==='TeamLeader'){
      if(agent){
        let total = 0;
        let data = [];
        
        const matchConditions = {};
        if (agent) matchConditions.assign_to_agent = new ObjectId(agent);
        if (service) matchConditions.service = new ObjectId(service);
        if (status) matchConditions.status = new ObjectId(status);
        if (lead_source) matchConditions.lead_source = new ObjectId(lead_source);
        if (startDate && endDate) {
          matchConditions.followup_date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          };
        }
      
        const lead = await Lead.aggregate([
          { $match: matchConditions },
          { $sort: { followup_date: 1 } }
        ]);
         const lead_length=await lead.length;
        const wonLeadCount = await Lead.aggregate([
          { $match: { status: new ObjectId('65a904e04473619190494482'), ...matchConditions } },
          { $count: "count" } 
        ]);
      
        const ratio = (wonLeadCount.length > 0 ? wonLeadCount[0].count : 0) / lead.length * 100 || 0; // Handle division by zero
      
        lead.forEach((lead1) => {
          total += parseInt(lead1.followup_won_amount) || 0;
        });
       data.push({ Total: lead_length, Won: wonLeadCount.length > 0 ? wonLeadCount[0].count : 0, Ratio: ratio.toFixed(2) + '%', Amount: total });
      
        res.status(200).json({
          success: true,
          message: "Successfully fetched data",
          lead: lead,
          data: data,
        });
      }else{
        let total = 0;
        let data = [];
        const [agentsByAssigntl, agentsById] = await Promise.all([
          Agent.find({ assigntl: user_id }),
          Agent.find({ _id: user_id })
      ]);
       const allAgents = [...agentsByAssigntl, ...agentsById];
        const matchConditions = {}; 
        if (!agent) matchConditions.assign_to_agent = { $in: allAgents.map(agent => new ObjectId(agent._id)) }
        if (service) matchConditions.service = new ObjectId(service);
        if (status) matchConditions.status = new ObjectId(status);
        if (lead_source) matchConditions.lead_source = new ObjectId(lead_source);
        if (startDate && endDate) {
          matchConditions.followup_date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          };
        }
      
        const lead = await Lead.aggregate([
          { $match: matchConditions },
          { $sort: { followup_date: 1 } }
        ]);
         const lead_length=await lead.length;
        const wonLeadCount = await Lead.aggregate([
          { $match: { status: new ObjectId('65a904e04473619190494482'), ...matchConditions } },
          { $count: "count" } 
        ]);
      
        const ratio = (wonLeadCount.length > 0 ? wonLeadCount[0].count : 0) / lead.length * 100 || 0; // Handle division by zero
      
        lead.forEach((lead1) => {
          total += parseInt(lead1.followup_won_amount) || 0;
        });
       data.push({ Total: lead_length, Won: wonLeadCount.length > 0 ? wonLeadCount[0].count : 0, Ratio: ratio.toFixed(2) + '%', Amount: total });
      
        res.status(200).json({
          success: true,
          message: "Successfully fetched data",
          lead: lead,
          data: data,
        });
      }
   
    }
 
});





