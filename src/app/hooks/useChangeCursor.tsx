import { useEffect } from "react";

export type CursorType =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'e-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'col-resize'
  | 'row-resize'
  | 'all-scroll'
  | 'zoom-in'
  | 'zoom-out'
  | 'grab'
  | 'grabbing';

const useChangeCursor = (cursorStyle: CursorType, condition = true) => {
    useEffect(() => {
      if (condition) {
        document.body.style.cursor = cursorStyle;
      } else {
        document.body.style.cursor = 'default';
      }
  
      // Cleanup function to reset cursor to default on component unmount
      return () => {
        document.body.style.cursor = 'default';
      };
    }, [cursorStyle, condition]);
  };
  
  export default useChangeCursor;