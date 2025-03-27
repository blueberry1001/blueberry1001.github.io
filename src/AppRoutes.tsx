import { HashRouter, Route, Routes } from "react-router-dom";

import Header from "./Header";
import HomePage from "./routes/Home";
import InvincibleTank from "./routes/InvincibleTank";
import LinksPage from "./routes/Links";
import Page404 from "./routes/Page404";
import PrimePage from "./routes/Prime";
import ProductsPage from "./routes/Products";
import RandomPickerPage from "./routes/RandomPicker";

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

              <Route element={<RandomPickerPage />} path="/randompicker" />
              <Route element={<ProductsPage />} path="/products" />
              <Route element={<LinksPage />} path="/links" />
              <Route element={<InvincibleTank />} path="/invincibletank" />
              <Route element={<Page404 />} path="*" />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </div>
  );
};

export default AppRoutes;
