import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./Home";
import PrimePage from "./Prime";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prime" element={<PrimePage />} />
      </Routes>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prime" element={<PrimePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
