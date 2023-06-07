import express from "express";
import { login } from "../controllers/auth.js"; // login function is imported from controllers/auth.js

const router = express.Router();

router.post("/login", login); // ".post("/login")" means there is a prefix to login ie. auth. so its auth/login

export default router;