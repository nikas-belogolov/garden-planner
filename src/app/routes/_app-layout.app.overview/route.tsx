import { useActionData, useLoaderData } from "@remix-run/react";
import AppLayoutWithSidebar from "src/app/components/AppLayoutWithSidebar";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "src/app/services/auth.server";
import { createGarden, getGardens } from "src/app/services/app.server";
import GardenCard from "./GardenCard";
import Modal from "../../components/Modal";
import { commitSession, getSession } from "src/app/services/session.server";

export async function action({
    request,
}: ActionFunctionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );

    const formData = await request.formData();
    const { gardenName, gardenLocation, gardenWidth, gardenHeight }: any = Object.fromEntries(formData)
    let user = session.get("user")

    if (user.gardens.length >= 3) return json({
        gardens: {
            message: "Maximum amount of gardens reached."
        }
    });

    try {
        let { newUser, garden } = await createGarden({
            name: gardenName,
            location: gardenLocation,
            width: gardenWidth,
            height: gardenHeight,
            authorId: user._id
        });

        return redirect(`/app/garden/${garden._id}?mode=edit`, {
            headers: {
                "Set-Cookie": await commitSession(session),
            }
        });
    } catch (errors: any) {
        return json(errors.errors);
    }
}

// export const handle = {
//     scripts: () => [{ src: '/statics/scripts/bootstrap.min.js' }, { src: '/statics/scripts/app.js' }]
// };

export default function Overview() {
    const {user, userGardens} = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    return (//<AppLayoutWithSidebar>
        <>
            { user.gardens.length == 0 ? <div>
                No Gardens
            </div> : <div>
                
            </div> }
            <section className="overview-section">
                <header className="flex">
                    <h2 className="flex-1 m-0">My Gardens </h2>
                    <Modal errors={actionData} toggleModalButtonDisabled={user.gardens.length == 3} />

                </header>
                <div className="gardens">
                    <div className="row row-cols-3">
                        {userGardens.map((garden:any) =>
                            <div key={garden.name} className="col">
                                <GardenCard garden={garden}  />
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {/* <section className="overview-section">
                <h2>Community Gardens</h2>
                    <div className="gardens">
                    <div className="row row-cols-3">
                        {communityGardens.map((garden:any) =>
                            <div key={garden.name} className="col">
                                <GardenCard garden={garden}  />
                            </div>
                        )}
                    </div>
                </div>
            </section> */}
        </>)
    //</AppLayoutWithSidebar>
}

export async function loader({ request }: LoaderFunctionArgs) {
    let user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/account/login"
    });

    const userGardens = await getGardens(user);

    return json({user, userGardens})
}