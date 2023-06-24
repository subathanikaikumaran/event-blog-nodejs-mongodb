const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

/**
 * Method - GET 
 * Path - home 
 * */
router.get("", async (req, res) => {
  try {
    // const data = await Event.find();
    let perPage = 10;
    let page = req.query.page || 1;
    const data = await Event.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Event.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.render("index", {
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute:''
    });
  } catch (error) {
    res.render("error", { error });
    console.log(error);
  }
});




/**
 * Method - GET 
 * Path - view event 
 * */
router.get("/event/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Event.findById({ _id: slug});
    //   console.log(data);
    res.render("event", {
      data,  currentRoute: `/event/${slug}`
    });
  } catch (error) {
    res.render("error", { error });
    console.log(error);
  }
});




/**
 * Method - POST 
 * Path - event search 
 * */
router.post('/search', async (req, res) => {
    try {     
  
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
      const data = await Event.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });  
      res.render("search", {
        data,
        currentRoute: '/'
      });  
    } catch (error) {
      console.log(error);
    }
  
  });




/**
 * Method - GET 
 * Path - about 
 * */
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});

/**
 * Method - GET 
 * Path - contact 
 * */
router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});


/**
 * Method - GET 
 * Path - admin / login page
 * */
router.get('/admin', (req, res) => {
  res.render('admin/index', {
    currentRoute: '/admin'
  });
});




/**
 * Method - GET 
 * Path - registaion page 
 * */
router.get('/admin/signup', (req, res) => {
  res.render('admin/signup', {
    currentRoute: '/admin'
  });
});



module.exports = router;
