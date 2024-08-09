import { RegularPolygon } from "react-konva";
import { Node } from "src/app/context/LayoutContext";

type Props = {
    node: Node;
};
  
const RegularPolygonShape: React.FC<Props> = ({ node }: Props) => {

    return (
        <RegularPolygon
            radius={node.radius}
            sides={node.sides}

            

            fill={node.fill}
        />
    )
}

export default RegularPolygonShape;