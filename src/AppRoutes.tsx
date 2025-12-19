import { HashRouter, Route, Routes } from "react-router-dom";

import Header from "./Header";
import HomePage from "./routes/Home";
import InvincibleTank from "./routes/InvincibleTank";
import LinksPage from "./routes/Links";
import Page404 from "./routes/Page404";
import PrimePage from "./routes/Prime";
import ProductsPage from "./routes/Products";
import RandomPickerPage from "./routes/RandomPicker";
import IonPage from "./routes/Chemistry_ion";
import ThinkersListPage from "./routes/ThinkersList";
import ThinkersQuizPage from "./routes/ThinkersQuiz";
import PublicEthicsPage from "./routes/PublicEthics";

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
              <Route element={<PublicEthicsPage />} path="/public_ethics" />
              <Route element={<ThinkersListPage />} path="/thinkers" />
              <Route element={<ThinkersQuizPage />} path="/thinkers_quiz" />
              <Route element={<LinksPage />} path="/links" />
              <Route element={<InvincibleTank />} path="/invincibletank" />
              <Route element={<IonPage />} path="/chemistry_ion" />
              <Route element={<Page404 />} path="*" />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </div>
  );
};

export default AppRoutes;
