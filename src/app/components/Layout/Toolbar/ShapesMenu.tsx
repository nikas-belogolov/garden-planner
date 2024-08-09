import { useContext } from "react";
import { LayoutContext } from "~/context/LayoutContext";
import useChangeCursor from "~/hooks/useChangeCursor";

const shapes = [
    {
        name: "Rectangle",
        type: "rect",


        width: 100,
        height: 100,
        fill: "gray"
    },
    {
        name: "Line",
        type: "line",
        points: [0,0,0,0],
        stroke: "#fff"
    },
    {
        name: "Ellipse",
        type: "ellipse",
        width: 100,
        height: 100,
    },
    {
        name: "Polygon",
        type: "polygon",
        sides: 5,
        radius: 50,
        fill: "gray"
    }
]

export default function ShapesMenu() {
    const {
        currentShape, setCurrentShape
        
    } = useContext(LayoutContext);


    return (
    <div className="toolbar-menu divide-y toolbar-objects">
            <div className="toolbar-menu-header">Shapes</div>
            {/* <div className="toolbar-menu-filters">
                <div>Filters</div>
                <div className="toolbar-menu-filter">
                    <label htmlFor="objects-name-filter">Name</label>
                    <input className="form-control" id="objects-name-filter" onChange={handleNameFilterChange} type="text" />
                </div>
                <div className="toolbar-menu-filter">
                    <label htmlFor="objects-type-filter">Type</label>
                    <select className="form-select" name="" id="objects-type-filter">
                        <option value="">Irrigation</option>
                        <option value="">Structure</option>
                        <option value="">Layout</option>
                    </select>
                </div>
            </div> */}
            <div className="toolbar-menu-items">
                {
                    (shapes as typeof shapes).map((shape, i) => {
                        const isSelected = currentShape && currentShape.name == shape.name;
                        return (
                        <button 
                            key={i}
                            style={isSelected ? { background: "var(--primary-100)" } : {} }
                            onClick={() => {
                                currentShape?.name == shape.name ?
                                    setCurrentShape(null) :
                                    setCurrentShape(shape);
                            }}
                        >
                            {shape.name}
                        </button>)
                    })
                    
                }
            </div>
        </div>
    )
}