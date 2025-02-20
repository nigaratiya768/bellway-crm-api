const CrmStatus = require('./models/crmStatus'); // Import your Mongoose model

async function addInitialData() {
    try {
        await CrmStatus.create({
            _id: "65b7a09483dd98fa9834269b",
            status_name: "Fake lead",
            status_name1: "",
            status_status: 1,
            is_deletable: 1,
            createdAt: new Date(1706533012500),
            updatedAt: new Date(1706533012500)
        });
        console.log('Initial data added successfully');
    } catch (error) {
        console.error('Error adding initial data:', error);
    }
}

mongoose.connection.once('open', async () => {
    try {
        const count = await CrmStatus.countDocuments();
        if (count === 0) {
            await addInitialData();
        }
    } catch (error) {
        console.error('Error checking initial data:', error);
    }
});
