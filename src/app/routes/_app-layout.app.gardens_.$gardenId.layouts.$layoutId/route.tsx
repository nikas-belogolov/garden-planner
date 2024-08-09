import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import Garden, { IGarden, IPermission } from "src/server/models/GardenModel";
import { isRouteErrorResponse, useLoaderData, useNavigation, useParams, useRouteError } from "@remix-run/react";
import Toolbar from "~/components/Layout/Toolbar";
import Menu from "~/components/Layout/Menu";
import mongoose from "mongoose";

import LayoutModel, { ILayout } from 'src/server/models/LayoutModel'

import { LayoutContext, LayoutContextProvider } from "src/app/context/LayoutContext";

import { useContext, useEffect, useRef, useState } from "react";

import Rulers from "../../components/Layout/Canvas/Rulers";
// import Layout from "../../components/Layout/Canvas/Grid";

import Layout from "~/components/Layout";

import { MeasurementUnit } from "../../components/Layout/Canvas/utils";
import useSocket from "src/app/hooks/useSocket";
import { SocketContextProvider } from "src/app/context/SocketContext";
 

export async function loader({
    params,
    context: { req, user }
}: LoaderFunctionArgs) {
  const { gardenId, layoutId } = params;


  const layoutExists =
    mongoose.isValidObjectId(gardenId) &&
    mongoose.isValidObjectId(layoutId) &&
    await Garden.exists({ _id: gardenId, layouts: new mongoose.Types.ObjectId(layoutId) }) &&
    await LayoutModel.exists({ _id: new mongoose.Types.ObjectId(layoutId) });
                        
  if (!layoutExists) throw new Response("Layout not found.", { status: 404, statusText: "Layout not found." })

  try {

    const layout = await LayoutModel.findById<ILayout>(layoutId);
    const garden = await Garden.findById<IGarden>(gardenId).lean() as IGarden;


    // The garden need to be public to be seen by unauthenticated users.
    if (req.isUnauthenticated() && garden.private)
      throw new Response("Need permission from owner to view layout.", { status: 403 }) 
    else if (req.isUnauthenticated() && !garden.private) return json({ layout, role: "viewer" });

    // User is the owner
    if (garden.owner.equals(user.id)) return json({ layout, user, role: "owner" });


    // User has permission
    const permission: IPermission | undefined = garden.permissions.find(permission => permission.user.equals(user.id));

    // User has no permission
    if (!permission) throw new Response("Need permission from owner to view layout.", { status: 403 });

    return json({ layout, user, role: permission.role });

  } catch (e: any) {
    throw new Response(null, {
      status: e.status,
      statusText: e.message,
    });
  }

  // Layout needs to be public to be viewed by unauthenticated users
  // if (req.isUnauthenticated() && ) throw new Response("Need permission from owner to view layout.");

  // if (!user.gardens.includes(gardenId!)) throw new Response("Need permission from owner to view layout.", { status: 403 })

  // try {

  //     const layout = await LayoutModel.findById(layoutId);

  //     return json({layout, user})
  // } catch(e: any) {
  //   throw new Response(null, {
  //         status: e.status,
  //         statusText: e.message,
  //     });
  // }
}

export async function action({
  params,
  request,
  context: { req, user }
}: ActionFunctionArgs) {
  const { gardenId, layoutId } = params;
  
  if (req.isUnauthenticated()) throw new Response(null, { status: 401 })

  const layoutExists =
    mongoose.isValidObjectId(gardenId) &&
    mongoose.isValidObjectId(layoutId) &&
    !!await Garden.exists({ _id: gardenId, layouts: layoutId });
             
  if (!layoutExists) throw new Response(null, { status: 404 })

  if (!user.gardens.includes(gardenId!)) throw new Response(null, { status: 403 })

  if (request.method == 'PUT') {
    try {
      const data = await request.json();

      if (data.name && typeof data.name == "string") {
        await LayoutModel.findByIdAndUpdate(layoutId, { name: data.name })
      }
    } catch (error) {
      throw new Response(null, { status: 400 })
    }
  }

  return null
}

export function ErrorBoundary() {
    const error: any = useRouteError();

    return (
        <main className="grid h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-green-600">{error?.status}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {isRouteErrorResponse(error) ? error?.statusText : error instanceof Error ? error.message : "Unknown Error"}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
        {isRouteErrorResponse(error) && error?.status == 404 ? "Sorry, we couldn’t find the page you’re looking for." : "Something went wrong.  "}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/app/overview"
            className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Go back home
          </a>
        </div>
      </div>
    </main>
    )
}

export default function GardenLayout() {

    const { layoutId: ROOM_ID } = useParams()
    const {layout, role }: any = useLoaderData();

    return (
      <LayoutContextProvider>
        <SocketContextProvider>
          <Layout layout={layout} role={role} />
          {/* <Toolbar />
          <Menu layoutName={layout.name} />
          <div className="app-layout-canvas-container h-screen w-screen pointer-events-none">
            <div className="h-screen w-screen absolute z-10">
              <Rulers />
            </div>
            <div className="absolute" style={{pointerEvents: "all" }}>
              <Layout layout={layout} ROOM_ID={ROOM_ID} />
            </div>
          </div> */}
        </SocketContextProvider>
      </LayoutContextProvider>
    )
}