require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

const { isActiveRoute } = require("./utils/routeHelpers");
const connectDB = require("../config/db");
const session = require("express-session");

const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB
connectDB();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "ADJHASGDJHDGSHADSAJDSGAJ",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MOGODB_URI }),
  })
);

app.use((req,res,next) => {
    // console.log(`${req.method} : ${req.url}`);
    next();
});

app.use(express.static("public"));

// Templating Engin
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.locals.isActiveRoute=isActiveRoute;

app.use("/", require("./routes/main"));
app.use("/", require("./routes/admin"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


app.use(function(req, res, next) {
  res.status(404).json({
    message: "No such route exists"
  })
});

// error handler
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500).json({
//     message: "Error Message"
//   })
// });
