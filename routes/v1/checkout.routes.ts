import express from "express";
import { upgradePlan } from "controllers/checkout.controllers";
import { isAuth } from "middleware/auth";

const CheckoutUpload = express.Router();

CheckoutUpload.post("/upgradePlan", isAuth, upgradePlan);

export default CheckoutUpload;
