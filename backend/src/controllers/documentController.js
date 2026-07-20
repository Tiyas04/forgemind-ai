import Document from "../models/Document.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import axios from "axios";
import { Logger } from "../utils/Logger.js";

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a file");
  }

  // Create a pending document in MongoDB
  const sizeMB = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
  const format = req.file.originalname.split(".").pop().toUpperCase();

  const tempDocId = `temp_${Date.now()}`;
  const document = await Document.create({
    doc_id: tempDocId,
    name: req.file.originalname,
    size: sizeMB,
    format: format,
    status: "INDEXING",
    owner: req.user._id,
  });

  // Attempt to forward file to FastAPI AI service with retries
  let attempts = 0;
  const maxAttempts = 2;
  let success = false;

  while (attempts < maxAttempts && !success) {
    attempts++;
    try {
      const formData = new FormData();
      const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append("file", fileBlob, req.file.originalname);

      Logger.info(
        `Forwarding document upload to AI service (Attempt ${attempts}/${maxAttempts}): ${req.file.originalname}`
      );

      const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
      const aiResponse = await axios.post(
        `${aiServiceUrl}/upload`,
        formData,
        { timeout: 60000 }
      );

      if (aiResponse.data && aiResponse.data.status === "success") {
        document.doc_id = aiResponse.data.doc_id || tempDocId;
        document.status = "OCR_DONE";
        document.chunksCount = aiResponse.data.chunks_count || 0;
        await document.save();
        success = true;
        Logger.info(
          `Successfully parsed document: ${req.file.originalname} (${document.chunksCount} chunks)`
        );
      } else {
        Logger.warn(
          `AI service returned status '${aiResponse.data?.status}' for: ${req.file.originalname}`
        );
      }
    } catch (error) {
      Logger.error(
        `AI service document upload error (Attempt ${attempts}/${maxAttempts}): ${error.message}`
      );
      if (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  if (!success) {
    document.status = "FAILED";
    await document.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(201, document, "Document uploaded and processed"));
});

export const getDocuments = asyncHandler(async (req, res) => {
  let documents = await Document.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  if (documents.length === 0) {
    const defaultDocs = [
      {
        doc_id: "doc_turbine_01",
        name: "Gas_Turbine_Generator_Operation_Manual.pdf",
        size: "14.2 MB",
        format: "PDF",
        status: "OCR_DONE",
        chunksCount: 38,
        owner: req.user._id,
      },
      {
        doc_id: "doc_heat_02",
        name: "Zone_B_Heat_Exchanger_CAD_Layout.pdf",
        size: "3.8 MB",
        format: "PDF",
        status: "OCR_DONE",
        chunksCount: 8,
        owner: req.user._id,
      },
      {
        doc_id: "doc_astm_03",
        name: "ASTM_D302_Pressure_Regulation_Standard.docx",
        size: "5.1 MB",
        format: "DOCX",
        status: "OCR_DONE",
        chunksCount: 14,
        owner: req.user._id,
      },
    ];
    documents = await Document.insertMany(defaultDocs);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, documents, "Documents retrieved successfully"));
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await Document.findById(id);
  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  // Ensure owner is the one deleting
  if (document.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this document");
  }

  try {
    // Notify FastAPI to delete vectors and graph nodes/edges
    if (!document.doc_id.startsWith("temp_")) {
      Logger.info(`Requesting AI service deletion for doc_id: ${document.doc_id}`);
      await axios.delete(
        `${process.env.AI_SERVICE_URL}/upload/${document.doc_id}`,
        { timeout: 20000 }
      );
      Logger.info(`Successfully cleared vectors and nodes for doc_id: ${document.doc_id}`);
    }
  } catch (error) {
    Logger.error(`AI service document deletion error for doc_id: ${document.doc_id}`, error);
  }

  await Document.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Document deleted successfully"));
});

