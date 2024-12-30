import { HashRouter, Route, Routes } from "react-router-dom";

import Header from "./Header";
import HomePage from "./routes/Home";
import Page404 from "./routes/Page404";
import PrimePage from "./routes/Prime";

const AppRoutes = () => {
  return (
    <div>
      <Header />
      <HashRouter>
        <div className="wrapper">
          {/* <Sidebar /> */}
          <div className="mainelement">
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<PrimePage />} path="/prime" />
              <Route element={<Page404 />} path="*" />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </div>
  );
};

export default AppRoutes;
