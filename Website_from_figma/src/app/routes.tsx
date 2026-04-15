import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { WorksPage } from "./pages/WorksPage";
import { TimelinePage } from "./pages/TimelinePage";
import { ArticlesListPage } from "./pages/ArticlesListPage";
import { ArticlePage } from "./pages/ArticlePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "works", Component: WorksPage },
      { path: "timeline", Component: TimelinePage },
      { path: "articles", Component: ArticlesListPage },
      { path: "articles/:id", Component: ArticlePage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);