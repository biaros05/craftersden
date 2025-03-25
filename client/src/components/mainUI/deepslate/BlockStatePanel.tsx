import { Resources, Structure, StructureRenderer } from 'deepslate';
import React, { useEffect, useRef } from 'react';
import useSWR from 'swr';
import InteractiveCanvas from './InteractiveCanvas';

const fetcher = (url) => fetch(url).then((res) => res.json());
const MCMETA = 'https://raw.githubusercontent.com/misode/mcmeta/refs/heads/summary/blocks/data.json';

/**
 * Renders a panel that lets users control the state of their blocks
 * @param {object} props - React props
 * @param {string} props.blockName Name of block selected
 * @param {Resources} props.resources resource object
 * @param {React.RefObject<{[key: string]: string}>} props.currentState State of the block
 * @returns {React.ReactNode} block state panel
 */
export default function BlockStatePanel(
  {blockName, blockNamespace, resources, currentState}:
  {blockName: string, blockNamespace: string, currentState: React.RefObject<{ [key: string]: string }>, resources?: Resources | undefined}
): React.ReactNode {
  const {data: allBlockstates} = useSWR(MCMETA, fetcher, {suspense: true});
  const blockStatePreview = useRef<HTMLCanvasElement>(null);
  const previewStructure = useRef<Structure>(new Structure([1, 1, 1]));
  const previewRenderer = useRef<StructureRenderer>(null);
  const previewInteractiveCanvas = useRef<InteractiveCanvas>(null);

  const possibleBlockstates = allBlockstates[blockName][0];

  // If currentState is empty use default and update buildPlane
  if (Object.keys(currentState.current).length === 0) {
    currentState.current = allBlockstates[blockName][1];
  }
  const state = currentState.current;

  // Initialize
  useEffect(() => {
    const gl = blockStatePreview?.current?.getContext('webgl');
    if (gl && resources) {
      previewStructure.current.addBlock([0, 0, 0], `${blockNamespace}:${blockName}`, state);
      
      previewRenderer.current = new StructureRenderer(gl, previewStructure.current, resources);

      // function that renders the structure
      const onRender = (view) => {
        previewRenderer.current!.drawStructure(view);
      };

      const size = previewStructure.current.getSize();
      const canvas = new InteractiveCanvas(blockStatePreview.current!, onRender, [size[0] / 2, size[1] / 2, size[2] / 2], 2);
      canvas.subscribe();
      previewInteractiveCanvas.current = canvas;

      return canvas?.cleanup;
    }
  }, [blockName, blockNamespace, resources]);

  const stateInputs = Object.keys(possibleBlockstates).map((k) => {

    return <fieldset key={`blockState-${blockName}-${k}`}>
      <label htmlFor={`blockstate-${blockName}-${k}-select`}>{k}</label>
      <select id={`blockstate-${blockName}-${k}-select`} defaultValue={state[k] ?? ''} onChange={(e) => {
        state[k] = e.target.value;
        const structure = new Structure([1, 1, 1]);
        structure.addBlock([0, 0, 0], `${blockNamespace}:${blockName}`, state);
        previewStructure.current = structure;
        previewRenderer.current?.setStructure(structure);
        currentState.current = state;
        previewInteractiveCanvas.current?.redraw();
      }}>
        {possibleBlockstates[k].map(s => <option key={`option-${k}-${s}`} value={s}>{s}</option>)}
      </select>
    </fieldset>;
  });

  return <div className="blockstate-panel">
    <canvas className="blockstate-preview" width={100} height={100} ref={blockStatePreview}></canvas>
    <form>
      {stateInputs}
    </form>
  </div>;
}