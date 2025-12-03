import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import type {
  ChildrenNamesFromRoute,
  CustomRouteMap,
  DefineChildrenFn,
  RouteRecordUnion,
  _RouteRecordRaw,
} from "./types";

export const resolveRouteTitle = (route: RouteLocationNormalized): void => {
  if (!route.meta) return;
  if (route.meta.title.isDynamic && route.meta.title.pattern) {
    let titleValue = route.meta.title.pattern as string;

    route.meta.title.propsMap!.forEach(([prop, path]) => {
      let propValue = route as any;
      const pathArray = (path as string).split(".");
      pathArray.forEach((propKey) => {
        // @ts-ignore
        propValue = propValue[propKey];
      });
      titleValue = titleValue!.replace(`<[${prop as string}]>`, `${propValue}`);
    });
    document.title = titleValue;
  } else {
    document.title = route.meta.title.default;
  }
};

export const defineRouteRecord = <Name extends keyof CustomRouteMap>(
  route: _RouteRecordRaw<Name>
): _RouteRecordRaw<Name> => {
  return route;
};

export const defineChildRouteRecord = <
  ParentName extends keyof CustomRouteMap,
  ChildName extends ChildrenNamesFromRoute<ParentName>
>(
  _parent: ParentName,
  config: _RouteRecordRaw<ChildName>
): _RouteRecordRaw<ChildName> => {
  return config;
};

export const createChildDefiner = <ParentName extends keyof CustomRouteMap>(
  _parent: ParentName
): DefineChildrenFn<ParentName> => {
  return (config) => config;
};

export const defineRoutes = (
  routes: Readonly<RouteRecordUnion[]>
): Readonly<RouteRecordRaw[]> => {
  return routes as Readonly<RouteRecordRaw[]>;
};
