import { useGetPlantsQuery } from "src/app/redux/api";
import { useContext, useState } from "react";
import { LayoutContext } from "~/context/LayoutContext";
import { useFilter } from "~/hooks/useFilter";

export default function PlantsMenu() {
    const { data: plants = [], isLoading: queryLoading } = useGetPlantsQuery();

    const {
        currentShape, setCurrentShape
    } = useContext(LayoutContext);

    const [nameFilterValue, setNameFilterValue] = useState('');

    const { loading: filterLoading, data } = useFilter({ data: plants, search: {
        query: nameFilterValue,
        fields: ["name"]
    } })

    const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameFilterValue(event.target.value)
    }

    return (
        <div className="toolbar-menu divide-y toolbar-objects">
            <div className="toolbar-menu-header">Plants</div>
            <div className="toolbar-menu-filters">
                <div>Filters</div>
                <div className="toolbar-menu-filter">
                    <label htmlFor="plant-name-filter">Name</label>
                    <input className="form-control" id="plant-name-filter" onChange={handleNameFilterChange} type="text" />
                </div>
                <div className="toolbar-menu-filter">
                    <label htmlFor="plant-type-filter">Type</label>
                    <select className="form-select" name="" id="plant-type-filter">
                        <option value="">Irrigation</option>
                        <option value="">Structure</option>
                        <option value="">Layout</option>
                    </select>
                </div>
            </div>
            <div className="toolbar-menu-items">
                { (queryLoading || filterLoading) ? (
                    <div>Loading...</div>
                ) : (
                    data.map((plantAndVarieties: any, i: number) => {
                        
                        // const 

                        let plants = [];

                        if (plantAndVarieties.varieties) {
                            const { varieties, ...genericPlant } = plantAndVarieties;
                            plants = [genericPlant, ...varieties];
                        } else {
                            plants = plantAndVarieties;
                        }

                        return (
                                plants.map((plant, i) => {

                                    const plantName = i == 0 ? plant.name : `${genericPlant.name} (${plant.name})`; 
                                    const isSelected = currentShape && currentShape.name == plantName;

                                    return (
                                        <button
                                            key={i}
                                            style={isSelected ? { background: "var(--primary-100)" } : {} }
                                            onClick={() => {
                                                currentShape?.name == plant.name ?
                                                    setCurrentShape(null) :
                                                    setCurrentShape({
                                                        ...genericPlant,
                                                        ...plant,
                                                        name: plantName,
                                                        width: 100,
                                                        height: 100,
                                                        type: "plant"});
                                                console.log({
                                                    ...genericPlant,
                                                    ...plant,
                                                    name: plantName,
                                                    width: 100,
                                                    height: 100,
                                                    type: "plant"})
                                            }}>
                                                {plantName}
                                        </button>
                                    )
                                })
                        )
                    })
                    
                ) }
            </div>
        </div>
    )
}