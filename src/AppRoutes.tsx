import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./routes/Home";
import PrimePage from "./routes/Prime";
import Sidebar from "./Sidebar";

const AppRoutes = () => {
  return (
    <div>
      <BrowserRouter>
        <div className="wrapper">
          <Sidebar />
          <div className="mainelement">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prime" element={<PrimePage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default AppRoutes;