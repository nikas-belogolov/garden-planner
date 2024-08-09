
import { Group } from "react-konva";
import { LayoutContext, Node } from "src/app/context/LayoutContext";
import PlantShape from "./Plants/PlantShape";
import RectShape from "./Shapes/RectShape";
import { useContext, useEffect, useRef, useState } from "react";
import Konva from "konva";
// import { Vector2d } from "konva/lib/types";
// import { plotSizeToGridSize } from "../utils";
// import LabelShape from "../../../../components/Layout/Canvas/Shapes/LabelShape";
import useSocket from "src/app/hooks/useSocket";
import GardenBed from "~/components/Layout/Canvas/Objects/GardenBed";
import LabelShape from "./Shapes/LabelShape";
import RegularPolygonShape from "./Shapes/RegularPolygon";

type Props = {
    node: Node;
};

const Shape: React.FC<Props> = ({ node }: any) => {
    const shapeRef = useRef<Konva.Group>(null);

    const {
        // layoutConfig: { layoutUnits, layoutWidth, layoutHeight },
        stageConfig: { stageScale },

        stageRef,

        layoutData,

        moveNode,
        upsertNode,

        bgColor,

        setContextMenu,


        selectedShapes,
        setSelectedShapes
    } = useContext(LayoutContext)

    const { updateRoom, updateUserMouse,  } = useSocket();
    const [labelVisible, setLabelVisible] = useState(false);

    useEffect(() => {
        shapeRef.current?.setAttr("id", node._id);
    }, [node._id]);

    const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {

        if (e.evt.button != 0) return;

        if (e.evt.shiftKey) {
            if (selectedShapes.find((shape: any) => shape._id === shapeRef.current?._id)) {
                setSelectedShapes((prevState: any) => prevState.filter((shape: any) => shape._id !== shapeRef.current?._id));
            } else {
                setSelectedShapes((prevState: any) => [...prevState, shapeRef.current as Konva.Group]);
            }
            return;
        }

        setSelectedShapes([shapeRef.current as Konva.Group]);
    }

    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {

        if (stageRef && stageRef.current) {
            const { x, y } = stageRef.current.getRelativePointerPosition();

            if (x && y) {
                updateUserMouse({ x: x.toFixed(0), y: y.toFixed(0) })
            }
        }

        const { x, y } = e.target.position();

        moveNode(e.target.id(), x, y);
        updateRoom([layoutData.entities[e.target.id()]], "update")
    }

    const handleContextMenu = (event: Konva.KonvaEventObject<MouseEvent>) => {
        event.evt.preventDefault();
        const mousePosition = event.target.getStage()!.getRelativePointerPosition()!;

        console.log("context menu")

        setContextMenu({
            visible: true,
            x: mousePosition.x * stageScale,
            y: mousePosition.y * stageScale,
            node
        })
    }

    const handleTransform = () => {
        if (stageRef.current) {
            const { x, y } = stageRef.current.getRelativePointerPosition();

            if (x && y) {
                updateUserMouse({ x: x.toFixed(0), y: y.toFixed(0) })
            }
        }
        if (shapeRef.current) {
            const currGroup = shapeRef.current;
            const scaleX = currGroup.scaleX();
            const scaleY = currGroup.scaleY();
            const updatedNode = {
                ...layoutData.entities[currGroup.id()],
                x: currGroup.x(),
                y: currGroup.y(),
            }

            currGroup.scaleX(1);
            currGroup.scaleY(1);
            
            
            currGroup.children[0].width(Math.round(currGroup.children[0].width() * scaleX));
            currGroup.children[0].height(Math.round(currGroup.children[0].height() * scaleY));
            
            
            updateRoom([{
                ...updatedNode,
                width: currGroup.children[0].width(),
                height: currGroup.children[0].height()
            }], "update")
        }
    }

    const handleTransformEnd = () => {
        if (shapeRef.current) {
            const currGroup = shapeRef.current;
            const scaleX = currGroup.scaleX();
            const scaleY = currGroup.scaleY();
            // currGroup.scaleX(1);
            //     currGroup.scaleY(1);

            if (node.type == "polygon") {
                console.log(currGroup.x(), currGroup.scaleX())

                upsertNode({
                    ...layoutData.entities[currGroup.id()],
                    scaleX, scaleY
                    // radius: Math.round(node.radius * scaleX)
                })
// currGroup.scaleX(1);
//                 currGroup.scaleY(1);
                console.log(layoutData.entities[currGroup.id()])
            } else {
                currGroup.scaleX(1);
                currGroup.scaleY(1);
                upsertNode({
                    ...layoutData.entities[currGroup.id()],
                    width: currGroup.children[0].width(),
                    height: currGroup.children[0].height()
                })
            }
        }
    }

    // dragLayer.current.getContext().font = "normal 9px serif"
    // const centeredX = dragLayer.current ? currentShape.width / 2 - dragLayer.current.getContext().measureText(currentShape.name).width / 2 - 7.5 : 0
    // let centeredX = 0;
    // const layer = shapeRef.current?.getLayer()
    // if (layer) {
    //     layer.getContext().font = "normal 9px serif";
    //     centeredX = node.width / 2 - layer.getContext().measureText(node.name).width / 2 - 7.5;
    // }
    

    return (
        <Group
            ref={shapeRef}
            x={node.x}
            y={node.y}
            onClick={handleClick}

            // scaleX={node.scaleX}
            // scaleY={node.scaleY}

            onContextMenu={handleContextMenu}

            draggable
            onDragMove={handleDragMove}

            onTransform={handleTransform}
            onTransformEnd={handleTransformEnd}


            >

            {/* Regular Shapes */}
            { node.type === "rect" && <RectShape node={node} />  }
            { node.type === "polygon" && <RegularPolygonShape node={node} />  }
            { node.type === "ellipse" && <EllipseShape node={node} />  }

            {/* Objects */}
            { node.type === "bed" && <GardenBed node={node} />  }

            {/* Plants */}
            { node.type === "plant" && <PlantShape node={node} />  }
        </Group>
    )
}

export default Shape;