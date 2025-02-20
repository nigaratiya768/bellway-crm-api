const socialmedialead=require('../models/socialmedialeadModel');
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");



// create status 

exports.addAllSocialMediaLead=catchAsyncErrors(async (req,res,next)=>{
    const body = req.body;
   if (body.object === 'page') {

    if (body && body.entry) {
      console.log('Entries:', body.entry);
      // Process each entry
      body.entry.forEach(async entry => {
        console.log('Entry:', entry);
        // Access values within the entry object
        const { id, time, changes } = entry;
        console.log('ID:', id);
        console.log('Time:', time);
        console.log('Changes:', changes);

        // Extract relevant data from the changes array
        const updatedFields = changes.map(change => change.field);
        console.log('Updated Fields:', updatedFields);
       
        // Extract email, phone, and name from the changes array
        const emailChange = changes.find(change => change.field === 'email');
        const phoneChange = changes.find(change => change.field === 'phone');
        const nameChange = changes.find(change => change.field === 'name');

        // Create a new document for the entry
        try {
            // Create a new SocialMediaLead document
            const newLead = new socialmedialead({
                id,
                time,
                email: emailChange ? emailChange?.value : null,
                phone: phoneChange ? phoneChange?.value : null,
                name: nameChange ? nameChange?.value : null
            });

            // Save the new lead to the database
            const savedLead = await newLead.save();
            console.log('New lead added:', savedLead);
        } catch (error) {
            console.error('Error adding new lead:', error);
            // Handle the error as needed
        }
      });
      res.status(200).send('EVENT_RECEIVED');
  } else {
      res.status(200).send('missing');
      // Handle the case where the expected properties are missing
  }
     
    } else {
      res.sendStatus(404);
    }
})

// get All Lead Status 
exports.AllSocialMediaLead=catchAsyncErrors(async(req,res,next)=>{
    const VERIFY_TOKEN = 'abc123';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
})

////  


// get All Lead Status 
exports.getAllSocialMediaLead=catchAsyncErrors(async(req,res,next)=>{
        const  SocialMediaLead=await socialmedialead.find();
         res.status(200).json({
           success:true,
           count:SocialMediaLead.length,
           SocialMediaLead
   })
})

////