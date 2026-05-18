import PublicLayout from "@/layouts/PublicLayout";
import { lazy } from "react";
import GuestGuard from "../guards/GuestGuard";
import type { AppRoute } from "../types/route.type";

export const publicRoutes: AppRoute[] = [
  {
    path: "/",
    element: lazy(() => import("@/pages/Login")),
    layout: PublicLayout,
  },

  {
    path: "/dashboard",
    element: lazy(() => import("@/pages/Dashboard")),
    layout: PublicLayout,
    guard: GuestGuard,
  },

  {
    path: "/registro/paso1",
    element: lazy(() => import("@/pages/RegistroPaso1")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/registro/ubicacion",
    element: lazy(() => import("@/pages/RegistroPaso2")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/registro/mascotas",
    element: lazy(() => import("@/pages/RegistroPaso3")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/registro/confirmacion",
    element: lazy(() => import("@/pages/RegistroPaso4")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/configuracion",
    element: lazy(() => import("@/pages/Configuracion")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/pagos",
    element: lazy(() => import("@/pages/Pagos")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/historial",
    element: lazy(() => import("@/pages/MiHistorial")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/solicitar-paseo",
    element: lazy(() => import("@/pages/SolicitarPaseo")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/registro-paseador/paso1",
    element: lazy(() => import("@/pages/Paseador/RegistroPaseadorPaso1")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/registro-paseador/paso2",
    element: lazy(() => import("@/pages/Paseador/RegistroPaseadorPaso2")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/registro-paseador/paso3",
    element: lazy(() => import("@/pages/Paseador/RegistroPaseadorPaso3")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/dashboard-paseador",
    element: lazy(() => import("@/pages/Paseador/DashboardPaseador")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/horarios-paseador",
    element: lazy(() => import("@/pages/Paseador/HorariosPaseador")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/historial-paseador",
    element: lazy(() => import("@/pages/Paseador/HistorialPaseador")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
  {
    path: "/configuracion-paseador",
    element: lazy(() => import("@/pages/Paseador/ConfiguracionPaseador")),
    layout: PublicLayout,
    guard: GuestGuard,
  },
];