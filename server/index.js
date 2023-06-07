// install nodemon, gridfs-stream for file upload
// bcrypt for password encryption, jsonwebtoken for authentication
import express from "express"; // for library
import bodyParser from "body-parser"; // to process request body
import mongoose from "mongoose"; // for mongodb access
import cors from "cors"; // for cross origin requests and sharing policy
import dotenv from "dotenv"; // for environment variables
import multer from "multer"; // for uploading files locally
import helmet from "helmet"; // for request safety
import morgan from "morgan"; // for login
import path from "path"; //used to set paths when we create directories
import { fileURLToPath } from "url"; // used to set paths when we create directories
import authRoutes from "./routes/auth.js"; // in routes folder
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js"; // below s function is written to store at local storage
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS FOR MIDDLEWARE(functions which run inbetween front end and back end)*/
const __filename = fileURLToPath(import.meta.url); // used to grab files
const __dirname = path.dirname(__filename); // used to grab directories
dotenv.config(); // to use dotenv files
const app = express(); // initiate middleware
app.use(express.json()); // started express
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // storing images ie assets in local storage

/* FILE STORAGE */
const storage = multer.diskStorage({  // when files are uploaded this function is used to save in local storage
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES. Here /auth/register acts as a route. used becz it acts as a middleware between uploading photo and storing in local storage at public/assets location */
app.post("/auth/register", upload.single("picture"), register); // register is a function written in auth.js in controllers folder
app.post("/posts", verifyToken, upload.single("picture"), createPost); // verifyToken is a function from middleware/auth.js

/* ROUTES */
app.use("/auth", authRoutes); // from routes folder. for authentication
app.use("/users", userRoutes); //from routes folder. for grabbing the user information
app.use("/posts", postRoutes); // from routes folder. for grabbing the posts information

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001; // port no. to connect to db
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // fall back to old parser if the new parser has bugs
    useUnifiedTopology: true, // server discovery and monitoring
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    User.insertMany(users);
    Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));