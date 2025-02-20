const express=require('express');
const { Add_Product_Service, Delete_Product_service, getAllProductService, updateProductService } = require('../controllers/productserviceController');


const router=express.Router();


  router.route("/add_product_service").post(Add_Product_Service);
  router.route("/delete_product_service/:id").delete(Delete_Product_service);
  router.route("/all_product_service").get(getAllProductService);  
  router.route("/update_product_service/:id").put(updateProductService);    


     
      


  module.exports=router; 