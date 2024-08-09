import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import AppLayoutWithSidebar from "src/app/components/AppLayoutWithSidebar";
import Garden from "src/server/models/GardenModel";
import { authenticator } from "src/app/services/auth.server";

export async function loader({
    params,
    request
}: LoaderFunctionArgs) {
    const gardenId = params.id;

    let user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/account/login"
    });

    try {

        const gardenExists = mongoose.isValidObjectId(gardenId) && await Garden.exists({ _id: gardenId })
        if (!gardenExists) throw new Error("Garden not found.")

        if (!user.gardens.includes(gardenId)) throw new Error("Access denied to garden.")
    
        const garden = await Garden.findById(gardenId);

        return json(garden)
    } catch(e: any) {
        throw new Response(null, {
            status: 404,
            statusText: e.message,
        });
    }
}

export default function Settings() {
    const garden: any = useLoaderData();

    return (
        <AppLayoutWithSidebar>
            <>
                <h1>Settings</h1>
                <input type="text" defaultValue={garden.name} />
            </>
        </AppLayoutWithSidebar>
    )
}