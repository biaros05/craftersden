import { mat4 } from "gl-matrix"

export default class InteractiveCanvas {
    public xPosition = 0;
    public yPosition = 0;
    private dragPos: null | [number, number] = null;

    constructor(
        private canvas: HTMLCanvasElement,
        private onRender: ((view: mat4) => void) | undefined,
        private readonly center?: [number, number, number],
        private viewDist = 4,
        private xRotation = 0.8,
        private yRotation = 0.5,
        xPos = 0,
        yPos = 0,
    ) {
        this.xPosition = xPos;
        this.yPosition = yPos;

        this.canvas.addEventListener('mousedown', this.mousedownHandler)
        this.canvas.addEventListener('mousemove', this.mousemoveHandler)
        this.canvas.addEventListener('mouseup', this.mouseupHandler)
        this.canvas.addEventListener('wheel', this.wheelHandler)

        this.redraw()
    }

    private mousedownHandler = evt => {
        if (evt.button === 0) {
            this.dragPos = [evt.clientX, evt.clientY]
        }
    }

    private mousemoveHandler = evt => {
        if (this.dragPos) {
            if (evt.shiftKey) {
                this.xPosition += (evt.clientX - this.dragPos[0]) / 100
                this.yPosition += (evt.clientY - this.dragPos[1]) / 100
            } else {
                this.yRotation += (evt.clientX - this.dragPos[0]) / 100
                this.xRotation += (evt.clientY - this.dragPos[1]) / 100
            }
            this.dragPos = [evt.clientX, evt.clientY]
            this.redraw()
        }
    }

    private mouseupHandler = () => {
        this.dragPos = null
    }

    private wheelHandler = evt => {
        evt.preventDefault()
        this.viewDist += evt.deltaY / 100
        this.redraw()
    }

    public redraw() {
        requestAnimationFrame(() => this.renderImmediately())
    }

    private renderImmediately() {
        if (this.onRender) {

        this.yRotation = this.yRotation % (Math.PI * 2)
        this.xRotation = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.xRotation))
        this.viewDist = Math.max(1, this.viewDist)

        const view = mat4.create()
        mat4.translate(view, view, [0, 0, -this.viewDist])
        mat4.translate(view, view, [0, -this.yPosition, 0])
        mat4.translate(view, view, [this.xPosition, 0, 0])
        mat4.rotate(view, view, this.xRotation, [1, 0, 0])
        mat4.rotate(view, view, this.yRotation, [0, 1, 0])
        if (this.center) {
            mat4.translate(view, view, [-this.center[0], -this.center[1], -this.center[2]])
        }

            this.onRender(view)
        }
    }

    /**
     * Creates a copy of the current InteractiveCanvas with possibility to override onRender function
     * @param {Function} onRender callback to call everytime a change is made to the canvas
     * @returns {InteractiveCanvas} new InteractiveCanvas
     */
    public cloneAndDelete(onRender?: (view: mat4) => void): InteractiveCanvas {
        const render = onRender ?? this.onRender;
        this.onRender = undefined;
        this.canvas.removeEventListener('mousedown', this.mousedownHandler);
        this.canvas.removeEventListener('mousemove', this.mousemoveHandler);
        this.canvas.removeEventListener('mouseup', this.mouseupHandler);
        this.canvas.removeEventListener('wheel', this.wheelHandler);

        return new InteractiveCanvas(
            this.canvas, 
            render, 
            this.center, 
            this.viewDist, 
            this.xRotation, 
            this.yRotation, 
            this.xPosition, 
            this.yPosition
        );
    }
}