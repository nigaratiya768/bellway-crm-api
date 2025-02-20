const axios = require('axios');
const crypto = require('crypto');
const Lead = require('../models/leadModel');
const Transactional = require('../models/transactionalSMSModel');

async function makeRequest() {
    try {
        const housingapiDetails = await Transactional.find({ type: 'housing' });
        const apiurl = await housingapiDetails[0].endpointurl;
        const apikye = await housingapiDetails[0].key;
        const apiid = await housingapiDetails[0].user;
        const durationInSeconds = 45 * 60 * 60; // 45 hours
        // const endTime = Math.floor(new Date('2024-03-13').getTime() / 1000);
        const endTime = Math.floor(Date.now() / 1000); 
        // const startTime = Math.floor(new Date('2024-03-11').getTime() / 1000);
        const startTime = endTime - durationInSeconds;
        const currentTime = Math.floor(Date.now() / 1000);
        const hash = crypto.createHmac('sha256', apikye).update(currentTime.toString()).digest('hex');
        const url = `${apiurl}?start_date=${startTime}&end_date=${endTime}&current_time=${currentTime}&hash=${hash}&id=${apiid}`;
        const response = await axios.get(url);
       for (const leadData of response.data.data) {
            const existingLead = await Lead.findOne({ lead_date: leadData?.lead_date });
            if (!existingLead) { 
                await Lead.create({
                    full_name: leadData?.lead_name,
                    email_id: leadData?.lead_email,
                    lead_source: '65f01581ca9cacbc217cce1a',
                    contact_no: leadData?.lead_phone,  
                    service: '65f01532ca9cacbc217ccdfe',
                    status: '65a90407447361919049447e',
                    city: leadData?.city_name,
                    full_address: leadData?.locality_name + ' ' + leadData?.city_name,
                    apartment_names: leadData.apartment_names,
                    service_type: leadData.service_type,
                    category_type: leadData.category_type,
                    max_area: leadData.max_area,
                    min_area: leadData.min_area,
                    min_price: leadData.min_price,
                    max_price: leadData.max_price,
                    flat_id: leadData.flat_id,
                    lead_date:leadData.lead_date,
                });
                console.log('Lead added to the database');
            } else {
                console.log('Lead already exists in the database');
            } 
        }

    } catch (error) {
        console.error('Error fetching or saving leads:', error);
    }
}

// Schedule the function to run every 1 minute
setInterval(makeRequest, 1 * 60 * 1000); // 1 minute in milliseconds

module.exports = makeRequest;
