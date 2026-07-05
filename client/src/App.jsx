import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import Layout from "./components/Layout.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import BetweenSearchPage from "./pages/BetweenSearchPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DiningPage from "./pages/DiningPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import HeritagePage from "./pages/HeritagePage.jsx";
import PnrPage from "./pages/PnrPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import LegacyArchivePage from "./pages/LegacyArchivePage.jsx";
import TrainSearchHubPage from "./pages/TrainSearchHubPage.jsx";
import TrainDetailPage from "./pages/TrainDetailPage.jsx";
import TrainLivePage from "./pages/TrainLivePage.jsx";
import TrainRoutePage from "./pages/TrainRoutePage.jsx";
import StationHubPage from "./pages/StationHubPage.jsx";
import StationBoardPage from "./pages/StationBoardPage.jsx";
import StationLivePage from "./pages/StationLivePage.jsx";
import TrainLookupPage from "./pages/TrainLookupPage.jsx";
import StationLookupPage from "./pages/StationLookupPage.jsx";

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/archive" element={<LegacyArchivePage />} />
          <Route path="/trains/between" element={<BetweenSearchPage />} />
          <Route path="/trains" element={<ResultsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/pnr" element={<PnrPage />} />
          <Route path="/live" element={<TrainLivePage />} />
          <Route path="/train/route" element={<TrainRoutePage />} />
          <Route path="/train" element={<TrainSearchHubPage />} />
          <Route path="/train/:trainNumber/live" element={<TrainLivePage />} />
          <Route path="/train/:trainNumber/route" element={<TrainRoutePage />} />
          <Route path="/train/:trainNumber" element={<TrainDetailPage />} />
          <Route path="/station" element={<StationHubPage />} />
          <Route path="/station/board" element={<Navigate to="/station" replace />} />
          <Route path="/station/live" element={<Navigate to="/station" replace />} />
          <Route path="/station/:code/board" element={<StationBoardPage />} />
          <Route path="/station/:code/live" element={<StationLivePage />} />
          <Route path="/lookup/trains" element={<TrainLookupPage />} />
          <Route path="/lookup/stations" element={<StationLookupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dining" element={<DiningPage />} />
          <Route path="/heritage" element={<HeritagePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/history" element={<Navigate to="/about" replace />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}
