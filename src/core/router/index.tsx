import { Suspense } from "react";
import { publicRoutes } from "./routes/public.routes";
import type { AppRoute } from "./types/route.type";
import { useRoutes } from "react-router-dom";
import Loader from "@/components/Loader";

const routes = [
  ...publicRoutes
];

const renderRoutes = (routes: AppRoute[]) => {
  return routes.map(route => {
    const Page = route.element;

    let content = (
      <Suspense fallback={<Loader/>}>
        <Page />
      </Suspense>
    );

    if (route.guard) {
      const Guard = route.guard;

      content = (
        <Guard>
          {content}
        </Guard>
      );
    }

    if(route.layout) {
      const Layout = route.layout;

      content = (
        <Layout>
          {content}
        </Layout>
      );
    }

    return {
      path: route.path,
      element: content
    }
  })

}

export default function AppRouter() {
  return useRoutes(
    renderRoutes(routes)
  )
}