import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import mongoose from "mongoose";
import Garden from "src/server/models/GardenModel";
import { createLayout } from "src/app/services/app.server";
import { authenticator } from "src/app/services/auth.server";
import { commitSession, getSession } from "src/app/services/session.server";

export async function action({
    request,
    params
}: ActionFunctionArgs) {

    const user = await authenticator.isAuthenticated(request);

    if (!user) return json({})

    const { id } = params;

    const gardenExists = mongoose.isValidObjectId(id) && await Garden.exists({ _id: id })


    if (!gardenExists) return json({})

    if (!user.gardens.includes(id)) return json({})

    const formData = await request.formData();
    const { name, width, height, units }: any = Object.fromEntries(formData)

    console.log(name)



    try {
        const layout: any = await createLayout({
            name,
            width,
            height,
            units,
            gardenId: id
        });

        console.log("layout created successfully")
        

        return redirect(`/app/garden/${id}/layouts/${layout.id}?mode=edit`, {
            // headers: {
            //     "Set-Cookie": await commitSession(session),
            // }
        });
        return json({})
    } catch (error) {
        return json(error)
    }

    return json({ name })

}