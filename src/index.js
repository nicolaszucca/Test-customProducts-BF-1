//HTML references
const btnCreateText = document.querySelector('#btnCreateText');
const btnCreateDate = document.querySelector('#btnCreateDate');
const btnCreateGroup = document.querySelector('#btnCreateGroup');
const btnDiscardGroup = document.querySelector('#btnDiscardGroup');
const btnCreateOutline = document.querySelector('#btnCreateOutline');
const numberShadows = document.querySelector('#numberShadows');
const btnDragMode = document.querySelector('#dragmode');
const selectFamily = document.querySelector('#fontFamily');
const customText = document.querySelector('#customText');//menu text custom

const fontSize = document.querySelector('#fontSize');

const alignLeft = document.querySelector('#align-left');
const alignCenter = document.querySelector('#align-center');
const alignRight = document.querySelector('#align-right');

const alignTopHeight = document.querySelector('#align-top-height');
const alignCenterHeight = document.querySelector('#align-center-height');
const alignBottomHeight = document.querySelector('#align-bottom-height');

const mirrorEffect = document.querySelector('#btnMirrorEfect');

const trashButton = document.querySelector('#trashButton');
const copyButton = document.querySelector('#copyButton');

const sendToFront = document.querySelector('#send-to-front');
const sendToBack = document.querySelector('#send-to-back');

const undoButton = document.querySelector('#undo');
const redoButton = document.querySelector('#redo');

const inputimage = document.querySelector('#input-image');

//image
const oso = document.querySelector('#osoImage');
const dije = document.querySelector('#dijeImage');



const canvas = new fabric.Canvas('canvas');
const center = canvas.getCenter();

(function init() {
    canvas.setBackgroundImage('', canvas.renderAll.bind(canvas), {

        scaleX: 1,
        scaleY: 1,
        top: center.top,
        left: center.left,
        originX: 'center',
        originY: 'center',
    })
    canvas.selectionColor = 'rgba(0,0,0,0.3)';
    canvas.selectionBorderColor = 'black';
    canvas.selectionLineWidth = .2;

    //Corners
    fabric.Object.prototype.cornerSize = 6;
    fabric.Object.prototype.transparentCorners = true;
    fabric.Object.prototype.cornerColor = '#29ab51';
    //borders
    fabric.Object.prototype.borderColor = '#29ab51';
    fabric.Canvas.prototype.history = [];
    fabric.Canvas.prototype.state = [];
    fabric.Canvas.prototype.next = [];
    // fabric.Canvas.prototype.isRedoing = flase
    canvas.add(new fabric.Image(oso, {
        left: 0,
        top: 0,
        angle: 0,
        backgroundColor: 'transparent',
    }));

    /* canvas.add(new fabric.Image(dije, {
        left: 400,
        top: 0,
        angle: 0,
        backgroundColor: 'transparent',
    })); */
    const text = new fabric.IText('NICOLAS', {
        left: 50,
        top: 50,
        fill: 'black',
        selectionLineWidth: 20,
        fontSize: 70,
        //fontWeight: 'bold',
    });

    const text2 = new fabric.IText('NICOLAS', {
        left: 50,
        top: 50,
        fill: 'red',

        stroke: 'red',
        strokeLineJoin: 'round',
        strokeWidth: 5,
        strokeUniform: true,

        fontSize: 70,
        //fontWeight: 'bold',

    });
    canvas.add(text2)
    canvas.add(text)
})()

let key = true;
canvas.on({
    'mouse:dblclick': (opt) => {
        const x = opt.pointer.x - 120;
        const y = opt.pointer.y - 15;
        const pos = opt.pointer.y - 120
        addText(x, y, pos);
    },

    'selection:created': (opt) => {
        //Seleccionar un elemento
        if (opt.e) {
            const activeObj = canvas.getActiveObject();
            activeObj.set("backgroundColor", "#C8E0FF");

            customText.style.display = '';
            customText.style.top = (activeObj.top - 55 - 50) + 'px';

            canvas.renderAll();
        }
        getDimensionsInCm()
    },

    'text:editing:entered': (opt) => {
        //editar un texto
        clearText(opt);
    },
    'text:changed': (opt) => {
        //console.log(opt.target)
    },

    'selection:cleared': (opt) => {
        //no seleccionar un elemento
        //click on canvas
        if (opt.deselected) {
            if (opt.deselected[0].text == '') {
                opt.deselected[0].text = "Ingrese texto";
            }
        }

        customText.style.display = 'none';

        canvas._objects.forEach(e => {
            e.set({ backgroundColor: 'transparent' })
        })
    },
    'object:moving': (opt) => {
        //muevo un obj
        setLimitsObjects(opt.target)
        customText.style.display = 'none';
    },
    'object:modified': (opt) => {
        //modifico un obj
        saveCanvasState()
        customText.style.display = '';
        customText.style.top = (opt.target.top - 55 - 50) + 'px';
    },
    'object:added': (opt) => {
        saveCanvasState()
    },
    'object:removed': (opt) => {
        saveCanvasState()
    }
})


function getDimensionsInCm() {
    var activeObject = canvas.getActiveObject();

    if (activeObject) {
        var widthInPx = activeObject.getScaledWidth();
        var heightInPx = activeObject.getScaledHeight();

        // Obtener la relación entre los píxeles en el lienzo y los centímetros del mundo real
        var cmPerPixel = 1 / canvas.getZoom();

        var widthInCm = widthInPx * cmPerPixel;
        var heightInCm = heightInPx * cmPerPixel;

        console.log("pixelsW in cm", (widthInPx / 37.795280352161).toFixed(2));

        console.log("pixelsH in cm", (heightInPx / 37.795280352161).toFixed(2));
        // console.log("Altura: " + heightInCm.toFixed(2) + " cm");
    }
}



function setLimitsObjects(obj) {

    obj.setCoords();
    let curZoom = obj.canvas.getZoom();

    // if object is too big ignore
    if (obj.getScaledHeight() > obj.canvas.height || obj.getScaledWidth() > obj.canvas.width) {
        return;
    }

    // top-left  corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top * curZoom, obj.top * curZoom - obj.getBoundingRect().top) / curZoom;
        obj.left = Math.max(obj.left * curZoom, obj.left * curZoom - obj.getBoundingRect().left) / curZoom;
    }
    // bot-right corner
    if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top * curZoom, obj.canvas.height - obj.getBoundingRect().height + obj.top * curZoom - obj.getBoundingRect().top) / curZoom;
        obj.left = Math.min(obj.left * curZoom, obj.canvas.width - obj.getBoundingRect().width + obj.left * curZoom - obj.getBoundingRect().left) / curZoom;
    }
}

function clearText(e) {
    if (e.target.type === "textbox") {
        if (e.target.text === "Ingrese texto") {
            e.target.text = "";
            e.target.hiddenTextarea.value = '';
            canvas.renderAll();
        };
    }
}

function addText(x = 75, y = 430, pos = 325) {
    const text = new fabric.IText('Ingrese texto', { //NOTE: fabric.Text / .Textbox
        left: x,
        top: y,
        //width: 320,
        customType: 'textbox',
        fontSize: 50,
        fontFamily: 'Times New Roman',
        // scaleX: 0.90,
        // scaleY: 0.90,

        editable: true,

        backgroundColor: 'transparent',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    customText.style.display = '';
    customText.style.top = pos + 'px';
}

function addDate(x = 382, y = 220) {

    const date = createDate();

    canvas.add(date);
    canvas.renderAll();
}


trashButton.addEventListener('click', (e) => {
    const obj = canvas.getActiveObject();

    if (obj.type === "activeSelection") {
        return deleteObjects(obj._objects);
    }

    return deleteObject(obj);
})
//Delete objects functions
function deleteObject(obj) {

    canvas.remove(obj)
    canvas.requestRenderAll();
}

function deleteObjects(objects = []) {
    objects.forEach(e => {
        canvas.remove(e);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    })
}

//button listeners
btnCreateText.addEventListener('click', (e) => {
    addText();
});

btnCreateDate.addEventListener('click', (e) => {
    addDate();
})

btnCreateGroup.addEventListener('click', (data) => {
    const obj = canvas.getActiveObject()
    if (!obj) {
        return;
    }
    if (obj.type !== 'activeSelection') {
        return;
    }
    canvas.getActiveObject().toGroup();
    //canvas.getActiveObject().type = 'ObjectGroup';
})

btnDiscardGroup.addEventListener('click', (e) => {
    if (!canvas.getActiveObject()) {
        return;
    }
    if (canvas.getActiveObject().type !== 'group') {
        return;
    }
    canvas.getActiveObject().toActiveSelection();
    canvas.requestRenderAll();
})

mirrorEffect.addEventListener('click', (e) => {
    const object = canvas.getActiveObject();
    object.toggle('flipX');
    saveCanvasState()
    canvas.renderAll();
})

btnCreateOutline.addEventListener('click', (e) => {

    const { text, top, left, width, height, fontFamily, fontSize } = canvas.getActiveObject();
    const outline = numberShadows.value;

    const objOutline = outlineGenerator(outline, text, fontFamily, fontSize);
    //TODO: groupo mas ancho y del mismo tamaño que el box al que le doy contorno
    const group = new fabric.Group(objOutline, { left: left, top: top, originX: 'left', originY: 'top', width: width, height: height });
    canvas.remove(canvas.getActiveObject())
    canvas.add(group);
    saveCanvasState()
    canvas.renderAll();
})

btnDragMode.addEventListener('change', (e) => {

    const STATE_IDLE = 'idle';
    const STATE_PANNING = 'panning';

    let state = STATE_IDLE;


    if (e.target.checked) { //is checked

        canvas.discardActiveObject();
        canvas.defaultCursor = 'move';
        canvas.forEachObject(function (object) {
            object.prevEvented = object.evented;
            object.prevSelectable = object.selectable;
            object.evented = false;
            object.selectable = false;
        });
        canvas.selection = false;

        canvas.on({
            'mouse:up': function (e) {
                state = STATE_IDLE;
            },
            'mouse:down': (e) => {
                state = STATE_PANNING;
                lastClientX = e.e.clientX;
                lastClientY = e.e.clientY;
            },
            'mouse:move': (e) => {
                if (state === STATE_PANNING && e && e.e) {
                    let deltaX = 0;
                    let deltaY = 0;
                    if (lastClientX) {
                        deltaX = e.e.clientX - lastClientX;
                    }
                    if (lastClientY) {
                        deltaY = e.e.clientY - lastClientY;
                    }
                    // Update the last X and Y values
                    lastClientX = e.e.clientX;
                    lastClientY = e.e.clientY;

                    let delta = new fabric.Point(deltaX, deltaY);
                    canvas.relativePan(delta);
                }
            }
        })


        // Handle dragmode change
        //let dragMode = false;
    } else { //no checked
        // When we exit dragmode, we restore the previous values on all objects
        canvas.forEachObject(function (object) {
            object.evented = (object.prevEvented !== undefined) ? object.prevEvented : object.evented;
            object.selectable = (object.prevSelectable !== undefined) ? object.prevSelectable : object.selectable;
        });
        canvas.defaultCursor = 'default';
        canvas.off('mouse:up');
        canvas.off('mouse:down');
        canvas.off('mouse:move');

        // Restore selection ability on the canvas
        canvas.selection = true;
    }
});

selectFamily.onchange = function () {
    loadAndUse(this.value)
}

//TODO: Se puede optimizar en una function con un switch-case.
//NOTE: https://stackoverflow.com/questions/47408816/object-alignment-in-fabric-js

alignTopHeight.addEventListener('click', (e) => {
    const object = canvas.getActiveObject();

    if (object.type === 'activeSelection') {
        let height = object.getBoundingRect(true).height;
        let objects = canvas.getActiveObjects();

        objects.forEach(element => {

            element.set({
                top: (-height / 2),
            });

        })
        canvas.renderAll();
    }
})

alignCenterHeight.addEventListener('click', (e) => {

    const object = canvas.getActiveObject();

    if (object.type === 'activeSelection') {
        let objects = canvas.getActiveObjects();

        objects.forEach(element => {
            let itemHeight = element.getBoundingRect(true).height
            element.set({
                top: (0 - itemHeight / 2),
            });

        })
        canvas.renderAll();
    }
})

alignBottomHeight.addEventListener('click', (e) => {
    const object = canvas.getActiveObject();

    if (object.type === 'activeSelection') {
        let height = object.getBoundingRect(true).height;
        let objects = canvas.getActiveObjects();

        objects.forEach(element => {
            let itemHeight = element.getBoundingRect(true).height
            element.set({
                top: (height / 2 - itemHeight),
            });
        })
        canvas.renderAll();
    }
})





alignLeft.addEventListener('click', (e) => {
    console.log("ALIGN LEFT");
    const object = canvas.getActiveObject();

    if (object.type === 'activeSelection') {
        let width = object.getBoundingRect(true).width;
        let objects = canvas.getActiveObjects();

        objects.forEach(element => {

            element.set({
                left: (-width / 2),
            });

        })
        canvas.renderAll();
    }
})
alignCenter.addEventListener('click', (e) => {
    console.log("ALIGN CENTER");
    const object = canvas.getActiveObject();

    if (object.type === 'activeSelection') {
        let width = object.getBoundingRect(true).width;
        let objects = canvas.getActiveObjects();

        objects.forEach(element => {
            let itemWidth = element.getBoundingRect(true).width;
            element.set({
                left: 0 - itemWidth / 2,
            });

        })
        canvas.renderAll();
    }
})
alignRight.addEventListener('click', (e) => {

    console.log("ALIGN RIGHT")
    const object = canvas.getActiveObject();

    if (object.type === 'activeSelection') {
        let width = object.getBoundingRect(true).width;
        let objects = canvas.getActiveObjects();

        objects.forEach(element => {
            let itemWidth = element.getBoundingRect(true).width;
            element.set({
                left: width / 2 - itemWidth,
            });

        })
        canvas.renderAll();
    }
})

fontSize.addEventListener('change', (e) => {
    const object = canvas.getActiveObject();
    const size = e.target.value;
    object.set({ fontSize: size });
    canvas.renderAll();
})

copyButton.addEventListener('click', (e) => {
    const object = canvas.getActiveObject();
    const customType = object.customType;

    object.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
            selectable: true,
        });
        if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject((obj) => {
                canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();

        } else {
            canvas.add(clonedObj);
        }
        canvas.setActiveObject(clonedObj);
        customText.style.display = '';
        customText.style.top = (clonedObj.top - 55 - 50) + 'px';
        canvas.requestRenderAll();
    }, ['customType']);
})

sendToFront.addEventListener('click', (e) => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    // canvas.bringToFront(object)
    canvas.bringForward(object)
    canvas.discardActiveObject();
    canvas.renderAll();

})

sendToBack.addEventListener('click', (e) => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    canvas.sendBackwards(object);
    canvas.discardActiveObject();
    canvas.renderAll();
})

function saveCanvasState() {
    if (!key) { return }

    // Clonar el estado actual del lienzo
    let canvasState = canvas.toDatalessJSON();

    // Agregar el estado a la pila
    canvas.history.push(canvasState);
    canvas.state = canvasState;
    // console.log("HISTORY", canvas.history)
    // console.log("STATE", canvas.state)
    // console.log("NEXT", canvas.next)
    // console.log("KEY", key)
    // Limpiar la pila de estados deshechos
    // canvas.next = [];
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


document.addEventListener('keydown', (e) => {
    //supr -> keyCode 46
    if (e.keyCode === 46) {
        if (!canvas.getActiveObject()) { return }
        if (canvas.getActiveObject().type !== 'activeSelection') {
            return canvas.remove(canvas.getActiveObject())
        } else {
            return deleteObjects(canvas.getActiveObject()._objects)
        }
    }
})



function loadAndUse(font) {
    canvas.getActiveObject().set("fontFamily", font);
    canvas.requestRenderAll();
}

function createGroup(objects = []) {
    const group = new fabric.Group(objects, {
        left: center.left - 120,
        top: center.top,
        originX: 'left',
        originY: 'top',
        width: 120,
    });

    return group;
}

function outlineGenerator(outline = null, txt = '', fontFamily = 'Times New Roman', fontSize = 50) {
    let shadowNumber = 1;
    let shadow = '';
    const result = [];

    if (outline) {
        shadowNumber = outline;
    }
    for (let i = shadowNumber; i >= -shadowNumber; i--) {
        for (let j = -shadowNumber; j <= shadowNumber; j++) {
            if (i === 0 && j === 0) {
                continue;
            }

            shadow = (i + "px " + j + 'px 0 #fff');
            let text = createDate(txt, shadow, fontFamily, fontSize);
            result.push(text);
        }

    }
    return result;
}

function createDate(text = '01/01/2000', shadow = '', fontFamily = 'Times New Roman', fontSize = 50) {

    return new fabric.IText(text, {
        left: center.left - 120,
        top: center.top,
        width: 120,
        fontFamily: fontFamily,
        fill: 'black',
        stroke: 'red',
        strokeWidth: 3,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        //shadow: shadow,
        customType: 'datebox',

        fontSize: fontSize,

        scaleX: 0.85,
        scaleY: 0.85,

        editable: true,
        backgroundColor: 'transparent',

    });
}

function addCircles() {
    var circle = new fabric.Circle({
        radius: 50,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 3,
        backgroundColor: 'transparent'
    });
    var circle2 = new fabric.Circle({
        radius: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 3,
        backgroundColor: 'transparent'
    });
    var circle3 = new fabric.Circle({
        radius: 50,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 3,
        backgroundColor: 'transparent'
    });

    canvas.add(circle);
    canvas.add(circle2);
    canvas.add(circle3);
}