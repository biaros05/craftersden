import React from "react";
const CreeperLoad = React.lazy(() => import("./CreeperLoad"));
const ZombieChaseLoad = React.lazy(() => import("./ZombieChaseLoad"));
import { useWindowSize } from "@uidotdev/usehooks";

export default function AdaptiveLoad() {
    const {width} = useWindowSize();

    return <>
        {
            width! < 400 ? 
            <CreeperLoad/> :
            <ZombieChaseLoad/>
        }
    </>
}