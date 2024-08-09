import React, { createContext, useState, useMemo, useEffect, useReducer } from "react";
import Konva from "konva";
import { MeasurementUnit } from "~/components/Layout/Canvas/utils";

type Props = {
    children: React.ReactNode;
};

export type ShapeType = "plant" | "text" | "structure" | "irrigation" | "rect";

type ILayoutContext = {

}

export type Node = {
    id: string;
    // children: Child[];
    parents: string[];
    text: string;
    shapeType: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
    
    // Styles
    fill: string;
    color: string;
    stroke: string;
    strokeWidth: number;

    radius: number;
    sides: number;
};

export type Line = Node & {
    points: number[];
}

export type UserCursor = {
    x: number;
    y: number;
};

export type RoomUser = {
    name: string | null;
    color: string;
};

export const LayoutContext: React.Context<any> = createContext({} as any);

export const LayoutContextProvider: React.FC<Props> = ({ children }) => {
    const [stageRef, setStageRef] = useState<React.RefObject<Konva.Stage> | null>(null);
    const [nodes, setNodes] = useState([]);

    const layoutDataReducer = (state: any, action: any) => {
        switch (action.type) {
            case "UPDATE_NODE":
                return {
                    ids: state.ids,
                    entities: {
                        ...state.entities,
                        [action.node._id]: action.node
                    }
                }
            case "ADD_NODE":
                return {
                    ids: state.ids.concat(action.node._id),
                    entities: {
                        ...state.entities,
                        [action.node._id]: action.node
                    }
                };
            case "MOVE_NODE":
                return {
                    ids: state.ids,
                    entities: {
                        ...state.entities,
                        [action._id]: {
                            ...state.entities[action._id],
                            x: action.x,
                            y: action.y
                        }
                    }
                }
            case "DELETE_NODE": {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [action._id]: _, ...newEntities} = state.entities;
                return {
                    ids: state.ids.filter((id: string) => id !== action._id),
                    entities: newEntities
                }
            }
            case "UPSERT_NODE": {
                const newEntities = { ...state.entities };
                const newIds = [...state.ids];
                

                if (newEntities[action.node._id]) // Update node
                {
                    newEntities[action.node._id] = action.node;
                }
                else // Add node
                {
                    newIds.push(action.node._id);
                    newEntities[action.node._id] = action.node;
                }
                

                return {
                    ids: newIds,
                    entities: newEntities
                }
            }
                
        }
        return state;
    }

    const [layoutData, dispatchLayoutData] = useReducer(layoutDataReducer, { ids: [], entities: {} });

    const addNode = (node: any) => dispatchLayoutData({ type: "ADD_NODE", node });
    const upsertNode = (node: any) => dispatchLayoutData({ type: "UPSERT_NODE", node });
    const moveNode = (_id: any, x, y) => dispatchLayoutData({ type: "MOVE_NODE", _id, x, y });
    const deleteNode = (_id: any) => dispatchLayoutData({ type: "DELETE_NODE", _id })

    const [currentShape, setCurrentShape] = useState<ShapeType>();
    const [selectedShapes, setSelectedShapes] = useState<Konva.Group[]>([]);


    /* STYLES */
    const [bgColor, setBgColor] = useState("");
    const [color, setColor] = useState("")

    const [rulersWidth, setRulersWidth] = useState(30);

    const [layoutConfig, setLayoutConfig] = useState({
        layoutName: "",
        layoutWidth: 0,
        layoutHeight: 0,
        layoutUnits: MeasurementUnit.Metric
    })

    const [stageConfig, setStageConfig] = useState({
        stageScale: 1,
        stageX: 0,
        stageY: 0,
        stageWidth: 0,
        stageHeight: 0
    })

    const [cursor, setCursor] = useState({
        x: 0,
        y: 0
    })

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0
    })

    const [roomId, setRoomId] = useState()
    const [userCursors, setUserCursors] = useState<Map<string, UserCursor>>(new Map());
    const [userRole, setUserRole] = useState();
    const [roomUsers, setRoomUsers] = useState<Map<string, RoomUser>>(new Map());

    useEffect(() => {
        setBgColor(getComputedStyle(document.body).getPropertyValue('--bg-200'))
        setColor(getComputedStyle(document.body).getPropertyValue('--text-100'))
    }, [])
    
    const memoizedStates = useMemo(
        () => ({
            stageRef, setStageRef,

            layoutData,

            cursor, setCursor,
            contextMenu, setContextMenu,

            rulersWidth,
            setRulersWidth,
            bgColor,
            setBgColor,
            color, setColor,

            stageConfig, setStageConfig,
            layoutConfig, setLayoutConfig,

            nodes, setNodes,
            selectedShapes, setSelectedShapes,

            currentShape, setCurrentShape,

            userCursors, setUserCursors,
            roomUsers, setRoomUsers,
            roomId, setRoomId
        }),
        [
            stageRef,
            
            contextMenu,
            layoutData,
            nodes,
            selectedShapes,

            cursor,

            userCursors,
            roomUsers,
            roomId,

            currentShape,
            rulersWidth,

            stageConfig, layoutConfig,

            color,
            bgColor,
        ]
    )

    const value = {
        ...memoizedStates,
        addNode,
        moveNode,
        deleteNode,
        upsertNode
    }

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};