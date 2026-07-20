import api from "@/lib/axios";

// Documents APIs
export const getDocuments = async () => {
  const response = await api.get("/documents");
  return response.data;
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

// Chat API
export const askQuestion = async (question: string) => {
  const response = await api.post("/chat", { question });
  return response.data;
};

// Dashboard API
export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

// Graph Network API
export const getGraph = async () => {
  const response = await api.get("/graph");
  return response.data;
};

// Compliance API
export const getCompliance = async () => {
  const response = await api.get("/compliance");
  return response.data;
};

export const downloadComplianceReport = async (data: any) => {
  const response = await api.post("/compliance/report", data, {
    responseType: "blob",
  });
  return response.data;
};

export const generateLLMComplianceReport = async () => {
  const response = await api.post("/compliance/generate-llm-report");
  return response.data;
};

export const toggleEquipment = async (id: string) => {
  const response = await api.put(`/dashboard/equipment/${id}`);
  return response.data;
};
