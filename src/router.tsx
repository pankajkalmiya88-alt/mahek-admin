import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

import LoadingSpinner from "./shared-component/loading/LoadingSpinner";
import AuthGuard from "./guards/Auth.guard";
import ProjectGuard from "./guards/Project.guard";

// Auth
const AuthLayout = lazy(() => import("./auth/auth-layout/AuthLayout"));
const LoginPage = lazy(() => import("./auth/pages/LoginPage"));

// Layout Module & coponent
const ProjectLayout = lazy(() => import("./project-layout/ProjectLayout"));

// Dashboard
const DashboardPage = lazy(() => import("./modules/shared-modules/pages/DashboardPage"));

// Products
const ProductLayout = lazy(() => import("./modules/products/layouts/ProductsLayout"));
const ProductListPage = lazy(() => import("./modules/products/pages/ProductsListPage"));
const AddEditProductPage = lazy(() => import("./modules/products/pages/AddEditProductPage"));

// ===== Reusable Suspense Wrapper =====
const withSuspense = (Component: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "auth",
    element: <ProjectGuard>{withSuspense(AuthLayout)}</ProjectGuard>,
    children: [
      {
        path: "login",
        element: withSuspense(LoginPage),
      },
    ],
  },

  {
    path: '',
    element: (
      <AuthGuard>
      {withSuspense(ProjectLayout)}
    </AuthGuard>
  ),
  children: [
      // Dashboard
      { path: "dashboard", element: withSuspense(DashboardPage) },

      // Products

      {
        path: 'products',
        element: withSuspense(ProductLayout),
        children: [
          // { path: "products", element: withSuspense(ProductListPage) },
          { index: true, element: withSuspense(ProductListPage) },
          { path: 'add-product', element: withSuspense(AddEditProductPage) },
          { path: 'edit-product/:id', element: withSuspense(AddEditProductPage) }

        ]
      }

    ]
  }
]);
