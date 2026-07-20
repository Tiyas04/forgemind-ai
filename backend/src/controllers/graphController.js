import asyncHandler from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { Logger } from "../utils/Logger.js";
import axios from "axios";

export const getGraphNetwork = asyncHandler(async (req, res) => {
  try {
    Logger.info("Fetching knowledge graph relations from AI service");
    const aiResponse = await axios.get(
      `${process.env.AI_SERVICE_URL}/graph/all`,
      { timeout: 15000 }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          aiResponse.data,
          "Knowledge network retrieved successfully"
        )
      );
  } catch (error) {
    Logger.error("AI service get graph network failure", error);
    // Return empty nodes/edges structure rather than crashing, for smooth UI fallback
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { nodes: [], edges: [] },
          "AI service graph network offline. Returned empty network."
        )
      );
  }
});
