import asyncHandler from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Logger } from "../utils/Logger.js";
import axios from "axios";

export const askQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question) {
    throw new ApiError(400, "Question is required");
  }

  const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";

  try {
    Logger.info(`Forwarding question query to AI service: "${question}"`);
    const aiResponse = await axios.post(
      `${aiServiceUrl}/query`,
      { question },
      { timeout: 30000 }
    );

    Logger.info(`Successfully retrieved answer with confidence: ${aiResponse.data?.confidence}`);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          aiResponse.data,
          "Question answered successfully"
        )
      );
  } catch (error) {
    Logger.error(`AI service question query failure: "${question}"`, error.message);
    throw new ApiError(500, "AI Service failed to answer question or timed out");
  }
});

export const askQuestionStream = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question) {
    throw new ApiError(400, "Question is required");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";

  try {
    Logger.info(`Initiating AI query stream for question: "${question}"`);
    const aiResponse = await axios({
      method: "post",
      url: `${aiServiceUrl}/query/stream`,
      data: { question },
      responseType: "stream",
      timeout: 45000,
    });

    aiResponse.data.on("data", (chunk) => {
      res.write(chunk);
    });

    aiResponse.data.on("end", () => {
      Logger.info(`Successfully completed AI query stream`);
      res.end();
    });

    aiResponse.data.on("error", (err) => {
      Logger.error("Stream data error:", err);
      res.write(JSON.stringify({ type: "error", message: "Stream data error" }) + "\n");
      res.end();
    });

  } catch (error) {
    Logger.error(`AI service streaming query failure: "${question}"`, error.message);
    res.write(
      JSON.stringify({
        type: "content",
        delta: "CONNECTION_FAILURE: Neural cognitive core is offline or processing timed out. Please check AI service health."
      }) + "\n"
    );
    res.write(
      JSON.stringify({
        type: "done",
        suggested_questions: ["Check AI service health status", "Verify ChromaDB vector store connection"]
      }) + "\n"
    );
    res.end();
  }
});
