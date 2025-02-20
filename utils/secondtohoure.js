const secondtohoure=async(second)=>{ 
    console.log(second)
    const avragedurationinhoure = Math.floor(second / 3600);
    const avragedurationinminutes = Math.floor((second % 3600) / 60);
    const avragedurationinSeconds = parseInt(second % 60);
    const total= await (avragedurationinhoure + "h " + avragedurationinminutes + "m " + avragedurationinSeconds + "s");
   
    return total;
      
};

module.exports=secondtohoure;