/* eslint-disable jsdoc/no-undefined-types */
import React, { useRef } from "react";
import MinecraftButton from "../Custom/MinecraftButton";
import CloneableStructure from "./deepslate/CloneableStructure";
import { useAuth } from '../../hooks/useAuth';

/**
 * Prompts user of export settings and generates artifact
 * @param {object} props - React props
 * @param {CloneableStructure} props.structure - Structure to export
 * @param {() => void} props.close - Callback to close parent modal
 * @returns {React.ReactNode} BuildExport component
 */
export default function BuildExport({structure, close}: {structure: CloneableStructure, close: () => void}): React.ReactNode {
    const { username } = useAuth() ?? {};
    const structureBlock = useRef<HTMLInputElement>(null);
    const litematic = useRef<HTMLInputElement>(null);

    /**
     * Triggers the exporting based on chosen settings
     * @param {React.MouseEvent<HTMLButtonElement>} e - Mouse event object
     */
    function exportBuild(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (litematic.current!.checked) {
            // Litematic
            const exportedStructure = structure.toLitematic(username ?? 'Crafters Den');
            const url = new File([exportedStructure.write()], 'test.litematic');
            // download the artifact
            const a = document.createElement('a');
            a.href = URL.createObjectURL(url);
            a.download = 'test.litematic';
            a.click();
        } else {
            // Structure block
            const exportedStructure = structure.toStructureBlock('test.nbt');
            const url = new File([exportedStructure.write()], 'test.nbt');
            // download the artifact
            const a = document.createElement('a');
            a.href = URL.createObjectURL(url);
            a.download = 'test.nbt';
            a.click();
        }
        close();
    }
    return <form>
        <label htmlFor="structure-block">Structure Block</label>
        <input type="radio" name="format" id="structure-block" ref={structureBlock} defaultChecked />
        <label htmlFor="litematic">Litematic</label>
        <input type="radio" name="format" id="litematic" ref={litematic} />
        <MinecraftButton className="export-build" onClick={exportBuild} >Export</MinecraftButton>
    </form>
}