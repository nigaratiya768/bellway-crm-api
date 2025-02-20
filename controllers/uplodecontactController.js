const UplodeContact = require('../models/uplodecontactModel');
const UplodeContactData = require('../models/uplodecontactDataModel');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");

const csv = require("csvtojson");
const ExcelUplodeContactdata = async (req, res) => {
    try {
        const file = await req.file;
        if (file) {
            const data = { 'document_name': file.originalname, 'document_second_name': file.filename };
            const ContactDocument = await UplodeContact.create(data);
            if (ContactDocument) {
                const Doucment_id = await ContactDocument?._id;
                const ContactUplodeData = await csv().fromFile(req.file.path);
                const insertedContact = await UplodeContactData.insertMany(ContactUplodeData.map(entry => ({
                    uplodecontactid: Doucment_id,
                    clientname: entry.Name,
                    clientMobile: entry.Mobile
                })))
                if (insertedContact.length > 0) {
                    res.status(200).json({
                        success: true,
                        message: "Uploaded CSV File Successfully",
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "CSV File is Not Uploaded Successfully",
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "File is Not Uploaded Successfully",
        });
    }
};
const ContactUplode = async (req, res) => {
    try {
        const Document = await UplodeContact.find();
        res.status(200).json({
            success: true,
            Document,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Data Not Found",
        });
    }
};

const ContactUplodeData = async (req, res) => {
    try {
        const { id } = req.params;
        const Document = await UplodeContactData.find({ uplodecontactid: id });
        res.status(200).json({
            success: true,
            Document,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Data Not Found",
        });
    }
}

module.exports = {
    ExcelUplodeContactdata, ContactUplode, ContactUplodeData
};
