const canvas = new fabric.Canvas('canvas');
const canvasContainer = document.getElementById('canvas-container');


(function init() {
    canvas.selectionColor = 'rgba(0,0,0,0.3)';
    canvas.selectionBorderColor = 'black';
    canvas.selectionLineWidth = .2;
    canvas.renderOnAddRemove = true;
    //Corners
    fabric.Object.prototype.cornerSize = 6;
    fabric.Object.prototype.transparentCorners = true;
    fabric.Object.prototype.cornerColor = '#29ab51';
    //borders
    fabric.Object.prototype.borderColor = '#29ab51';
    fabric.Canvas.prototype.history = [];
    fabric.Canvas.prototype.state = [];
    fabric.Canvas.prototype.next = [];

    let canvasState = canvas.toDatalessJSON();

    // Agregar el estado a la pila
    canvas.history.push(canvasState);
    // fabric.Canvas.prototype.isRedoing = false;

    var i = 0
    var j = 0
    var l = 0



    fabric.Text.prototype.getStyleAtPosition = function (position, complete) {

        var loc = this.get2DCursorLocation(position),
            style = complete ?
                this.getCompleteStyleDeclaration(loc.lineIndex, loc.charIndex) :
                this._getStyleDeclaration(loc.lineIndex, loc.charIndex);

        return style || {};
    }

    function getStyle(object, styleName) {
        return (object.getStyleAtPosition && object.isEditing) ?
            object.getStyleAtPosition(object.selectionStart)[styleName] :
            object[styleName];
    }

    fabric.Text.prototype._getWidthOfCharSpacing = function () {
        //console.log("test",this.text.length)
        char = this.getStyleAtPosition(i)['charSp']
        if (typeof char !== 'undefined') {
            if (this.text.length == i) {
                i = 0;
            }
            else
                i++;
            return char;
            //return this.fontSize * char / 1000;


        }
        if (this.text.length == i) {
            i = 0;
        }
        else
            i++;

        return 0;

    };

    fabric.Text.prototype.getHeightOfLine = function (lineIndex) {
        lineh = this.getStyleAtPosition(i)['lheight']
        i++;
        if (this.__lineHeights[lineIndex]) {
            j++
            return this.__lineHeights[lineIndex];
        }

        var line = this._textLines[lineIndex],
            // char 0 is measured before the line cycle because it nneds to char
            // emptylines
            maxHeight = this.getHeightOfChar(lineIndex, 0);
        maxLheight = 1

        for (var i = 0, len = line.length; i < len; i++) {
            maxHeight = Math.max(this.getHeightOfChar(lineIndex, i), maxHeight);
            if (typeof this.getStyleAtPosition(j)['lheight'] !== "undefined") {
                maxLheight = Math.max(this.getStyleAtPosition(j)['lheight'], maxLheight)
            }
            k = lineIndex;
            if (k !== l) {
                j++
            }
            l = lineIndex;
            if (this.text.length == j) {
                j = 0;
            }
            j++;
        }

        return this.__lineHeights[lineIndex] = (maxHeight + maxLheight) * this.lineHeight * this._fontSizeMult;
    }

    const text = new fabric.IText('NICOLAS', {
        left: 52,
        top: 53,
        fill: 'black',

        fontSize: 70,
        charSpacing: 80, //Important = 1 -> true
        styles: {
            0: {
                0: { fontSize: 30, charSp: 30, lheight: 1 },
                1: { fontSize: 30, charSp: 30, lheight: 1 },
                2: { fontSize: 30, charSp: 30, lheight: 1 },
                3: { fontSize: 30, charSp: 30, lheight: 1 },
                4: { fontSize: 30, charSp: 30, lheight: 1 },
                5: { textBackgroundColor: 'red', fontSize: 30, charSp: 30, lheight: 1 },
                6: { fontSize: 30, charSp: 30, lheight: 1 },
            },
        }
    });


})();

const undoButton = document.querySelector('#undo-icon');
const redoButton = document.querySelector('#redo-icon');

//zoom with mouse wheel 
canvas.on('mouse:wheel', function (opt) {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();

    const vpt = this.viewportTransform;
    if (zoom < 400 / 1000) {
        vpt[4] = 200 - 1000 * zoom / 2;
        vpt[5] = 200 - 1000 * zoom / 2;
    } else {
        if (vpt[4] >= 0) {
            vpt[4] = 0;
        } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
            vpt[4] = canvas.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
            vpt[5] = 0;
        } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
            vpt[5] = canvas.getHeight() - 1000 * zoom;
        }
    }
})
let key = true;
canvas.on({
    //select objects
    'selection:created': (opt) => {
        validResize();
        getDimensionsInCm();
        getPosition()
        getAngle();
    },
    //click from one element to another
    'selection:updated': (opt) => {
        getDimensionsInCm();
        getPosition()
        getAngle();
    },
    //no selection elements
    'selection:cleared': (opt) => {
        resetPanelValues()
    },
    //modifiy objects
    'object:modified': (opt) => {
        getDimensionsInCm();
        getAngle();
        saveCanvasState();
    },
    //object added to canvas
    'object:added': (opt) => {
        getDimensionsInCm();
        getAngle();
        getPosition();
        saveCanvasState();
    },
    //object rotating
    'object:rotating': (opt) => {
        getDimensionsInCm();
        getAngle();
        getPosition()
    },
})
function getDimensionsInCm() {
    const object = canvas.getActiveObject();

    if (!object) { return }

    const widthInPx = object.getScaledWidth();
    const heightInPx = object.getScaledHeight();

    // hay 37.795280352161 pixeles en 1 cm -> widthInPx / 37.795280352161
    // hay 2.54 cm en una pulgada, y hay 96 pixeles por pulgada -> pixel * 2.54 / 96

    sizeWInput.value = (widthInPx * 2.54 / 96).toFixed(2);
    sizeHInput.value = (heightInPx * 2.54 / 96).toFixed(2);
}


//move objects
canvas.on('object:moving', (opt) => {
    setLimitsObjects(opt.target);
    getPosition();
    getAngle();
})

/* limit object to canvas limits */
function setLimitsObjects(object) {

    object.setCoords();
    let curZoom = object.canvas.getZoom();

    // if object is too big ignore
    if (object.getScaledHeight() > object.canvas.height || object.getScaledWidth() > object.canvas.width) {
        return;
    }

    // top-left  corner
    if (object.getBoundingRect().top < 0 || object.getBoundingRect().left < 0) {
        object.top = Math.max(object.top * curZoom, object.top * curZoom - object.getBoundingRect().top) / curZoom;
        object.left = Math.max(object.left * curZoom, object.left * curZoom - object.getBoundingRect().left) / curZoom;
    }
    // bot-right corner
    if (object.getBoundingRect().top + object.getBoundingRect().height > object.canvas.height || object.getBoundingRect().left + object.getBoundingRect().width > object.canvas.width) {
        object.top = Math.min(object.top * curZoom, object.canvas.height - object.getBoundingRect().height + object.top * curZoom - object.getBoundingRect().top) / curZoom;
        object.left = Math.min(object.left * curZoom, object.canvas.width - object.getBoundingRect().width + object.left * curZoom - object.getBoundingRect().left) / curZoom;
    }
}

/* get position of an element */
function getPosition() {
    const object = canvas.getActiveObject();
    if (!object) { return }

    positionXInput.value = (object.left).toFixed(0);
    positionYInput.value = (object.top).toFixed(0);
}

/* get angle of an element */
function getAngle() {
    const object = canvas.getActiveObject();
    if (!object) { return }

    let newAngle = object.angle;
    if (newAngle > 360) {
        newAngle = 0;
    }

    rotationInput.value = (newAngle).toFixed(0);
}



// function setDimensions() { }
// function setAngle() { }



/* if not object selected reset values panel (position, width, angle) */
function resetPanelValues() {
    sizeWInput.value = ''
    sizeHInput.value = ''
    positionXInput.value = ''
    positionYInput.value = ''
    rotationInput.value = ''
}



function saveCanvasState() {
    if (!key) { return }

    // Clonar el estado actual del lienzo
    let canvasState = canvas.toDatalessJSON();

    // Agregar el estado a la pila
    canvas.history.push(canvasState);
    canvas.state = canvasState;
    canvas.next = [];
    // console.log("HISTORY", canvas.history)
    // console.log("STATE", canvas.state)
    // console.log("NEXT", canvas.next)
    // console.log("KEY", key)
    // Limpiar la pila de estados deshechos
}

undoButton.addEventListener('click', (e) => {

    if (canvas.history.length > 0) {
        key = false;

        let newHistory = canvas.history.splice(canvas.history.length - 1);
        // console.log("HISTORY: \n", canvas.history)

        //canvas.state = canvas.history[canvas.history.length - 1];
        // console.log("STATE: \n", canvas.state)

        canvas.next.push(...newHistory);
        console.log("NEXT: \n", canvas.next);
        // console.log("Renderizar: \n", canvas.history[canvas.history.length - 1]);

        canvas.state = canvas.history[canvas.history.length - 1]
        canvas.loadFromJSON(canvas.state);


        setTimeout(function () {
            key = true;
        }, 0)
    }
})

redoButton.addEventListener('click', (e) => {
    console.log("REDO", canvas.next);

    if (canvas.next.length > 0) {
        key = false;
        canvas.state = canvas.next.pop();
        canvas.history.push(canvas.state);

        canvas.loadFromJSON(canvas.state);
    }
    setTimeout(function () {
        key = true;
    }, 0)

    /* if (mods > 0) {
        canvas.clear().renderAll();
        canvas.loadFromJSON(state[state.length - 1 - mods + 1]);
        canvas.renderAll();
        //console.log("geladen " + (state.length-1-mods+1));
        mods -= 1;
        //console.log("state " + state.length);
        //console.log("mods " + mods);
    } */
})

function validResize() {
    const object = canvas.getActiveObject();
    if (!object) { return }

    if (object.type === 'group' || object.type === 'activeSelection') {

        object._objects.forEach(element => {
            if (element.type === 'image') {
                return object.set({ lockRotation: true, lockScalingX: true, lockScalingY: true, lockScalingFlip: true });
            } else {
                return true
            }
        })
    } else if (object.type === 'image') {
        return object.set({ lockRotation: true, lockScalingX: true, lockScalingY: true, lockScalingFlip: true });
    }
}

/* KEYBOARDS MOVEMENTS*/

document.addEventListener('keydown', (e) => {
    const object = canvas.getActiveObject();
    const key = e.key;

    if (!object) { return }

    switch (key) {
        case 'ArrowLeft': {
            object.set({ left: object.left - 1 });
            break;
        }
        case 'ArrowUp': {
            object.set({ top: object.top - 1 });
            break;
        }
        case 'ArrowRight': {
            object.set({ left: object.left + 1 });
            break;
        }
        case 'ArrowDown': {
            object.set({ top: object.top + 1 });
            break;
        }
        case 'Delete': {
            if (object.type === 'activeSelection') {
                return deleteObjects(object._objects), saveCanvasState();

            }
            return deleteObject(object), saveCanvasState();
        }
        default:
            break;
    }
    getPosition();
    canvas.renderAll();
})