/* 
*
*   Tools above canvas:
*
*   TODO: en main[undo, redo],
*   [createText, insertImage],
*   [flipX, flipY, clone, rotateLeft, rotateRight],
*   [groupElements, ungroupElements],
*   [bringToFront, sendToBack] -> layer sistem,
*   [delete],
*
*/

//HTML REFERENCES:
const createTextBtn = document.querySelector('#create-text-icon');
const insertImageBtn = document.querySelector('#insert-image-icon');


const flipXBtn = document.querySelector('#flipX-icon');
const flipYBtn = document.querySelector('#flipY-icon');
const cloneBtn = document.querySelector('#clone-icon');
const rotateLeftIcon = document.querySelector('#rotate-left-icon');
const rotateRightIcon = document.querySelector('#rotate-right-icon');


const groupItemsBtn = document.querySelector('#group-icon');
const ungroupItemsBtn = document.querySelector('#ungroup-icon');


const bringToFrontIcon = document.querySelector('#bring-to-front-icon');
const sentToBackIcon = document.querySelector('#send-to-back-icon');


const deleteIcon = document.querySelector('#delete-icon');



/*CREATE TEXT BUTTON*/
createTextBtn.addEventListener('click', e => {
    const text = createText();
    canvas.add(text)
    canvas.setActiveObject(text);
})
/* 
*
*   To change lineheight, bgcolor or charSpacing 
*   of a word: 
*
*   set "lheight", "textBackgroundColor" or "charSp" 
*   keys in styles property with any value.
* 
*/
function createText(x = 75, y = 430, pos = 325) {

    return new fabric.IText('Nicolas', {
        left: 50,
        top: 50,
        customType: 'textbox',
        fontFamily: 'Times New Roman',
        fontSize: 20,
        editable: true,

        backgroundColor: 'transparent',

        styles: { //textBackgroundColor: '', fontSize: n, charSp: n, lheight: n
            0: {
                0: { lheight: 1, charSp: 10 },
                1: { lheight: 1, charSp: 10 },
                2: { lheight: 1, charSp: 10 },
                3: { lheight: 1, charSp: 25 },
                4: { lheight: 1, charSp: 34 },
                5: { textBackgroundColor: 'red', lheight: 1, charSp: 10 },
                6: { lheight: 1, charSp: 10 },
            },
        }
    })
}





/*INSERT IMAGE*/
insertImageBtn.addEventListener('click', openFileUpload)
function openFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // Manejar evento de carga de archivo
    fileInput.addEventListener('change', handleFileUpload);

    // Simular clic en el input de archivo para abrir el diálogo de carga
    fileInput.click();
}
function handleFileUpload(event) {
    const file = event.target.files[0];

    if (!file) { return }

    const reader = new FileReader();

    // Leer el archivo como URL de datos (base64)
    reader.readAsDataURL(file);

    // Cuando la lectura del archivo esté completa
    reader.onload = function (event) {
        const imageUrl = event.target.result;

        // Crear una nueva imagen en Fabric.js
        fabric.Image.fromURL(imageUrl, function (img) {
            // Escalar la imagen para ajustarla al canvas
            img.scaleToWidth(400);
            img.scaleToHeight(400);
            img.customType = 'imageBox'

            // Agregar la imagen al canvas
            //canvas.clear(); // Limpiar el canvas antes de agregar la nueva imagen
            canvas.add(img);
            canvas.renderAll();
        });

    }
}





/* FLIP X & FLIP Y OBJECTS*/
//TODO: saveCanvasState()
flipXBtn.addEventListener('click', e => {
    const object = canvas.getActiveObject();
    if (!object) { return console.log("no hay obj") }

    object.toggle('flipX');
    // saveCanvasState()
    canvas.renderAll();
})
flipYBtn.addEventListener('click', e => {
    const object = canvas.getActiveObject();
    if (!object) { return console.log("no hay obj") }

    object.toggle('flipY');
    // saveCanvasState()
    canvas.renderAll();
})





/* CLONE OBJ */
cloneBtn.addEventListener('click', e => {
    const object = canvas.getActiveObject();
    if (!object) { return }

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
        canvas.requestRenderAll();
    }, ['customType']);
})





/* ROTATE LEFT & ROTATE RIGHT*/
rotateLeftIcon.addEventListener('click', e => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    //Decrement the angle by 45 degrees
    let newAngle = object.angle == 355 ? 0 : object.angle - 45;

    if (newAngle === -360) {
        newAngle = 0;
    }

    object.rotate(newAngle)
    rotationInput.value = (newAngle).toFixed(0);
    canvas.renderAll();
})
rotateRightIcon.addEventListener('click', e => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    //Increment the angle by 45 degrees
    let newAngle = object.angle == 355 ? 0 : object.angle + 45;

    if (newAngle === 360) {
        newAngle = 0;
    }

    object.rotate(newAngle)
    rotationInput.value = (newAngle).toFixed(0);
    canvas.renderAll();
})





/* GROUP & UNGROUP ELEMENTS */
groupItemsBtn.addEventListener('click', e => {
    const object = canvas.getActiveObject()

    if (!object) {
        return;
    }
    if (object.type !== 'activeSelection') {
        return;
    }

    canvas.getActiveObject().toGroup();
})
ungroupItemsBtn.addEventListener('click', e => {
    const object = canvas.getActiveObject()

    if (!object) {
        return;
    }
    if (object.type !== 'group') {
        return;
    }
    object.toActiveSelection();
    canvas.requestRenderAll();
})





//TODO: bringToFront vs bringForward != functions?  
/* LAYER SISTEM (BRING TO FRONT & SEND TO BACK) BUTTONS */
bringToFrontIcon.addEventListener('click', e => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    // canvas.bringToFront(object)
    canvas.bringForward(object)
    canvas.discardActiveObject();
    canvas.renderAll();
})
sentToBackIcon.addEventListener('click', e => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    canvas.sendBackwards(object);
    canvas.discardActiveObject();
    canvas.renderAll();
})





/* DELETE ICON */
deleteIcon.addEventListener('click', e => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    if (object.type === "activeSelection") {
        return deleteObjects(object._objects);
    }

    return deleteObject(object);
})
function deleteObject(obj) {

    canvas.remove(obj)
    canvas.requestRenderAll();
}
function deleteObjects(objects) {

    objects.forEach(e => {
        canvas.remove(e);
        canvas.discardActiveObject();
        canvas.renderAll();
    })
}