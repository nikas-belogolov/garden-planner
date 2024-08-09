import { Link, useParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "src/app/hooks/useDebounce";

export default function Menu({ layoutName }: any) {
    const { layoutId, gardenId } = useParams()

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [name, setLayoutName] = useState(layoutName);
    const debouncedLayoutName = useDebounce(name, 700);

    const handleLayoutNameChange = (e: any) => {
        setLayoutName(e.target.value);
    };

    const updateLayoutNameUrl = `/app/gardens/${gardenId}/layouts/${layoutId}`;

    useEffect(() => {
        console.log(debouncedLayoutName)
        fetch(updateLayoutNameUrl, {
            method: "PUT",
            headers: { 
                'Content-type': 'application/json'
            }, 
            body: JSON.stringify({
                name: debouncedLayoutName
            })
        })
    }, [debouncedLayoutName, updateLayoutNameUrl]);

    return (
        <div className="app-layout-menu ">
            <div className="menu-visible">
                <button className="menu-toggle-button" onClick={toggleMenu}  >
                    <i className="fa-solid fa-bars fa-xl"></i>
                </button>
                <div className="menu-garden-title">
                    <input type="text" defaultValue={layoutName} onChange={handleLayoutNameChange} />
                </div>
            </div>
            <div className={(!isOpen ? "hidden " : "") + "menu-vertical flex flex-col divide-y divide-slate-300"} ref={menuRef}>
                <div>
                    <div>
                        <i className="fa-solid fa-house fa-lg"></i>
                        <span>Overview</span>
                    </div>
                    {/* <div>
                        <i className="fa-solid fa-calendar fa-lg"></i>
                        <span>Calendar</span>
                    </div>
                    <div>
                        <i className="fa-solid fa-book fa-lg"></i>
                        <span>Journal</span>
                    </div>
                    <div>
                        <i className="fa-solid fa-list-check fa-lg"></i>
                        <span>Tasks</span>
                    </div>
                    <div>
                        <i className="fa-solid fa-user-circle fa-lg"></i>
                        <span>My Profile</span>
                    </div> */}
                </div>
                <div>
                    <Link className="menu-btn" to={"/app/gardens/" + gardenId}>
                        <i className="fa-solid fa-house"></i>
                        <span>Home</span>
                    </Link>
                    <div className="menu-btn">
                        <i className="fa-solid fa-file-export"></i>
                        <span>Export</span>
                    </div>
                    <div className="menu-btn">
                        <i className="fa-solid fa-gear"></i>
                        <span>App Settings</span>
                    </div>
                </div>
            </div>
        </div>
    )
}