import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import FormInput from "src/app/components/Input";
import { authenticator, createUser } from "src/app/services/auth.server";
import { commitSession, getSession } from "src/app/services/session.server";

import accountStyles from "~/styles/account.css?url"

export const links = () => [
    { rel: "stylesheet", href: accountStyles },
];

export async function action({
    request,
}: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        console.log(Object.fromEntries(formData))

        const { username, email, password }: any = Object.fromEntries(formData);


        const { user, garden }: any = await createUser({ username, email, password });

        let session = await getSession(request.headers.get("cookie"))
        session.set(authenticator.sessionKey, user)
  
        return redirect(`/app/gardens/${user.gardens[0]}/settings`, {
          headers: { "Set-Cookie": await commitSession(session) },
        });

      } catch (errors: any) {
        console.log(errors.errors)
        return errors.errors;  
      }
}

export async function loader({ request }: LoaderFunctionArgs) {
    // If the user is already authenticated redirect to /dashboard directly
    const user = await authenticator.isAuthenticated(request, {
        successRedirect: "/app/overview",
    });

    return null
}

export default function Register() {
    const error: any = useActionData<typeof action>();
    const navigation = useNavigation();

    console.log(error)

    return (
        <div className="flex h-screen">
            <div className="flex-1 overflow-hidden flex items-center justify-center">
                <div className="relative -mt-32">
                    <div className="absolute z-10 md:-ml-32 lg:-ml-10 md:-mt-32 lg:mt-32 border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[400px] w-[200px]">
                    </div>
                    <div className="md:hidden lg:block">
                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                            <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
                                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/laptop-screen.png" className="dark:hidden h-[156px] md:h-[278px] w-full rounded-xl" alt="" />
                                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/laptop-screen-dark.png" className="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg" alt="" />
                            </div>
                        </div>
                            <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
                            <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
                        </div>
                    </div>
                </div>
            </div>
            <main className="w-screen h-screen md:w-1/2 lg:w-1/3 p-5">
                <h1>Sign up</h1>
                <Form method="post" className="mb-3">
                    <fieldset disabled={navigation.state === "submitting"}>
                        <div className="mb-3">
                            <FormInput
                                inputProps={{
                                    name: "username",
                                }}
                                label= "Username:"
                                errorMessage={error?.username?.message}
                            />
                        </div>
                        <div className="mb-3">
                            <FormInput
                                inputProps={{
                                    name: "email",
                                }}
                                label= "Email:"
                                errorMessage={error?.email?.message}
                            />
                        </div>
                        <div className="mb-3">
                            <FormInput
                                inputProps={{
                                    name: "password",
                                    type: "password"
                                }}
                                label= "Password:"
                                errorMessage={error?.password?.message}
                            />
                        </div>
                        <button type="submit" className="btn btn-success">
                            {navigation.state === "submitting"
                                ? "Signing up..."
                                : "Sign up"}
                        </button>
                    </fieldset>
                </Form>
                <p>Already have an account? <Link to="/account/login">Sign in</Link></p>
            </main>
        </div>
    )
}