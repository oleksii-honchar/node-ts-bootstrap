import rateLimit from "express-rate-limit";

const windowMin = parseInt(process.env.SVC_RATE_LIMIT_WINDOW_MINUTES as string, 10);
const maxRequests = parseInt(process.env.SVC_RATE_LIMIT_MAX_REQUESTS as string, 10);

export const rateLimitMiddleware: rateLimit.RateLimit = rateLimit({
  windowMs: windowMin * 60 * 1000,
  max: maxRequests,
});
