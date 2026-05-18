import type { ComponentChild } from "@/app/types/basic.type";
import { type ComponentType, type LazyExoticComponent, type ReactElement } from "react";

export interface AppRoute {
  path: string;
  element: LazyExoticComponent<() => ReactElement>;
  layout?: ComponentType<ComponentChild>;
  guard?: ComponentType<ComponentChild>;
  roles?: string[];
  children?: AppRoute[];
}