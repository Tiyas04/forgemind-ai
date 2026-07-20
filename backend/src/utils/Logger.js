export const Logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, Object.keys(meta).length ? meta : "");
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, Object.keys(meta).length ? meta : "");
  },
  error: (message, error = {}, meta = {}) => {
    console.error(
      `[ERROR] [${new Date().toISOString()}] ${message} - Error: ${error.message || error}`,
      Object.keys(meta).length ? meta : ""
    );
  }
};
