import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); // grab the user via id
router.get("/:id/friends", verifyToken, getUserFriends); //grab the user friends

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;