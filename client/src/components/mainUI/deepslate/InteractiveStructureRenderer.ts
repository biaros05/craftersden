import { StructureRenderer } from "deepslate";
import { mat4 } from "gl-matrix";

export default class InteractiveStructureRenderer extends StructureRenderer {    
    public getPerspectiveMatrix(): mat4 {
        return this.getPerspective();
    }

    public getGl(): WebGLRenderingContext {
        return this.gl;
    }
}