import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import homeStyles from "~/styles/home.css?url"

export const meta = () => {
    return [
      { title: "Very cool app | Remix" },
    ];
};

export const links = () => [
    { rel: "stylesheet", href: homeStyles },
];

const features = [
    {
        name: "Interactive Garden Planning",
        description: "Design your ideal garden layout effortlessly with our intuitive drag-and-drop tools. Add plants, pathways, and structures to create personalized designs that reflect your unique vision for your outdoor space.",
        subfeatures: [
            {
                description: "Customize plant spacing and arrangement to maximize visual appeal and productivity.",
            }
        ],
        image: "",
        alt: ""
    },
    {
        name: "Large Selection of Plants",
        description: "Explore our extensive database of plants, featuring detailed care information for each species. Discover growth habits, companion planting suggestions, and more to help you make informed decisions about what to include in your garden.",
        image: "",
        alt: ""
    },
    {
        name: "Seasonal Calendar",
        description: "Stay organized throughout the year with our customizable seasonal calendar. Plan and track important garden tasks and events such as planting, pruning, and harvesting, ensuring that your garden stays on schedule no matter the season.",
        image: "",
        alt: ""
    },
    {
        name: "Reminders and Alerts",
        description: "",
        image: "",
        alt: ""
    }
]

export default function Home() {

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#a">Garden Planner</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="#hero-section">Overview</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#features-section">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#showcase-section">Showcase</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#pricing-section">Pricing</a>
                        </li>
                    </ul>
                    <span className="navbar-text">
                        <Link to="/account/login" className="btn">Sign in</Link>
                    </span>
                </div>
            </nav>
            <main>
                <section id="hero-section" className="p-20 min-h-screen">
                    <div className="m-auto h-full max-w-7xl grid grid-cols-2 gap-32">
                        <div className="flex-1 flex flex-col justify-center items-start">
                            <h1>Welcome to Garden Planner</h1>
                            <p>Plan and design your dream garden with ease</p>
                            <button className="btn call-to-action">Get Started</button>
                        </div>
                        <img src="https://placehold.co/650x450" alt="" />
                    </div>
                </section>
                <section id="features-section">
                    {features.map((feature, i) => (
                        <section key={feature.name} className="overflow-hidden  py-24 sm:py-32">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                                <div className={(i % 2 != 0 ? "order-2 " : "") + "lg:pr-8 lg:pt-4 flex items-center"}>
                                    <div className="lg:max-w-lg">
                                        <p className="mt-2 text-3xl font-bold tracking-tight  sm:text-4xl">{feature.name}</p>
                                        <p className="feature-description mt-6 text-lg leading-8 ">
                                        {feature.description}
                                        </p>
                                        {/* <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                                            {feature.subfeatures && feature.subfeatures.map((subfeature) => (
                                                <div key={subfeature.name} className="relative pl-9">
                                                    <dt className="inline font-semibold text-gray-900">
                                                        {subfeature.name}
                                                    <feature.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" /> 
                                                    {subfeature.name}
                                                    </dt>{' '}
                                                    <dd className="inline">{subfeature.description}</dd>
                                                </div>
                                            ))}
                                        </dl> */}
                                    </div>
                                </div>
                                <img
                                src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
                                alt="Product screenshot"
                                className={
                                    (i % 2 != 0 ? "-translate-x-1/2 " : "") +
                                    "w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"}
                                width={2432}
                                height={1442}
                                />
                            </div>
                            </div>
                        </section>
                        // <section className="feature-section min-h-screen">
                        //     <div className="m-auto h-full max-w-7xl flex">
                        //         <div className={"flex items-start flex-1 " + ((i % 2 == 0) ? "order-2 ml-10" : "") }>
                        //             <h2>{feature.name}</h2>
                        //             <p>{feature.description}</p>
                        //         </div>
                        //         <img src="https://placehold.co/650x450" alt={feature.alt} className={
                        //             ((i % 2 == 0) ? "order-1 " : "") +
                        //             "self-center"
                        //         } />
                        //     </div>
                        // </section>
                    ))}
                </section>
            </main>
        </>
        
    )
}