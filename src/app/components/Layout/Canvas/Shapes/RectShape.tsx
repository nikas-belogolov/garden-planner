import { Rect } from "react-konva";
import { Node } from "src/app/context/LayoutContext";

type Props = {
    node: Node;
};
  
const RectShape: React.FC<Props> = ({ node }: Props) => {


    return (
        <Rect
            width={node.width}
            height={node.height}
            fill={node.fill}
        />
    )
}

export default RectShape;