/**
 * Wraps async Express route handlers to automatically catch any thrown errors
 * and forward them to the global Express error handling middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
