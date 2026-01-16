import { HashRouter, Route, Routes } from "react-router-dom";

import Header from "./Header";
import IonPage from "./routes/Chemistry_ion";
import HomePage from "./routes/Home";
import InvincibleTank from "./routes/InvincibleTank";
import LinksPage from "./routes/Links";
import Page404 from "./routes/Page404";
import PrimePage from "./routes/Prime";
import ProductsPage from "./routes/Products";
import PublicEthicsPage from "./routes/PublicEthics";
import PublicEthicsPage_final from "./routes/PublicEthics_final";
import RandomPickerPage from "./routes/RandomPicker";
import ThinkersListPage from "./routes/ThinkersList";
import ThinkersListPage_final from "./routes/ThinkersList_final";
import ThinkersQuizPage from "./routes/ThinkersQuiz.tsx";
import ThinkersQuizPage_final from "./routes/ThinkersQuiz_final";
import TimerPage from "./routes/Timer";

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
              <Route element={<TimerPage />} path="/timer" />

              <Route element={<RandomPickerPage />} path="/randompicker" />
              <Route element={<ProductsPage />} path="/products" />
              <Route element={<PublicEthicsPage />} path="/public_ethics" />
              <Route element={<ThinkersListPage />} path="/thinkers" />
              <Route element={<ThinkersQuizPage />} path="/thinkers_quiz" />
              <Route
                element={<ThinkersListPage_final />}
                path="/thinkers_final"
              />
              <Route
                element={<ThinkersQuizPage_final />}
                path="/thinkers_quiz_final"
              />
              <Route
                element={<PublicEthicsPage_final />}
                path="/public_ethics_final"
              />
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
