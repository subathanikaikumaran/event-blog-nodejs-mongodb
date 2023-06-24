const express = require('express');
const router = express.Router();

router.get('',(req,res)=>{
    const locals={
        title:"NodeJS"
    }
    res.render('index',{locals});
});

module.exports=router;