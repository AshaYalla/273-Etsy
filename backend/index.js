const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var constants = require("./config.json");
var cors = require('cors');
const session = require('express-session');
const app = express();
const cookieParser = express("cookie-parser");
const multer = require('multer');


app.use( cors({ origin: ["http://localhost:3000"], methods: ["GET", "POST", "PUT"], credentials: true, }) );

app.use(cookieParser);
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.use(express.json());

app.use(
  session({
    key: "email",
    secret: "cmpe273_etsy",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    // duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
    cookie: {
      expiresIn: 60 * 60 * 24,
    },
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimType && extname) {
      return cb(null, true);
    }
    cb("Give proper file name");
  },
}).single("itemImage");

app.use("/Images", express.static("./Images"));


var db = mysql.createConnection({
  host     : constants.DB.hostname,
  user     : constants.DB.username,
  password : constants.DB.password,
  port     : constants.DB.port
});

db.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

app.post("/addItems", async (req, res) => {
  try {
    console.log("endpointhit")
    let upload = multer({ storage: storage }).single("itemImage");
    upload(req, res, function (err) {
      if (!req.file) {
        return res.send("Please select an image to upload");} 
      else if (err instanceof multer.MulterError) { return res.send(err); } 
      else if (err) { return res.send(err); }

      const itemName = req.body.itemName;
      const itemImage = req.file.filename;

      console.log(itemImage); console.log(itemName);
      db.query("INSERT INTO etsy.itemdetails (itemName,itemImage) VALUES (?, ?)", [ itemName, itemImage ],
        (err, result) => {
          if (err) { console.log(err); res.send({ message: "error" }); } 
          else { res.send({ message: "success" }); } } );
    });
  } catch (err) { console.log(err); }
});

app.post("/getItems", (req, res) => {
  // const id = req.params.id;
  console.log("In get items");
  db.query(
    "select * from etsy.itemdetails",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send("success",result);
      }
    }
  );
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  console.log(username);
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});

app.get("/signin", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});


app.post("/getUsername/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "select * from user WHERE id=?",
    [ id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send("success",result);
      }
    }
  );
});

app.put("/updateItems", (req,res) =>{
  try{
    let upload = multer({storage : storage}).single("shopImage");
    upload(req, res, function(err){
      if (!req.file) {
        return res.send("Please select an image to upload");} 
      else if (err instanceof multer.MulterError) { return res.send(err); } 
      else if (err) { return res.send(err); }
      
      const id = req.body.id;
      const shopImage = req.file.userImage;
      const name = req.body.name;
      // const email = req.body.email;
      const fullAddress = req.body.fullAddress;
      const phoneNumber = req.body.phoneNumber;
      const dob = req.body.dob;
      // const profilePic = req.body.profilePic;
      // const shopName = req.body.shopName;
      const gender = req.body.gender;
      const about = req.body.about;

      db.query("UPDATE etsy.itemdetails set name = ?, fullAddress  = ?, phoneNumber  = ?, dob  = ?, gender  = ?, about  = ? where id = ? ", 
      [  name, fullAddress, phoneNumber, dob, shopImage, gender, about ],
      (err, result) => {
        if (err) { console.log(err); res.send({ message: "error" }); } 
        else { res.send({ message: "success" }); } } 
      )
    });
  }
  catch (err) {console.log(err);}
});

app.put("/updateCartQuantity/:userId", (req, res) => {
  const userId = req.params.userId;
  // const userId = req.params.id;
  const itemId = req.body.itemId;
  const qty = req.body.qty;

  console.log("In update cart");
  console.log(itemId);
  console.log(qty);
  // console.log(id);

  db.query(
    "UPDATE Carts SET qty = ? WHERE itemId=? AND userId = ?",
    [qty, itemId, userId],
    (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});

app.get("/getQtyFromCart/:userid/:itemId", (req, res) => {
  const userId = req.params.userid;
  const itemId = req.params.itemId;
  console.log("Getting all cart products in home");
  db.query(
    "select qty from Carts where userId=? AND itemId=?",
    [userId, itemId],
    (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});
app.get("/getPurchases/:UserId", (req, res) => {
  const userid = req.params.UserId;
  console.log("Get purchased items");
  db.query(
    "SELECT * FROM Carts WHERE userId=? order by cartId desc limit 0, 1 ",
    [userid],
    (err, result) => {
      console.log(result);
      if (err) {
        res.send(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});

app.put("/updateItemById/:itemId", (req, res) => {
  const id = req.params.itemId;
  // const userId = req.params.id;
  const itemName = req.body.itemName;
  const itemDescriprion = req.body.itemDescription;
  const itemPrice = req.body.itemPrice;
  const itemCount = req.body.itemCount;
  const itemCategory = req.body.itemCategory;

  console.log("In update item post");
  console.log(itemDescriprion);
  console.log(itemName);
  console.log(id);

  db.query(
    "UPDATE Items SET itemName=?, itemPrice=?, itemDescription=?, itemCount=?, itemCategory=? WHERE itemId=?",
    [itemName, itemPrice, itemDescriprion, itemCount, itemCategory, id],
    (err, result) => {
      console.log(result.itemName);
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ success: true, result });
      }
    }
  );
});
app.listen(4001);
db.end()