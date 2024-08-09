import { Line } from "react-konva";
import { Line } from "src/app/context/LayoutContext";

type Props = {
    node: Line;
};
  
const LineShape: React.FC<Props> = ({ node }: Props) => {


    return (
        <Line
            points={node.points}
            stroke={node.stroke}
            strokeWidth={node.strokeWidth}
            // width={node.width}
            // height={node.height}
            // fill={node.fillStyle}
        />
    )
}

export default LineShape;