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
  const allowedFileTypes = ['csv'];
  const fileExtension = path.extname(file.originalname).toLowerCase().replace('.', '');

  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV files are allowed.'), false);
  }
}

var upload = multer({ storage: storage, fileFilter: fileFilter });
const  excelController=require('../controllers/excelUplode'); 
excel.post('/api/v1/import',upload.single('file'),excelController.ExcelUplode);  
   
module.exports=excel;

