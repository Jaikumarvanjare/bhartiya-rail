export default function StatusChip({ status, seats }) {
  const key =
    status === "Available" || status === "On time" ? "is-available"
      : status === "RAC" || status === "Timetable" ? "is-rac"
        : status === "Delayed" || status === "Departed" ? "is-waitlist"
          : "is-waitlist";
  return (
    <span className={`status-chip ${key}`}>
      {status}
      {seats != null ? ` · ${seats} seats` : ""}
    </span>
  );
}
