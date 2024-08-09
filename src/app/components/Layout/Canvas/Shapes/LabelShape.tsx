import { Label, Tag, Text } from "react-konva";
import { Node } from "src/app/context/LayoutContext";

type Props = {
    node: Node;
};
  
const LabelShape: React.FC<Props> = ({ textColor, bgColor, x, y, text, padding, fontSize }: any) => {


    return (
        <Label y={y} x={x} scaleX={1} scaleY={1}  >
            <Tag fill={bgColor} stroke={"green"} strokeWidth={1} />
            <Text
                padding={padding}
                fill={textColor}
                text={text}
                fontSize={fontSize}/>
        </Label> 
    )
}

export default LabelShape;