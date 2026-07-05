import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [lastSearch, setLastSearch] = useState({
    from: "",
    to: "",
    fromName: "",
    toName: "",
    date: "",
    class: "CC",
    quota: "GN"
  });
  const [passengers, setPassengers] = useState([{ name: "Aarav Sharma", age: 32, gender: "Male" }]);
  const [bookingResult, setBookingResult] = useState(null);

  const value = useMemo(
    () => ({
      stations,
      setStations,
      trains,
      setTrains,
      selectedTrain,
      setSelectedTrain,
      lastSearch,
      setLastSearch,
      passengers,
      setPassengers,
      bookingResult,
      setBookingResult
    }),
    [stations, trains, selectedTrain, lastSearch, passengers, bookingResult]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
