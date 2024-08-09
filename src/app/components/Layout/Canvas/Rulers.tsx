import { MeasurementUnit, plotSizeToGridSize } from "./utils";
import STYLES from "./styles";
// import Konva from "konva";

import { Rect, Stage, Layer, Group, Line, Text } from "react-konva";
import { useContext, useEffect, useState } from "react";
import { LayoutContext } from "src/app/context/LayoutContext";

// interface RulersOptions {
//     store: any;
//     stage: Konva.Stage;
// }

const Rulers = () => {
    const {
        stageConfig: { stageScale, stageX, stageY },

        // stageX, stageY,

        bgColor,
        color,
        rulersWidth,

        // stageScale,
        // rulersCanvasWidth,
        // rulersCanvasHeight,

        layoutConfig: { layoutWidth, layoutHeight, layoutUnits },

        // layoutWidth,
        // layoutHeight,
        // layoutUnits
    } = useContext(LayoutContext);
    


    const { width, height } = plotSizeToGridSize({ width: layoutWidth, height: layoutHeight, units: layoutUnits, scale: stageScale })
    let lineStyles;

    if (layoutUnits == MeasurementUnit.Metric) lineStyles = STYLES.metricLineStyles;
    else lineStyles = STYLES.imperialLineStyles

    const [stageWidth, setStageWidth] = useState(0);
    const [stageHeight, setStageHeight] = useState(0);

    useEffect(() => {
        const resizeStage = () => {
            setStageWidth(window.innerWidth);
            setStageHeight(window.innerHeight);
        }

        resizeStage();

        window.addEventListener("resize", resizeStage);

        return () => {
            window.removeEventListener("resize", resizeStage);
        };
    }, [])

    function calculateTextFont(count: number) {
        return {
            fontSize: count % 1 == 0 ? 12 : 11,
            fontFamily: 'Arial',
            fontStyle: count % 1 == 0 ? '700' : '500'
        }
    }

    let rulerInterval;

    if (layoutUnits == MeasurementUnit.Metric) {
        if (stageScale == 1)
            rulerInterval = STYLES.metricLineStyles[1].size * stageScale;
        else rulerInterval = STYLES.metricLineStyles[1].size * stageScale;
    } else {
        rulerInterval = STYLES.imperialLineStyles[0].size * stageScale
    }

    let text, textOffset;

    const countInc = layoutUnits == MeasurementUnit.Metric ? 0.5 : 0.5;

    const horizontalTextNodes = [];
    const verticalTextNodes = [];

    for (let i = 0, count = 0; i <= 0 + width; i += rulerInterval, count += countInc) {
        const { fontFamily, fontSize, fontStyle } = calculateTextFont(count)
        text = count + layoutUnits;
        textOffset = count % 1 != 0 ? 10 : 15;
        if (!(stageScale < 1 && count % 1 != 0)) {
            horizontalTextNodes.push(
                <Text
                key={i}
                text={text}
                x={i - 20}
                width={40}
                y={textOffset}
                fill={color}
                align={'center'}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontStyle={fontStyle} />
            )
        }
    }

    for (let i = 0, count = 0; i <= height; i += rulerInterval, count += countInc) {
        const { fontFamily, fontSize, fontStyle } = calculateTextFont(count)
        
        text = count + layoutUnits;

        textOffset = count % 1 == 0 ? 25: 20;

        if (!(stageScale < 1 && count % 1 != 0)) {
            verticalTextNodes.push(
                <Text
                key={i}
                x={textOffset}
                width={50}
                y={i - 25}
                text={text}
                fill={color}
                align={'center'}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontStyle={fontStyle}
                rotation={90} />
            )
        }
    }

    return (
        <Stage width={stageWidth} height={stageHeight} x={0} y={0}>
            <Layer listening={ false }>
                <Rect
                    x={stageWidth - rulersWidth}
                    y={0}
                    width={rulersWidth}
                    height={stageHeight}
                    fill={bgColor}
                ></Rect>
                <Rect
                    x={0}
                    y={stageHeight - rulersWidth}
                    width={stageWidth}
                    height={rulersWidth}
                    fill={bgColor}
                ></Rect>
                <Group x={stageX} y={stageHeight - rulersWidth} height={rulersWidth} width={width}>
                    <Line points={[0,0,width,0]} stroke={color} strokeWidth={0.5} />
                    {lineStyles.map(style => {
                        const lines = [];
                        for (let i = 0; i <= width; i += style.size * stageScale) {
                            lines.push(
                                <Line key={i} points={[i, 0, i, style.length]} stroke={color} strokeWidth={style.lineWidth} />
                            )
                        }
                        return lines;
                    })}
                    {horizontalTextNodes}
                </Group>
                <Group x={stageWidth - rulersWidth} y={stageY} height={stageHeight} width={rulersWidth}>
                    <Line points={[0,0,0,height]} stroke={color} strokeWidth={0.5} />
                    {lineStyles.map(style => {
                        const lines = [];
                        for (let i = 0; i <= height; i += style.size * stageScale) {
                            // if (i > this.layer.height() - this.rulerWidth ) break;
                            
                            lines.push(
                                <Line key={i} points={[0, i, style.length + 0.5, i]} stroke={color} strokeWidth={style.lineWidth} />
                            )
                        }
                        return lines;
                    })}
                    {verticalTextNodes}
                </Group>
            </Layer>
        </Stage>
    )
}


export default Rulers;


//     draw() {
//         this.updatePosition();
        
//         this.layer.destroyChildren()
//         this.horizontalRuler.destroyChildren()
//         this.verticalRuler.destroyChildren()

//         this.layer.add(
//             new Konva.Rect({
//                 x: this.layer.width() - this.rulerWidth,
//                 y: 0,
//                 width: this.rulerWidth,
//                 height: this.layer.height(),
//                 fill: this.bgColor
//             }),
//             new Konva.Rect({
//                 x: 0,
//                 y: this.layer.height() - this.rulerWidth,
//                 width: this.layer.width(),
//                 height: this.rulerWidth,
//                 fill: this.bgColor
//             })
//         )

//         this.drawDivisions();
//         this.drawText();

//         const state = this.store.getState()
//         const { x, y, scale } = state.layout.canvas
//         const { width, height } = state.layout.canvas
//         const { units } = state.layout.settings

//         this.horizontalRuler.add(
//             new Konva.Line({
//                 points: [
//                     0,
//                     0,
//                     width,
//                     0,
                    
//                 ],
//                 stroke: this.color,
//                 strokeWidth: 0.5,
//             }),
//         )

//         this.verticalRuler.add(
//             new Konva.Line({
//                 points: [
//                     0,
//                     0,
//                     0,
//                     height
//                 ],
//                 stroke: this.color,
//                 strokeWidth: 0.5,
//             }),
//         )

//         this.layer.add(this.horizontalRuler, this.verticalRuler, this.horizontalRulerText, this.verticalRulerText)

//         if (units == MeasurementUnit.Metric) {
//             this.layer.add(
//                 new Konva.Line({
//                     points: [
//                         this.layer.width() - 50,
//                         this.layer.height() - 50,
//                         this.layer.width() - 50 + -STYLES.metricLineStyles[2].size * scale,
//                         this.layer.height() - 50,
//                         this.layer.width() - 50 + -STYLES.metricLineStyles[2].size * scale,
//                         this.layer.height() - 60
//                     ],
//                     strokeWidth: 2,
//                     stroke: this.color
//                 })
//             )
//         } else {
//             this.layer.add(
//                 new Konva.Rect({
//                     x: this.layer.width() - 50,
//                     y: this.layer.height() - 50,
//                     width: -STYLES.imperialLineStyles[1].size * scale,
//                     height: 3,
//                     fill: this.color
//                 })
//             )
//         }

//         this.layer.draw()
//     }

//     private calculateTextFont(count: number) {
//         return {
//             fontSize: count % 1 == 0 ? 12 : 11,
//             fontFamily: 'Arial',
//             fontStyle: count % 1 == 0 ? '700' : '500'
//         };
//     }

//     private drawText() {
//         const state = this.store.getState()

//         this.verticalRulerText.destroyChildren()
//         this.horizontalRulerText.destroyChildren()

//         const { x, y, scale, width, height } = state.layout.canvas
//         const { units } = state.layout.settings

//         let rulerInterval;

//         if (units == MeasurementUnit.Metric) {
//             if (scale == 1)
//                 rulerInterval = STYLES.metricLineStyles[1].size * scale;
//             else rulerInterval = STYLES.metricLineStyles[1].size * scale;
//         } else {
//             rulerInterval = STYLES.imperialLineStyles[0].size * scale
//         }

//         let text, textOffset;

//         let countInc = units == MeasurementUnit.Metric ? 0.5 : 0.5;

//         for (var i = 0, count = 0; i <= 0 + width; i += rulerInterval, count += countInc) {
//             const { fontFamily, fontSize, fontStyle } = this.calculateTextFont(count)
//             text = count + units;
//             textOffset = count % 1 != 0 ? 10 : 15;
//             if (!(scale == 1 && count % 1 != 0)) {
//                 this.horizontalRulerText.add(
//                     new Konva.Text({
//                         x: i - 25,
//                         width: 50,
//                         y: textOffset,
//                         text,
//                         fill: this.color,
//                         align: 'center',
//                         fontFamily, fontSize, fontStyle,
//                     })
//                 )
//             }
//         }

//         for (var i = 0, count = 0; i <= height; i += rulerInterval, count += countInc) {
            
//             const { fontFamily, fontSize, fontStyle } = this.calculateTextFont(count)

//             text = count + units;

//             textOffset = count % 1 == 0 ? 25: 20;

//             if (!(scale == 1 && count % 1 != 0)) {
//                 this.verticalRulerText.add(
//                     new Konva.Text({
//                         x: textOffset,
//                         width: 50,
//                         y: i - 25,
//                         text,
//                         fill: this.color,
//                         align: 'center',
//                         fontFamily, fontSize, fontStyle,
//                     }).rotate(90)
//                 )
//             }
//         }

//     }

//     private drawDivisions() {
//         const state = this.store.getState()

//         const { x, y, scale, height, width } = state.layout.canvas
//         const { units } = state.layout.settings

//         let lineStyles;

//         if (units == MeasurementUnit.Metric) lineStyles = STYLES.metricLineStyles;
//         else lineStyles = STYLES.imperialLineStyles

//         lineStyles.forEach(style => {

//             let inc = style.size * scale;

//             for (var i = 0; i <= width; i += inc) {
//                 this.horizontalRuler.add(
//                     new Konva.Line({
//                         points: [
//                             i,
//                             0,
//                             i,
//                             style.length
//                         ],
//                         stroke: this.color,
//                         strokeWidth: style.lineWidth,
//                     })
//                 )
//             }

//             for (var i = 0; i <= height; i += inc) {
//                 // if (i > this.layer.height() - this.rulerWidth ) break;

//                 this.verticalRuler.add(
//                     new Konva.Line({
//                         points: [
//                             0,
//                             i,
//                             style.length + 0.5,
//                             i
//                         ],
//                         stroke: this.color,
//                         strokeWidth: style.lineWidth,
//                     })
//                 )
//             }

//         }, this);
//     }

// }