import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import AppLayoutWithSidebar from "src/app/components/AppLayoutWithSidebar";
import Garden from "src/server/models/GardenModel";
import { authenticator } from "src/app/services/auth.server";

export async function loader({ request, params, context: { req, user } }: LoaderFunctionArgs) {
    const { id } = params;

    if (req.isUnauthenticated()) return redirect("/account/login")

    try {

        const gardenExists = mongoose.isValidObjectId(id) && await Garden.exists({ _id: id })
        if (!gardenExists) throw new Error("Garden not found.")

        if (!user.gardens.includes(id!)) throw new Error("Access denied to garden.")
    
        const garden = await Garden.findById(id).populate("layouts", "name");

        return json(garden)
    } catch(e: any) {
        throw new Response(null, {
            status: 404,
            statusText: e.message,
        });
    }
}

export default function GardenOverview() {
    const garden: any = useLoaderData()

    return (
        <AppLayoutWithSidebar data={garden}>
            <h1>{garden.name}</h1>
        </AppLayoutWithSidebar>
    )
}