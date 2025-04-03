/* eslint-disable jsdoc/no-undefined-types */
import React, { useRef } from "react";
import '../../styles/BuildImport.css';
import MinecraftButton from "../Custom/MinecraftButton";
import CloneableStructure from "./deepslate/CloneableStructure";
import { importLitematic, importStructureBlock } from "./deepslate/IOUtils";

/**
 * Provides a form for users to import a build they made in minecraft
 * @param {object} props - React props
 * @param {React.RefObject<CloneableStructure>} props.updateStructure - the structure ref to be overriden
 * @param {Function} props.close - Callback to close modal
 * @returns {React.ReactNode} BuildImport form
 */
export default function BuildImport({updateStructure, close}: {updateStructure: (arg0: CloneableStructure) => void, close: () => void}): React.ReactNode {
    const importFile = useRef<HTMLInputElement>(null);

    /**
     * Handles submission of import form
     * @param {React.MouseEvent<HTMLButtonElement>} e - Event object 
     */
    async function onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (importFile.current?.files) {
            const file = importFile.current.files[0];

            console.log(file.name)
            if (file.name.endsWith('.nbt')) {
                updateStructure(importStructureBlock(await file.bytes()))
            } else if (file.name.endsWith('.litematic')) {
                updateStructure(importLitematic(await file.bytes()));
            }
            close();
        }
    }

    return <form className="import-form">
        <label htmlFor="structure-file">File to import (.litematic, .nbt):</label>
        <input type="file" name="structure-file" id="structure-file" ref={importFile} accept=".litematic,.nbt" />
        <MinecraftButton className='submit-import' onClick={onSubmit}>Submit</MinecraftButton>
    </form>
}