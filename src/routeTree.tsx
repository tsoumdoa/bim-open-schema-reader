import Home from "./app/page";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";

const rootRoute = createRootRoute({
	component: () => <Outlet />,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: Home,
});

export const routeTree = rootRoute.addChildren([indexRoute]);
