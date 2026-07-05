export default function BookingStepper({ current }) {
  const map = { passengers: 0, locked: 1, payment: 3, done: 4 };
  const active = map[current] ?? 0;

  return (
    <ol className="booking-stepper" aria-label="Booking progress">
      {["Search", "Lock seats", "Passengers", "Pay", "Confirm"].map((label, i) => (
        <li key={label} className={`booking-step${i <= active ? " is-done" : ""}${i === active ? " is-current" : ""}`}>
          <span className="booking-step-dot">{i + 1}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}
