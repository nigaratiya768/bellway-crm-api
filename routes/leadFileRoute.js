const express=require('express');
const  excel=express();
const multer = require('multer');
const path=require('path');
const fs = require('fs');
const destinationPath = path.join(__dirname, '../public', 'File');
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath, { recursive: true });
}
excel.use('../public',express.static(path.resolve(__dirname,'../public')));
var storage= multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null, destinationPath);  
    },
    filename:(req,file,cb)=>{
         cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });
const  excelController=require('../controllers/excelUplode'); 
excel.post('/api/v1/file_uplode',upload.single('leadattechment'),excelController.FileUplode);     
module.exports=excel;      

