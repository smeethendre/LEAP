import express from "express";
import asyncHandler from "../utils/asyncHandler";
import { Telemetry } from "../models/telemetry.fields";
import fetchFromFirebase from "../services/cloudIngest.service";

const saveFirebasePacketC = asyncHandler(async (req, res) => {
  const response =
    await fetchFromFirebase.saveFirebasePacket(fetchFromFirebase);
  res.status(202).json({
    message: "Data fetched from fire-cloud",
    success: true,
    data: response,
  });
});
