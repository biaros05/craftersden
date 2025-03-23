import { Resources, Structure, StructureRenderer } from "deepslate";
import React, { useEffect, useRef, useState } from "react"
import useSWR from "swr";
import InteractiveCanvas from "./InteractiveCanvas";

const fetcher = (url) => fetch(url).then((res) => res.json());

/**
 * Renders a panel that lets users control the state of their blocks
 * @param {object} props - React props
 * @param {string} props.blockName Name of block selected
 * @param {React.Dispatch<React.SetStateAction<{[key: string]: string}>>} props.setBlockstate Set state callback update current state
 * @param {Resources} props.resources resource object
 * @param {{[key: string]: string}} props.currentState State of the block
 * @returns {React.ReactNode} block state panel
 */
export default function BlockStatePanel(
    {blockName, blockNamespace, setBlockstate, resources, currentState}:
    {blockName: string, blockNamespace: string, setBlockstate: React.Dispatch<React.SetStateAction<{ [key: string]: string} | undefined>>, resources?: Resources | undefined, currentState?: { [key: string]: string } | undefined}
): React.ReactNode {
    const {data: allBlockstates} = useSWR('https://raw.githubusercontent.com/misode/mcmeta/refs/heads/summary/blocks/data.json', fetcher, {suspense: true})
    const blockStatePreview = useRef<HTMLCanvasElement>(null);
    const [previewStructure, setPreviewStructure] = useState<Structure>(new Structure([1, 1, 1]));
    const [, setPreviewRenderer] = useState<StructureRenderer>();
    const [previewCanvas, setPreviewCanvas] = useState<InteractiveCanvas>();

    const possibleBlockstates = allBlockstates[blockName][0];

    useEffect(() => {
        const gl = blockStatePreview?.current?.getContext('webgl');
        if (gl && resources) {
            previewStructure.addBlock([0, 0, 0], `${blockNamespace}:${blockName}`, state);
            const newRenderer = new StructureRenderer(gl, previewStructure, resources);
            setPreviewRenderer(newRenderer);

            // function that renders the structure
            const onRender = (view) => {
                newRenderer.drawStructure(view);
            }

            const size = previewStructure.getSize();
            setPreviewCanvas(new InteractiveCanvas(blockStatePreview.current!, onRender, [size[0] / 2, size[1] / 2, size[2] / 2], 2));
        }
    }, [blockStatePreview, resources]);

    useEffect(() => {
        const structureGl = blockStatePreview?.current?.getContext('webgl');
        if (structureGl && resources) {
            const newRenderer = new StructureRenderer(structureGl, previewStructure, resources);
            setPreviewRenderer(newRenderer);

            // function that renders the structure
            const onRender = (view) => {
                newRenderer.drawStructure(view);
            }
            
            setPreviewCanvas(previewCanvas!.cloneAndDelete(onRender));
        }
    }, [previewStructure]);

    // If currentState is undefined use default and update buildPlane
    const state = currentState ?? allBlockstates[blockName][1];
    useEffect(() => {
        if (!currentState) {
            setBlockstate(state);
        }
    }, [currentState, state]);

    const stateInputs = Object.keys(possibleBlockstates).map((k) => {

        return <fieldset key={`blockState-${blockName}-${k}`}>
            <label htmlFor={`blockstate-${blockName}-${k}-select`}>{k}</label>
            <select id={`blockstate-${blockName}-${k}-select`} defaultValue={state[k] ?? ""} onChange={(e) => {
                state[k] = e.target.value;
                const structure = new Structure([1, 1, 1]);
                structure.addBlock([0, 0, 0], `${blockNamespace}:${blockName}`, state);
                setPreviewStructure(structure);
                setBlockstate({...state});
            }}>
                {possibleBlockstates[k].map(s => <option key={`option-${k}-${s}`} value={s}>{s}</option>)}
            </select>
        </fieldset>
    });

    return <div className='blockstate-panel'>
        <canvas className="blockstate-preview" width={100} height={100} ref={blockStatePreview}></canvas>
        <form>
            {stateInputs}
        </form>
    </div>
}