import Konva from "konva";
import STYLES from "./styles";

export enum MeasurementUnit {
  Metric = "m",
  Imperial = "′"
}

export const centimetersToPixels = (centimeters: number) => {
  return metersToPixels(centimeters/100);
}

export const metersToPixels = (meters: number) => {
  return meters * STYLES.metricLineStyles[2].size
}

export const degreesToRadians = (deg: number) => deg * (Math.PI / 180);

export function rotateAroundPoint(shape: Konva.Shape, angleDegrees: any, point: any) {
    let angleRadians = angleDegrees * Math.PI / 180; // sin + cos require radians
    
    const x =
      point.x +
      (shape.x() - point.x) * Math.cos(angleRadians) -
      (shape.y() - point.y) * Math.sin(angleRadians);
    const y =
      point.y +
      (shape.x() - point.x) * Math.sin(angleRadians) +
      (shape.y() - point.y) * Math.cos(angleRadians);
     
    shape.rotation(shape.rotation() + angleDegrees); // rotate the shape in place
    shape.x(x);  // move the rotated shape in relation to the rotation point.
    shape.y(y);
    
    shape.moveToTop(); // 
  }

export function plotSizeToGridSize({
    width,
    height,
    units,
    scale
}: {
    width: number,
    height: number,
    units: MeasurementUnit,
    scale: number
}) {
    if (units == MeasurementUnit.Metric) {
        return { width: width * STYLES.metricLineStyles[2].size * scale, height: height * STYLES.metricLineStyles[2].size * scale }
        // return { width: width * STYLES.metricLineStyles[1].size * scale, height: height * STYLES.metricLineStyles[1].size * scale }
    }
    return { width: width * STYLES.imperialLineStyles[1].size * scale, height: height * STYLES.imperialLineStyles[1].size * scale }
}