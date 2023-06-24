const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../utils/helper");
const Event = require("../models/Event");
const User = require("../models/User");
const authMiddleware = require('../middleware/checkAuth.middleware');

const adminLayout = "../views/layouts/admin";


/**
 * Method - POST 
 * Path - user register 
 * */
router.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;
    const pwd = hashPassword(password);
    const newUser = await User.create({
      firstname,
      lastname,
      username,
      password: pwd,
    });
    // return res.status(200).json({ response: newUser });
    res.render("admin/index", {
      newUser,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "User already registerd." });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
});


/**
 * Method - POST 
 * Path - login 
 * */
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Invalid credentials" });

    const userDB = await User.findOne({ username });
    if (!userDB)
      return res.status(401).json({ message: "Invalid credentials" });

    const isValid = comparePassword(password, userDB.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: userDB._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * Method - GET 
 * Path - logout 
 * */
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie('token');
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
});


/**
 * Method - GET 
 * Path - dashboard 
 * */
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Event.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Event.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("admin/dashboard", {
      data,
      layout: adminLayout,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});



/**
 * Method - GET 
 * Path - view event 
 * */
router.get("/event-view/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Event.findById({ _id: slug});
    //   console.log(data);
    res.render("admin/view_event", {
      data,  layout: adminLayout,
    });
  } catch (error) {
    res.render("error", { error });
    console.log(error);
  }
});

/**
 * Method - GET 
 * Path - add event 
 * */
router.get("/add-event", async (req, res) => {
  try {
    res.render("admin/add_event", {
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Method - POST 
 * Path - add event 
 * */
router.post("/add-event",authMiddleware, async (req, res) => {
  try {
    const newEvent = new Event({
      title:req.body.title, 
      body:req.body.content,
      eventDate:req.body.event_date,
      referUrl:req.body.refer_url,
      sponser:req.body.sponser
    });
    await Event.create(newEvent);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }  
});



/**
 * Method - GET 
 * Path - edit event 
 * */
router.get("/edit-event/:id",authMiddleware, async (req, res) => {
  try {
    const data= await Event.findOne({_id:req.params.id});
    res.render("admin/edit_event", {
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }  
});

/**
 * Method - PUT 
 * Path - edit event 
 * */
router.put('/edit-event/:id', authMiddleware, async (req, res) => {
  try {

    await Event.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.content,
      eventDate:req.body.event_date,
      referUrl:req.body.refer_url,
      sponser:req.body.sponser,
      updatedAt: Date.now()
    });
    res.redirect("/dashboard");

  } catch (error) {
    console.log(error);
  }

});


/**
 * Method - DELETE 
 * Path - delete event 
 * */
router.delete('/delete-event/:id', authMiddleware, async (req, res) => {
  try {
    await Event.deleteOne({_id:req.params.id});
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});






module.exports = router;
