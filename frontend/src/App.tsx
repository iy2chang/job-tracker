import { Link, Route, Routes } from "react-router";
import ApplicationsPage from "./pages/ApplicationsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import NewApplicationPage from "./pages/NewApplicationPage";
import BoardPages from "./pages/BoardPage";

export default function App() {
  return (
    <>
      <header className="header">
        <Link to="/">Job Tracker</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ApplicationsPage />} />
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/new" element={<NewApplicationPage />} />
          <Route path="/board" element={<BoardPages />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
