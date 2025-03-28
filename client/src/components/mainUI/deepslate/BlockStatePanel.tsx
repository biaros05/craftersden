/* eslint-disable jsdoc/no-undefined-types */
import { Resources, Structure, StructureRenderer } from 'deepslate';
import React, { useEffect, useRef, useState } from 'react';
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
  const keyIndex = useRef(0);
  const stateMappings = useRef<{[key:string]: string}[]>([]);
  const [advancedMode, setAdvancedMode] = useState(false);

  const possibleBlockstates = allBlockstates[blockName][0];
  useEffect(() => {
      currentState.current = allBlockstates[blockName][1];
  }, [blockName]);
  const state = currentState.current;

  useEffect(() => {
    /**
     * Event handler to cycle through different states
     * @param {KeyboardEvent} e - Event object 
     */
    function keyboardControls(e: KeyboardEvent) {
      if (!advancedMode) {
        const keyPressed = e.key.toLocaleLowerCase();
        
        if (keyPressed === 'arrowright' || keyPressed === 'd') {
          e.preventDefault();
          keyIndex.current = (keyIndex.current + 1) % stateMappings.current.length;
          updateBlockstate(stateMappings.current[keyIndex.current]);
        } else if (keyPressed === 'arrowleft' || keyPressed === 'a') {
          e.preventDefault();
          keyIndex.current = (keyIndex.current - 1 + stateMappings.current.length) % stateMappings.current.length;
          updateBlockstate(stateMappings.current[keyIndex.current]);
        }
      }
    }

    document.addEventListener('keydown', keyboardControls);

    return () => document.removeEventListener('keydown', keyboardControls);
  }, [advancedMode]);

  useEffect(() => {
    stateMappings.current = generateStates(possibleBlockstates);
  }, [blockName])

  // Initialize
  useEffect(() => {
    const gl = blockStatePreview?.current?.getContext('webgl');
    if (gl && resources) {
      previewStructure.current = new Structure([1, 1, 1]);
      previewStructure.current.addBlock([0, 0, 0], `${blockNamespace}:${blockName}`, currentState.current);
      
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
        updateBlockstate(state);
      }}>
        {possibleBlockstates[k].map(s => <option key={`option-${k}-${s}`} value={s}>{s}</option>)}
      </select>
    </fieldset>;
  });

  /**
   * Updates blockstate and redraws canvas
   * @param {{[key: string]: string}} blockstate new blockstate to apply
   */
  function updateBlockstate(blockstate: {[key: string]: string}) {
    const structure = new Structure([1, 1, 1]);
    structure.addBlock([0, 0, 0], `${blockNamespace}:${blockName}`, blockstate);
    previewStructure.current = structure;
    previewRenderer.current?.setStructure(structure);
    currentState.current = blockstate;
    previewInteractiveCanvas.current?.redraw();
    console.log(blockstate);
  }

  return <div className="blockstate-panel" tabIndex={0}>
    <canvas className="blockstate-preview" width={100} height={100} ref={blockStatePreview}></canvas>
    <label htmlFor="advanced">Advanced mode </label>
    <input type="checkbox" name="advanced" id="advanced" defaultChecked={advancedMode} onChange={(e) => setAdvancedMode(Boolean(e.target.checked))} />
    {advancedMode && <form>
      {stateInputs}
    </form>}
  </div>;
}

/*--- Algorithm proposed and implemented by AI ---*/
/**
 * Generate all possible blockstate combinations given 
 * an object holding keys and an array of possible values
 * @param {{[key: string]: string[]}} possibleBlockstates - Possible states (key,values)
 * @returns {object[]} All possible blockstate combinations
 */
function generateStates(possibleBlockstates: { [key: string]: string[] }): {[key: string]: string}[] {
  const keys = Object.keys(possibleBlockstates);
  const values = Object.values(possibleBlockstates);

  const combinations = cartesianProduct(values);

  return combinations.map(
    combination => Object.fromEntries(keys.map((key, i) => [key, combination[i]]))
  );
}

/**
 * Finds all possible combinations of a set of arrays
 * @param {Array[]} arrays - Arrays of possible values split by keys
 * @returns {Array[]} - Array of all possible combinations of given arrays
 */
function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>((acc, curr) => {
    return acc.flatMap(a => curr.map(b => [...a, b]));
  }, [[]]);
}
