import Rulers from "./Canvas/Rulers";
import Menu from "./Menu";
import Toolbar from "./Toolbar";
import Grid from "./Canvas/Grid"
import { ILayout } from "src/server/models/LayoutModel";
import useSocket from "~/hooks/useSocket";

export default function Layout({ layout, role }: { layout: ILayout, role: 'editor' | 'owner' | 'viewer' }) {

    

    return <>
        { role != 'viewer' ? <Toolbar /> : <></> }
        <Menu layoutName={layout.name} />
        <div className="app-layout-canvas-container h-screen w-screen pointer-events-none">
        <div className="h-screen w-screen absolute z-10">
            <Rulers />
        </div>
        <div className="absolute" style={{pointerEvents: "all" }}>
            <Grid layout={layout} role={role} />
        </div>
        </div>
    </>;
}
