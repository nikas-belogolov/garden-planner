import { Ellipse, Rect } from "react-konva";
import { Node } from "src/app/context/LayoutContext";

type Props = {
    node: Node;
};
  
const EllipseShape: React.FC<Props> = ({ node }: Props) => {


    return (
        <Ellipse 
            radiusX={0}
            radiusY={0}
        />
    )

}

export default EllipseShape;