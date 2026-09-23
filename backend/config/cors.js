export const isOriginAllowed = (origin) => {
  // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
  if (!origin) return true;

  const cleanOrigin = origin.replace(/\/+$/, "");

  const envOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  const allowedOrigins = [
    ...envOrigins,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
  ];

  // Exact match with env or local dev origins
  if (allowedOrigins.includes(cleanOrigin)) {
    return true;
  }

  // Allow all Vercel deployments (*.vercel.app and preview domains)
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(cleanOrigin)) {
    return true;
  }

  // Allow all Render deployments (*.onrender.com)
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*onrender\.com$/.test(cleanOrigin)) {
    return true;
  }

  return false;
};

export const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Request blocked from origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};
