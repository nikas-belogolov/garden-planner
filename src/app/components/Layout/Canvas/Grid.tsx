import { Store, nanoid } from "@reduxjs/toolkit";
// import { Layer, Viewport } from "../GardenPlanner";
import { MeasurementUnit } from "./utils";
import STYLES from "./styles";
import { plotSizeToGridSize } from "./utils";
import { Rect, Stage, Layer, Group, Line, Transformer } from "react-konva";
import Konva from "konva";
import { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "src/app/context/LayoutContext";
import useSocket from "src/app/hooks/useSocket";
import React from "react" 
React.useLayoutEffect = React.useEffect 

import Shape from "./Shape";
import LabelShape from "./Shapes/LabelShape";

import { Html } from 'react-konva-utils'
import { UserCursor } from "./UserCursor";
import useChangeCursor from "~/hooks/useChangeCursor";

const Grid = ({ layout, role }: any) => {

    const ROOM_ID = layout._id;

    const {
        setStageRef,

        rulersWidth,

        contextMenu, setContextMenu,

        layoutData, addNode, deleteNode,

        selectedShapes, setSelectedShapes,
        currentShape, setCurrentShape,

        cursor, setCursor,

        stageConfig: { stageX, stageY, stageScale },
        setStageConfig,
        layoutConfig: { layoutUnits, layoutHeight, layoutWidth },
        setLayoutConfig,

        bgColor,
        color,

        roomId, setRoomId,
        roomUsers, setRoomUsers,
        userCursors, setUserCursors,
    } = useContext(LayoutContext);

    const { joinRoom, leaveRoom, updateUserMouse, updateRoom, deleteRoomNodes } = useSocket()

    const [stageWidth, setStageWidth] = useState(0);
    const [stageHeight, setStageHeight] = useState(0);
    const [cursorOverStage, setCursorOverStage] = useState(false);

    const [canDragStage, setCanDragStage] = useState(true);

    const transformerRef = useRef<Konva.Transformer>(null);
    const dragLayer = useRef<Konva.Layer>(null);
    const { width, height } = plotSizeToGridSize({ width: layoutWidth, height: layoutHeight, units: layoutUnits, scale: 1 })
    let lineStyles;

    if (layoutUnits == MeasurementUnit.Metric) lineStyles = STYLES.metricLineStyles;
    else lineStyles = STYLES.imperialLineStyles

    const stageRef = useRef<Konva.Stage>(null);

    useEffect(() => {
        setRoomId(ROOM_ID);
        return () => setRoomId(undefined);
    }, [ROOM_ID, setRoomId]);

    useEffect(() => {
        if (stageRef.current) setStageRef(stageRef);
    }, [setStageRef]);

    useEffect(() => {

        if (roomId) {
            joinRoom();
        }

        return () => {
            leaveRoom();
            setRoomUsers(new Map());
            setUserCursors(new Map());
        }

    }, [joinRoom, leaveRoom, setRoomUsers, setUserCursors, roomId])

    useEffect(() => {
        setLayoutConfig(() => ({
          layoutName: layout.name,
          layoutWidth: layout.width,
          layoutHeight: layout.height,
          layoutUnits: layout.units == "metric" ? MeasurementUnit.Metric : MeasurementUnit.Imperial,
        }))
    }, [])

    useEffect(() => {
        const resizeStage = () => {
            setStageWidth(window.innerWidth - rulersWidth);
            setStageHeight(window.innerHeight - rulersWidth);
        }

        resizeStage();

        window.addEventListener("resize", resizeStage);

        return () => {
            window.removeEventListener("resize", resizeStage);
        };
    }, [rulersWidth])

    useEffect(() => {
        const closeContextMenu = () => {
            setContextMenu({
                visible: false
            })
        }

        window.addEventListener("click", closeContextMenu);

        return () => {
            window.removeEventListener("click", closeContextMenu);
        }
    }, [setContextMenu]);

    useEffect(() => {
        if (selectedShapes) {
          transformerRef.current?.nodes(selectedShapes);
          transformerRef.current?.getLayer()?.batchDraw();
        }
    }, [selectedShapes, layoutData]);


    // useEffect(() => {
    //     if (currentShape && currentShape?.type == ("rect")) {
    //         setCanDragStage(false);
    //     } else setCanDragStage(true);
    // }, [currentShape])


    useEffect(() => {
        console.log(currentShape)
    }, [currentShape])

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        
        if (stageRef.current) {
            const stage = stageRef.current;
            const scaleBy = 0.1;
            const oldScale = stageRef.current.scaleX();
            const mousePointTo = {
              x: (stage.getPointerPosition()?.x as number) / oldScale - stage.x() / oldScale,
              y: (stage.getPointerPosition()?.y as number) / oldScale - stage.y() / oldScale,
            };

            const newScale = e.evt.deltaY < 0 ? +(oldScale + scaleBy).toFixed(2) : +(oldScale - scaleBy).toFixed(2);

            if (newScale > 2 || newScale < 0.5) {
                return;
            }
    
            const stageX = -(mousePointTo.x - (stage.getPointerPosition()?.x as number) / newScale) * newScale;
            const stageY = -(mousePointTo.y - (stage.getPointerPosition()?.y as number) / newScale) * newScale;

            setStageConfig((prevState: any) => ({
                ...prevState,
                stageScale: newScale,
                stageX,
                stageY
            }))
        }
    }

    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (e.target === stageRef.current) {
            setStageConfig((prevState: any) => ({
                ...prevState,
                stageX: e.target.attrs.x,
                stageY: e.target.attrs.y,
            }))
        }
    }

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const mouseX = stageRef.current?.getRelativePointerPosition()?.x.toFixed(0);
        const mouseY = stageRef.current?.getRelativePointerPosition()?.y.toFixed(0);
        if (mouseX && mouseY) {
            if (currentShape) setCursor((prevState: any) => ({
                ...prevState,
                x: mouseX,
                y: mouseY
            }))

            if (role != 'viewer') updateUserMouse({ x: mouseX, y: mouseY });
            stageRef.current?.draw()
        }
    }

    const handleMouseEnter = () => setCursorOverStage(true)
    const handleMouseLeave = () => setCursorOverStage(false)

    // useChangeCursor("crosshair", currentShape != undefined && currentShape?.type == "rect" && cursorOverStage);

    const handleMouseClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === stageRef.current) {
            setSelectedShapes([]);
        }

        const mouseX = stageRef.current?.getRelativePointerPosition()?.x;
        const mouseY = stageRef.current?.getRelativePointerPosition()?.y;
        if (currentShape && mouseX && mouseY) {
            let x, y;
            if (currentShape.type == "polygon"
            ) {
                x = mouseX;
                y = mouseY
            } else {
                x = mouseX - currentShape.width / 2;
                y = mouseY - currentShape.height / 2;
            }
            const newNode = {
                ...currentShape,
                _id: nanoid(),
                x,
                y
            }
            addNode(newNode)
            updateRoom([newNode] ,"update")
            setCurrentShape(null)
        }
    }

    const handleDelete = () => {
        if (selectedShapes.length > 1) {
            deleteRoomNodes(selectedShapes)
            selectedShapes.forEach((shape: Konva.Node) => {
                deleteNode(shape.attrs.id)
            })
            setSelectedShapes([])
        } else {
            deleteRoomNodes([contextMenu.node])

            setSelectedShapes(selectedShapes.filter(shape => shape.attrs.id !== contextMenu.node._id))

            deleteNode(contextMenu.node._id)
        }
    }

    function ShapeTypeGroup() {
        if (dragLayer.current) {
            dragLayer.current.getContext().font = "normal 9px serif"
            const centeredX = dragLayer.current ? currentShape.width / 2 - dragLayer.current.getContext().measureText(currentShape.name).width / 2 - 7.5 : 0

            let x;
            let y;

            if (currentShape.type == "polygon") {
                x = +cursor.x;
                y = +cursor.y;
            } else {
                x = +cursor.x - currentShape.width / 2;
                y = +cursor.y - currentShape.height / 2;
            }

            return  <Group x={x} y={y}>
                <Shape node={currentShape} />
                {/* <LabelShape y={-30} x={centeredX} bgColor={bgColor} padding={5} textColor={"#fff"} text={currentShape.name} fontSize={9} /> */}
            </Group>
        }
        return <></>
    }

    return (
        <>
                
            <Stage
                ref={stageRef}
                width={stageWidth}
                height={stageHeight}
                x={stageX}
                y={stageY}
                scaleX={stageScale}
                scaleY={stageScale}
                draggable={canDragStage}

                onWheel={handleWheel}
                onDragMove={handleDragMove}
                onMouseMove={handleMouseMove}

                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}

                onClick={handleMouseClick}
                >
                
                <Layer listening={false}>
                    <Group x={0} y={0} opacity={0.5}>
                        <Rect x={0} y={0} width={width} height={height} fill={bgColor} />
                        {lineStyles.map(style => {

                            const lines = [];

                            for (let i = 0; i <= width; i += style.size) {
                                lines.push(
                                    <Line key={i + "-horizontal"} points={[i, 0, i, height]} stroke={color} strokeWidth={style.lineWidth} />
                                )
                            }
                            for (let i = 0; i <= height; i += style.size) {
                                lines.push(
                                    <Line key={i + "-vertical"} points={[0, i, width, i]} stroke={color} strokeWidth={style.lineWidth} />
                                )
                            }
                            return lines;
                        })}
                    </Group>
                    
                </Layer>

                <Layer name="nodes">
                    
                    {
                        layoutData.ids.map((id: any, i: any) => {
                            return <Shape key={i} node={layoutData.entities[id]} />
                        })
                    }
                    {selectedShapes && <Transformer
                            ref={transformerRef}
                            
                            shouldOverdrawWholeArea={true}
                            rotateEnabled={false}
                            anchorSize={15}
                            keepRatio={false}
                            anchorStrokeWidth={3}
                            anchorCornerRadius={100}
                            flipEnabled={false}
                        />}

                    {contextMenu.visible &&
                        <Html divProps={{
                            style: {
                                position: "absolute",
                                top: `${contextMenu.y}px`,
                                left: `${contextMenu.x}px`,
                                transform: "scaleX: 1;"
                            } }}>
                            <ul className="dropdown-menu show">
                                <li className="dropdown-item"><button onClick={handleDelete}>Delete</button></li>

                            </ul>
                        </Html>
                    }
                </Layer>

                <Layer listening={false} ref={dragLayer}>
                    {   
                    currentShape &&
                        // currentShape.type != ("rect") &&
                        cursorOverStage &&
                        <ShapeTypeGroup /> }
                    {userCursors && (
                            <>
                              {Array.from(roomUsers.keys()).map((key: any) => {
                                const currUserCursor = userCursors.get(key);
                                const currUser = roomUsers.get(key);
                                if (!currUserCursor || !currUser) return null;


                                return (
                                  <UserCursor
                                    key={key}
                                    x={parseInt(currUserCursor.x)}
                                    y={parseInt(currUserCursor.y)}
                                    color={currUser.color}
                                    name={currUser.name}
                                  />
                                );
                              })}
                            </>
                          )}
                </Layer>
            </Stage>
        </>

    )
}

export default Grid;

//         let lineStyles;

//         if (units == MeasurementUnit.Metric) lineStyles = STYLES.metricLineStyles;
//         else lineStyles = STYLES.imperialLineStyles

//         lineStyles.forEach(style => {
//             // for (i = x; _this._dir === "rtl" ? (i >= x - _this.gardenWidth) : (i <= x + _this.gardenWidth); _this._dir === "rtl" ? (i -= style.size * _this.scale) : (i += style.size * _this.scale)) {
            
//             let inc = (units == MeasurementUnit.Metric ? style.size : style.size) * scale;
            
            
//             for (let i = 1; i <= 1 + width; i += inc) {
//                 this.layer.add(
//                     new Konva.Line({
//                         points: [i, 1, i, 1 + height],
//                         stroke: this.color,
//                         strokeWidth: style.lineWidth,
//                     })
//                 )
//             }
//             for (let t = 1; t <= 1 + height; t += inc) {
//                 this.layer.add(
//                     new Konva.Line({
//                         points: [1, t, 1 + width, t],
//                         stroke: this.color,
//                         strokeWidth: style.lineWidth,
//                     })
//                 )

//                 // self.context.lineTo(self._dir === "rtl" ? x - self.gardenWidth : x + self.gardenWidth, t);
//             }
//         }, this);
//     }

// }