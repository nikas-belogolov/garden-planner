import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Modal from "./Modal";

export default function AppLayoutWithSidebar(
{
    data,
    children,
}: Readonly<{
    children: React.ReactNode;
    data: any;
}>) {
    const [activeMenu, setActiveMenu] = useState(null);

    // Function to handle button click and toggle menu visibility
    const toggleMenu = (menuName: any) => {
      setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    

    const [isCreateLayoutModalOpen, setIsCreateLayoutModalOpen] = useState(false);

    const closeModal = () => setIsCreateLayoutModalOpen(false)

    return <div className="flex w-screen h-screen">
                <Modal errors={{}} show={isCreateLayoutModalOpen} onHide={closeModal} action={`/app/gardens/${data._id}/layouts`} />
                <div id="app-sidebar">
                    <nav className="flex flex-column justify-between h-100">
                        {/* <select name="form-select" id="">
                        </select> */}
                        <ul className='nav nav-pills flex-column text-lg'>
                            <li className='nav-item'>
                                <Link to='/app/overview' className='nav-link'>
                                    <i className="fa-solid fa-house fa-lg"></i>
                                    <span>Overview</span>
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <div className="sidebar-dropdown">
                                    <button className="p-3 w-full text-left" onClick={() => toggleMenu('layouts')}>
                                        <i className="fa-solid fa-pen-ruler fa-lg"></i>
                                        <span>Layouts</span>
                                    </button>

                                    { activeMenu == "layouts" ? 
                                        <div className="px-4 flex-col nav sidebar-dropdown-menu">
                                            { data.layouts.map((layout: any) => {
                                                return (
                                                    <li key={layout._id}>
                                                        <Link className="nav-link"  to={`/app/gardens/${data._id}/layouts/${layout._id}?mode=edit`}>{layout.name}</Link>
                                                    </li>
                                                )
                                            }) }
                                            <li className="nav-link" onClick={() => setIsCreateLayoutModalOpen(true)}>
                                                
                                                {/* <button> */}
                                                    <i className="fa-solid fa-add fa-sm"></i> Add Layout
                                                {/* </button> */}
                                            </li>
                                        </div>
                                    : null}
                                </div>
                                {/* <div>
                                    <i className="fa-solid fa-pen-ruler fa-lg"></i>
                                    <span>Layouts</span>

                                </div> */}
                            </li>
                            <li className='nav-item'>
                                <Link to='/app/calendar' className='nav-link'>
                                    <i className="fa-solid fa-calendar fa-lg"></i>
                                    <span>Calendar</span>
                                </Link>
                            </li>
                            {/* <li className='nav-item'>
                                <Link to='/app/journal' className='nav-link'>
                                    <i className="fa-solid fa-book fa-lg"></i>
                                    <span>Journal</span>
                                </Link>
                            </li> */}
                            <li className='nav-item'>
                                <Link to='/app/tasks' className='nav-link'>
                                    <i className="fa-solid fa-list-check fa-lg"></i>
                                    <span>Tasks</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className='nav nav-pills flex-column text-lg'>
                            <li className='nav-item'>
                                <Link to="/app/profile" className='nav-link'>
                                    <i className="fa-solid fa-user-circle fa-lg"></i>
                                    <span>My Profile</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <main className="flex-1 p-5 overflow-scroll">
                    { children }
                </main>
            </div>
};