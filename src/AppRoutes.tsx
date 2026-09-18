import { lazy, Suspense, useEffect } from "react";
import {
  HashRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Header from "./Header";
import Analytics from "./components/Analytics";
import PageLoading from "./components/PageLoading";
import PortfolioLayout from "./routes/portfolio/PortfolioLayout";
import PreviewLayout from "./routes/portfolio/PreviewLayout";
const AtCoderRatingVisualizer = lazy(
  () => import("./routes/AtCoderRatingVisualizer")
);
const IonPage = lazy(() => import("./routes/Chemistry_ion"));
const DistanceFromPointPage = lazy(() => import("./routes/DistanceFromPoint"));
const HomePage = lazy(() => import("./routes/Home"));
const InvincibleTank = lazy(() => import("./routes/InvincibleTank"));
const LinksPage = lazy(() => import("./routes/Links"));
const Page404 = lazy(() => import("./routes/Page404"));
const PrimePage = lazy(() => import("./routes/Prime"));
const PublicEthicsPage = lazy(() => import("./routes/PublicEthics"));
const PublicEthicsPage_final = lazy(
  () => import("./routes/PublicEthics_final")
);
const RandomPickerPage = lazy(() => import("./routes/RandomPicker"));
const ThinkersListPage = lazy(() => import("./routes/ThinkersList"));
const ThinkersListPage_final = lazy(
  () => import("./routes/ThinkersList_final")
);
const ThinkersQuizPage = lazy(() => import("./routes/ThinkersQuiz.tsx"));
const ThinkersQuizPage_final = lazy(
  () => import("./routes/ThinkersQuiz_final")
);
const ThreeDRougeAction = lazy(() => import("./routes/ThreeDRougeAction"));
const TimerPage = lazy(() => import("./routes/Timer"));
const WasmTest = lazy(() => import("./routes/WasmTest.tsx"));
const PointSystem = lazy(() => import("./routes/pointsystem.tsx"));
const PortfolioArticleDetail = lazy(
  () => import("./routes/portfolio/PortfolioArticleDetail")
);
const PortfolioArticles = lazy(
  () => import("./routes/portfolio/PortfolioArticles")
);
const PortfolioHome = lazy(() => import("./routes/portfolio/PortfolioHome"));
const PortfolioLinks = lazy(() => import("./routes/portfolio/PortfolioLinks"));
const PortfolioTimeline = lazy(
  () => import("./routes/portfolio/PortfolioTimeline.tsx")
);
const PortfolioWorks = lazy(() => import("./routes/portfolio/PortfolioWorks"));
const Cucumvivor = lazy(() => import("./routes/Cucumvivor"));
const LumenTrace = lazy(() => import("./routes/LumenTrace"));
const PreviewHome = lazy(() => import("./routes/portfolio/PreviewHome"));
const PortfolioSkills = lazy(
  () => import("./routes/portfolio/PortfolioSkills")
);

const LegacyLayout = () => {
  return (
    <div>
      <Header />

      <div className="wrapper">
        <div className="mainelement">
          <Suspense fallback={<PageLoading appearance="legacy" />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function RoutePosition() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppRoutes = () => {
  return (
    <HashRouter>
      <RoutePosition />
      <Analytics />
      <Routes>
        {/* =====================================================
            Root
            ===================================================== */}

        <Route element={<Navigate replace to="/home" />} path="/" />

        {/* =====================================================
            Point System
            -----------------------------------------------------
            PortfolioLayoutの外に置くことで、
            Header / Footer / PortfolioLayoutを完全に回避する。
            ===================================================== */}

        <Route
          element={
            <Suspense fallback={<PageLoading appearance="standalone" />}>
              <PointSystem />
            </Suspense>
          }
          path="/pointsystem"
        />

        <Route element={<PreviewLayout />}>
          <Route element={<PreviewHome />} path="/preview" />
          <Route element={<PortfolioSkills />} path="/skills" />
        </Route>

        {/* =====================================================
            Portfolio
            ===================================================== */}

        <Route element={<PortfolioLayout />}>
          <Route element={<PortfolioHome />} path="/home" />

          <Route element={<PortfolioWorks />} path="/works" />
          <Route element={<Cucumvivor />} path="/cucumvivor" />
          <Route element={<LumenTrace />} path="/lumen-trace" />

          <Route element={<Navigate replace to="/works" />} path="/products" />

          <Route element={<PrimePage />} path="/prime" />

          <Route element={<WasmTest />} path="wasmtest" />

          <Route element={<TimerPage />} path="/timer" />

          <Route element={<RandomPickerPage />} path="/randompicker" />

          <Route
            element={<AtCoderRatingVisualizer />}
            path="/atcoder-rating-visualizer"
          />

          <Route
            element={<DistanceFromPointPage />}
            path="/distance-from-point"
          />

          <Route element={<PublicEthicsPage />} path="/public_ethics" />

          <Route
            element={<PublicEthicsPage_final />}
            path="/public_ethics_final"
          />

          <Route element={<ThinkersListPage />} path="/thinkers" />

          <Route element={<ThinkersQuizPage />} path="/thinkers_quiz" />

          <Route element={<ThinkersListPage_final />} path="/thinkers_final" />

          <Route
            element={<ThinkersQuizPage_final />}
            path="/thinkers_quiz_final"
          />

          <Route element={<InvincibleTank />} path="/invincibletank" />

          <Route element={<ThreeDRougeAction />} path="/3d-rogue-action" />

          <Route element={<IonPage />} path="/chemistry_ion" />

          <Route element={<PortfolioTimeline />} path="/timeline" />

          <Route element={<PortfolioArticles />} path="/articles" />

          <Route element={<PortfolioArticleDetail />} path="/articles/:id" />

          <Route element={<PortfolioLinks />} path="/links" />

          <Route element={<Navigate replace to="/works" />} path="/about" />

          <Route element={<Navigate replace to="/works" />} path="/projects" />

          <Route element={<Navigate replace to="/links" />} path="/contact" />

          <Route element={<Page404 />} path="*" />
        </Route>

        {/* =====================================================
            Legacy
            ===================================================== */}

        <Route element={<LegacyLayout />}>
          <Route element={<HomePage />} path="/legacy/home" />

          <Route
            element={<Navigate replace to="/works" />}
            path="/legacy/products"
          />

          <Route element={<LinksPage />} path="/legacy/links" />

          <Route element={<Page404 />} path="*" />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
