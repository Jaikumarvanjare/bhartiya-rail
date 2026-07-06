export function notFound(_req, res) {
  res.status(404).json({ error: "Not found" });
}

function publicMessage(err) {
  const code = err?.code;
  const msg = String(err?.message || "");
  if (code === "P1001" || code === "P1017" || msg.includes("Can't reach database")) {
    return "Database unavailable. Start PostgreSQL: docker compose up -d && npm run db:setup";
  }
  return err.message || "Internal server error";
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(err.status || 500).json({ error: publicMessage(err) });
}
