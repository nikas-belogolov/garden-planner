import { useState } from "react";
import ObjectsMenu from "./ObjectsMenu";
import PlantsMenu from "./PlantsMenu";
import ShapesMenu from "./ShapesMenu";





// function LayersMenu() {
//     // const { layers } = useContext(LayoutContext);
//     const [, forceUpdate] = useReducer(x => x + 1, 0);

//     function LayerItem({ layer }: { layer: any }) {
//         const [visible, setVisible] = useState(layer.visible);

//         return (
//             <div key={layer.id} className="flex py-1">
                
//                 <span className="flex-1">{layer.name}</span>
//                 <button onClick={() => {
//                 }}>
//                     {visible ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
//                 </button>
//             </div>
//         )
//     }

//     return (
//         <div className="toolbar-menu toolbar-layers divide-y">
//             <div>
//                 Layers
//             </div>
//             <div>
//                 {/* {layers.map((layer: Konva.Layer) => {
//                     return <LayerItem layer={layer} />
//                 })} */}
//             </div>
//         </div>
//     )
// }


export default function Toolbar() {
    const [activeMenu, setActiveMenu] = useState(null);
    // Function to handle button click and toggle menu visibility
    const toggleMenu = (menuName: any) => {
      setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    const menus = [
        {
            name: "plants",
            icon: "seedling"
        }, {
            name: "objects",
            icon: "cube"
        }, {
            name: "shapes",
            icon: "shapes"
        }, {
            name: "text",
            icon: "font"
        }, {
            name: "measure",
            icon: "ruler"
        }
    ]

    return (
        <div className="app-layout-toolbar">
            <div className="toolbar-items">
                {
                    (menus as typeof menus).map((menu, i) => {
                        return (
                            <button
                                key={i}
                                className={(activeMenu == menu.name ? "toolbar-item-active" : "") + " toolbar-item"}
                                onClick={() => toggleMenu(menu.name)}
                            >
                                <i className={`fa-solid fa-${menu.icon} fa-xl`}></i>
                            </button>
                        );
                    })
                }
                {/* <div className={(activeMenu == "layers" ? "toolbar-item-active" : "") + " toolbar-item"}
                    onClick={() => toggleMenu('layers')} role="button" tabIndex={0}>
                    <i className="fa-solid fa-layer-group fa-xl"></i>
                </div> */}
            </div>
            {activeMenu === 'plants' && <PlantsMenu />}
            {activeMenu === 'objects' && <ObjectsMenu/>}
            {activeMenu === 'shapes' && <ShapesMenu />}
        </div>
    )
}