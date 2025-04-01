/* eslint-disable jsdoc/no-undefined-types */
import { mat4 } from "gl-matrix"

/* --- Adapted from deepslatejs demo --- */

export default class InteractiveCanvas {
    public xPosition = 0;
    public yPosition = 0;
    private dragPos: null | [number, number] = null;
    private mousedownHandlerBind: (arg0: MouseEvent) => void;
    private mousemoveHandlerBind: (arg0: MouseEvent) => void;
    private mouseupHandlerBind: () => void;
    private wheelHandlerBind: (arg0: WheelEvent) => void;
    private subscribed = false;
    public dragging = false;

    constructor(
        private canvas: HTMLCanvasElement,
        private onRender: ((view: mat4) => void),
        private readonly center?: [number, number, number],
        private viewDist = 4,
        private xRotation = 0.8,
        private yRotation = 0.5,
        xPos = 0,
        yPos = 0,
    ) {
        this.xPosition = xPos;
        this.yPosition = yPos;

        this.mousedownHandlerBind = this.mousedownHandler.bind(this);
        this.mousemoveHandlerBind = this.mousemoveHandler.bind(this);
        this.mouseupHandlerBind = this.mouseupHandler.bind(this);
        this.wheelHandlerBind = this.wheelHandler.bind(this);
        
        this.redraw();
    }

    public setOnRender(newOnRender: (view: mat4) => void) {
        this.onRender = newOnRender;
    }

    public subscribe() {
        this.canvas.addEventListener('mousedown', this.mousedownHandlerBind)
        this.canvas.addEventListener('mousemove', this.mousemoveHandlerBind)
        this.canvas.addEventListener('mouseup', this.mouseupHandlerBind)
        this.canvas.addEventListener('wheel', this.wheelHandlerBind)
        this.subscribed = true;
    }

    public unsubscribe() {
        this.canvas.removeEventListener('mousedown', this.mousedownHandlerBind);
        this.canvas.removeEventListener('mousemove', this.mousemoveHandlerBind);
        this.canvas.removeEventListener('mouseup', this.mouseupHandlerBind);
        this.canvas.removeEventListener('wheel', this.wheelHandlerBind);
        this.subscribed = false;
    }

    private mousedownHandler(evt) {
        if (evt.button === 0) {
            this.dragPos = [evt.clientX, evt.clientY]
            this.dragging = false;
        }
    }

    private mousemoveHandler(evt) {
        if (this.dragPos) {
            if (evt.shiftKey) {
                this.xPosition += (evt.clientX - this.dragPos[0]) / 100
                this.yPosition += (evt.clientY - this.dragPos[1]) / 100
            } else {
                this.yRotation += (evt.clientX - this.dragPos[0]) / 100
                this.xRotation += (evt.clientY - this.dragPos[1]) / 100
            }

            if (Math.abs(evt.clientX - this.dragPos[0]) > 10 || Math.abs(evt.clientY - this.dragPos[1]) > 10) {
                this.dragging = true;
            }
            
            this.dragPos = [evt.clientX, evt.clientY]
            this.redraw()
        }
    }

    private mouseupHandler() {
        // this.dragging = false;
        this.dragPos = null;
    }

    private wheelHandler(evt) {
        evt.preventDefault()
        this.viewDist += evt.deltaY / 100
        this.redraw()
    }

    public redraw() {
        requestAnimationFrame(() => this.renderImmediately());
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
     * @param {HTMLCanvasElement} newCanvas new canvas, must be used if the instance has been disposed of
     * @param {Function} onRender callback to call everytime a change is made to the canvas
     * @returns {InteractiveCanvas} new InteractiveCanvas
     */
    public clone(newCanvas?: HTMLCanvasElement, onRender?: (arg0: mat4) => void): InteractiveCanvas {
        const render = onRender ?? this.onRender;
        const canvas = newCanvas ?? this.canvas;
        const newInteractiveCanvas = new InteractiveCanvas(
            canvas,
            render,
            this.center, 
            this.viewDist, 
            this.xRotation, 
            this.yRotation, 
            this.xPosition, 
            this.yPosition
        );

        return newInteractiveCanvas;
    }

    public cleanup() {
        if (this) {
            if (this.canvas) {
                if (this.subscribed) {
                    this.unsubscribe();
                }
                this.canvas = null as never;
            }
    
            this.mousedownHandlerBind = null as never;
            this.mousemoveHandlerBind = null as never;
            this.mouseupHandlerBind = null as never;
            this.wheelHandlerBind = null as never;
        
            this.renderImmediately = () => {};
            this.redraw = () => {};
        }
    }
}