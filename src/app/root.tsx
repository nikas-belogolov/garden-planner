import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import tailwindStyles from "./tailwind.css?url";

import globalStyles from "~/styles/globals.css?url"
import bootstrapStyles from "~/styles/bootstrap.min.css?url"
import fontAwesomeStyles from "~/styles/fontawesome/css/all.min.css?url"

export const links = () => [
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: bootstrapStyles },
  { rel: "stylesheet", href: fontAwesomeStyles },
];

import React, { useContext } from "react";

import { NonceContext } from "./components/nonce-context";
import { Provider } from "react-redux";
import {store} from "./redux/store";



export function ErrorBoundary() {
  const error: any = useRouteError();

  return (
    <main className="grid h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-green-600">{error?.status}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          {isRouteErrorResponse(error) ? error?.statusText : error instanceof Error ? error.message : "Unknown Error"}
        </h1>
        <p className="mt-6 text-base leading-7">
        {isRouteErrorResponse(error) && error?.status == 404 ? "Sorry, we couldn’t find the page you’re looking for." : "Something went wrong.  "}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/"
            className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Go back home
          </a>
        </div>
      </div>
    </main>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const nonce = useContext(NonceContext);


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
