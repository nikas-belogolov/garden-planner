import { ActionFunctionArgs, redirect } from "@remix-run/node";

export async function action({ context: { req } }: ActionFunctionArgs) {
    await req.logout(function (err) {
        if (err) return err;
        redirect("/account/login");
    })
}