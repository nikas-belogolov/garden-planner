import { NodeConfig } from "konva/lib/Node";
import { ShapeConfig } from "konva/lib/Shape";
import { LegacyRef, useRef } from "react";
import { Circle, Group, Rect, Shape } from "react-konva";
import { Node } from "src/app/context/LayoutContext";
import { centimetersToPixels, metersToPixels } from "../utils";

type Props = {
    node: Node;
};
  
const PlantShape: React.FC<Props> = ({ node }: Props) => {

    const shapeRef = useRef<any>(null);

    if (shapeRef.current) {
        shapeRef.current.getSelfRect = () => {
            return {
                x: 0,
                y: 0,
                width: shapeRef.current.width(),
                height: shapeRef.current.height()
            }
        }
    }

    return (
            // <Rect width={node.width} height={node.height}  fill={node.color}></Rect>
        <Shape
            ref={shapeRef}
            fill={node.color}
            width={node.width}
            height={node.height}
            
            hitFunc={function (ctx, shape) {
                ctx.beginPath();

                ctx.rect(0,0,node.width, node.height);
                ctx.closePath();
                ctx.fillShape(shape)
            }}

            sceneFunc={function (ctx, shape) {
                const width = shape.width();
                const height = shape.height();

                let space = centimetersToPixels(25)
                // let maxNumOfPlants = Math.floor((node.width - 20) / 40);
                // console.log(maxNumOfPlants)
                
                ctx.ellipse(space, space, space, space, 0,0,2*Math.PI)

                for (let x = space; x < width - space; x += centimetersToPixels(node.plant_spacing_cm)) {
                    for (let y = space; y < height - space; y += centimetersToPixels(node.row_spacing_cm)) {
                        ctx.beginPath();
                        ctx.ellipse(x, y, space, space, 0, 0, 2 * Math.PI);
                        
                        ctx.closePath();
                        ctx.fillStrokeShape(shape)
                        ctx.fillStyle = "#fff"
                        ctx.fillText(node.color, x, y)  
                    }
                }
                // for (let i = space; i < height - space; i += centimetersToPixels(node.row_spacing_cm)) {
                //     ctx.ellipse(i, space, space, space, 0, 0, 2 * Math.PI);
                // }
            }}
        >
        </Shape>
    )
}

export default PlantShape;