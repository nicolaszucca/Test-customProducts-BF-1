//HTML references 

const borderValue = document.querySelector('#border-value-input');
const deleteBorder = document.querySelector('#delete-border');


borderValue.addEventListener('input', e => {
    const object = canvas.getActiveObject();
    const valueOutline = parseInt(borderValue.value);

    // if()

    if (!object) { return }
    object.set({ value: valueOutline });


    if (object.type === 'group') {



        if (valueOutline === 0) {
            object.toActiveSelection();
            //remove outline obj
            canvas.remove(canvas.getActiveObject()._objects[0]);
            canvas.discardActiveObject()
            canvas.requestRenderAll();

        } else {

            const { top, left, width, height } = object;

            object.toActiveSelection();
            //remove outline obj
            canvas.remove(canvas.getActiveObject()._objects[0]);
            //get propperties of the original i-text
            const { text, fontFamily, fontSize, fontWeight, scaleX, scaleY } = canvas.getActiveObject()._objects[1];
            //remove original i-text
            canvas.remove(canvas.getActiveObject()._objects[1]);


            //create new obj with the new value for outline and create outline 
            const newObj = createCustomText(text, top, left, width, height, fontFamily, fontSize, fontWeight, scaleX, scaleY, valueOutline);
            createOutline(newObj)

            canvas.discardActiveObject()
            saveCanvasState()
            canvas.requestRenderAll();
        }
    }





    if (object.type === 'i-text') {

        createOutline(object)
        canvas.discardActiveObject();
        saveCanvasState()
    }
})

function createOutline(object) {

    object.clone((clonedObj) => {
        canvas.remove(object);

        clonedObj.set({
            left: object.left,
            top: object.top,
            evented: true,
            selectable: true,
            outlineProp: true,
            fill: 'white',
            editable: false,
            stroke: 'white',
            strokeLineJoin: 'round',
            strokeWidth: object.value,
            strokeUniform: true,

        });

        const group = new fabric.Group([clonedObj, object], { outlinebox: true, editable: false });

        //center objects in group
        group._objects.forEach(obj => {
            let itemWidth = obj.getBoundingRect(true).width;
            let itemHeight = obj.getBoundingRect(true).height
            //take each object inside the activeSelection 
            //and center them horizontally and vertically
            obj.set({ left: (0 - itemWidth / 2), top: (0 - itemHeight / 2), type: 'i-text' })
        })

        canvas.add(group);
        // canvas.setActiveObject(group);

        canvas.requestRenderAll();
        canvas.renderAll()

    }, ['customType', 'value']);
}


deleteBorder.addEventListener('click', e => {
    const object = canvas.getActiveObject();
    if (!object) { return }

    object.toActiveSelection();
    canvas.remove(canvas.getActiveObject()._objects[0])
    saveCanvasState()
    canvas.requestRenderAll();
    canvas.renderAll()
})