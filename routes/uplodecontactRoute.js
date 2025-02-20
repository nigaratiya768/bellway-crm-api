const express=require('express');
const  excel=express();
const multer = require('multer');
const path=require('path');
const fs = require('fs');
const destinationPath = path.join(__dirname, '../public', 'exceluplode');
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath, { recursive: true });
}
excel.use(express.static(path.resolve(__dirname,'../public')));
var storage= multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null, destinationPath);
    },
    filename:(req,file,cb)=>{
         cb(null, Date.now() + '-' + file.originalname);
    }
})
// Multer file filter configuration
function fileFilter(req, file, cb) {
  const allowedFileTypes = ['csv','xls'];
  const fileExtension = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV files are allowed.'), false);
  }
}
var upload = multer({ storage: storage, fileFilter: fileFilter });
const  excelController=require('../controllers/uplodecontactController'); 
excel.post('/api/v1/ExcelUplodeContactdata',upload.single('file'),excelController.ExcelUplodeContactdata);     
excel.get('/api/v1/ContactUplode',excelController.ContactUplode);
excel.get('/api/v1/ContactUplodeData/:id',excelController.ContactUplodeData);  
module.exports=excel;

