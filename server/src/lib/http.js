export function planned(_req, res) {
  res.status(501).json({
    status: "planned",
    message: "Endpoint defined in docs/api.md — not implemented yet."
  });
}

export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
