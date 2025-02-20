const admin = require("firebase-admin");
const webNotification = require("../models/notificationForWebModel");
const Notification=require("../models/notificationModel");
const Lead = require("../models/leadModel");
const schedule = require("node-schedule");
const FCM = require("fcm-node");
const serverKey = "AAAAnus9Ao0:APA91bGCHcEiRwMsFRbsnN8od663jhfhdnuq10H2jMMmFzVrCVBACE4caGSZ-mAwf3VB6n_fUmrHxKPou1oyBaKXfUfcnAz6J2TTJm12woXqJVTleay2RSE0KPzuRTI2QppI3rrYY2HQ"; // Replace with your actual server key
const fcm = new FCM(serverKey);
  
async function scheduleJob() {
  try {
    const inputDate = new Date();
    inputDate.setHours(inputDate.getHours() + 5);
    inputDate.setMinutes(inputDate.getMinutes() + 30);
    const formattedDate = inputDate.toISOString();
     
    const leads = await Lead.find({
      followup_date: { $gte: formattedDate },
      status: "65a904164473619190494480" // Exclude leads with this status
    });

    if (leads.length > 0) {
      for (const element of leads) {
        const followup_date = new Date(element.followup_date);
        const agent_id = element.assign_to_agent;
        let message = element.massage_of_calander;

        followup_date.setHours(followup_date.getHours() - 5);
        followup_date.setMinutes(followup_date.getMinutes() - 30);
        const formattedDate1 = followup_date.toISOString();
        const targetDate = new Date(formattedDate1);

        
        // Schedule the job
        schedule.scheduleJob(targetDate, async () => {
          console.log('Notification scheduled for:', targetDate);

          try {
            const tokentable = await Notification.find({ user_id: agent_id });
            // console.log('tokentable',tokentable) 
            //  console.log('tokentable',tokentable[0].token)
            const token = tokentable ? tokentable[0].token : null;

            if (!message) {
              message = "Meeting";
            }

            const notificationData = {
              collapse_key: "your_collapse_key",
              notification: {
                title: "Notification Of Meeting",
                body: message,
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
          } catch (error) {
            console.error("Error fetching webNotification:", error);
          }
        });
      }
    } else {
      console.log("No leads found. No notifications scheduled.");
    }
  } catch (error) {
    console.error("Error scheduling job:", error);
  } 
}

module.exports = scheduleJob;
