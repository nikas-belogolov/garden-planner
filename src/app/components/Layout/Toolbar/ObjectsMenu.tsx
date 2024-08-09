import { useContext, useState } from "react";
import { LayoutContext } from "~/context/LayoutContext";
import { useFilter } from "~/hooks/useFilter";

const objects = [
    {
        name: "Ground Level Bed",
        type: "bed",
        width: 100,
        height: 100,
        fill: "brown"
    },
    {
        name: "Raised Bed (Wood)",
        type: "bed",
        width: 100,
        height: 100,
        fill: "brown"
    },
    {
        name: "Compost Bin",
        type: "compostbin",
        width: 100,
        height: 100,
        fill: "black"
    }
]

export default function ObjectsMenu() {
    const {
        currentShape, setCurrentShape
    } = useContext(LayoutContext);

    const [nameFilterValue, setNameFilterValue] = useState('');

    const { loading: filterLoading, data } = useFilter({
        data: objects,
        search: {
            query: nameFilterValue,
            fields: ["name"]
        }
    })

    const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameFilterValue(event.target.value)
    }

    return (
        <div className="toolbar-menu divide-y toolbar-objects">
            <div className="toolbar-menu-header">Garden Objects</div>
            <div className="toolbar-menu-filters">
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
            </div>
            <div className="toolbar-menu-items">
                {
                    (filterLoading) ? (
                        <div>Loading...</div>
                    ) : (
                        (data as typeof objects).map((object, i) => {
                            const isSelected = currentShape && currentShape.name == object.name;
                            return (
                            <button 
                                key={i}
                                style={isSelected ? { background: "var(--primary-100)" } : {} }
                                onClick={() => {
                                    currentShape?.name == object.name ?
                                        setCurrentShape(null) :
                                        setCurrentShape(object);
                                }}
                            >
                                {object.name}
                            </button>)
                        })
                    )
                }
            </div>
        </div>
    )
}