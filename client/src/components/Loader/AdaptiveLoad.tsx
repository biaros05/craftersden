import React from "react";
const CreeperLoad = React.lazy(() => import("./CreeperLoad"));
const ZombieChaseLoad = React.lazy(() => import("./ZombieChaseLoad"));
import { useWindowSize } from "@uidotdev/usehooks";

/**
 * A loader that adapts to screensize
 * @returns {React.ReactNode} Loader
 */
export default function AdaptiveLoad(): React.ReactNode {
    const {width} = useWindowSize();

    return <>
        {
            width! < 400 ? 
            <CreeperLoad/> :
            <ZombieChaseLoad/>
        }
    </>
}