import { Form, useActionData, useFetcher, useNavigation } from "@remix-run/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import FormInput from "src/app/components/Input";

export default function Modal({ show, onHide, action }: any) {
    
    const fetcher: any = useFetcher()

    const errors = fetcher.data?.errors;

    return (
        <div className={`app-modal ${show ? 'app-modal-open' : '' }`}>
            <div className="app-modal-dialog">
                <div className="app-modal-content">
                    <div className="app-modal-header">
                        <h5>Create new layout</h5>
                        <button type="button" onClick={onHide}>
                            <i className="fa-solid fa-close fa-xl"></i>
                        </button>
                    </div>
                    <div className="app-modal-body">
                        <fetcher.Form action={action} method="post" id="createNewGardenForm">
                            <fieldset disabled={fetcher.state === "submitting"}>
                                <div className="mb-3">
                                    <FormInput
                                        inputProps={{
                                            name: "name",
                                        }}
                                        label= "Name:"
                                        errorMessage={errors?.name?.message}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="mb-3">
                                            <FormInput
                                                inputProps={{
                                                    name: "width",
                                                    type: "number",
                                                    min: 3,
                                                    max: 1000
                                                }}
                                                label= "Width:"

                                                errorMessage={errors?.width?.message}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <FormInput
                                                inputProps={{
                                                    name: "height",
                                                    type: "number",
                                                    min: 3,
                                                    max: 1000
                                                }}
                                                label= "Height:"

                                                errorMessage={errors?.height?.message}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h5>Units:</h5>
                                        <div className="form-check mb-2">
                                            <input className="form-check-input" max="1000" type="radio" value="metric" name="units" id="metric-units" defaultChecked={true} />
                                            <label className="form-check-label" htmlFor="metric-units">
                                                Metric
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" max="1000" type="radio" value="imperial" name="units" id="imperial-units" />
                                            <label className="form-check-label" htmlFor="imperial-units">
                                                Imperial
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-danger">
                                    {errors?.gardens?.message}
                                </p>

                                <button type="submit" className="btn btn-success" id="create-new-garden">
                                    {fetcher.state === "submitting"
                                    ? "Creating..."
                                    : "Create New Layout"}
                                </button>
                            </fieldset>
                        </fetcher.Form>
                    </div>
                </div>
            </div>
            <div className="app-modal-backdrop" onClick={onHide}></div>
        </div>
    );
}