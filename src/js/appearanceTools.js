/*
*
*   Tools right canvas (appearance):
*
*   [alignLeft,alignCenter, alignRight, alignTop, alignMiddle, alignBottom],
*   show: [positionX, positionY],
*   show: [sizeX, sizeY],
*   show: [angle]
*
*/

//HTML REFERENCES: 

const positionXInput = document.querySelector('#input-positionX');
const positionYInput = document.querySelector('#input-positionY');

const sizeWInput = document.querySelector('#input-sizeW');
const sizeHInput = document.querySelector('#input-sizeH');

const rotationInput = document.querySelector('#input-rotation');



const alignElementsBtns = document.querySelectorAll('.align-svg');

//appearance
const changeFontFamilyBtn = document.querySelector('#select-change-font');
const changfontWeightBtn = document.querySelector('#type-font');
const changfontSizetBtn = document.querySelector('#size-font');


const textBoldBtn = document.querySelector('#text-bold');
const textItalicBtn = document.querySelector('#text-italic');
const textUnderlineBtn = document.querySelector('#text-underline');
const textStrikethroughBtn = document.querySelector('#text-strikethrough');
let isBold = false;
let isItalic = false;
let isUnderline = false;
let isStrikethrough = false;


const textAlignLeftBtn = document.querySelector('#text-align-left');
const textAlignCenterBtn = document.querySelector('#text-align-center');
const textAlignRightBtn = document.querySelector('#text-align-right');
const textAlignJustifyBtn = document.querySelector('#text-align-justify');



sizeWInput.addEventListener('change', e => {
    e.preventDefault();
    const object = canvas.getActiveObject();
    if (!object) { return }

    const value = ((e.target.value * 96 / 2.54) / object.scaleX);

    object.set({ width: value });
    canvas.requestRenderAll();
})

sizeHInput.addEventListener('change', e => {
    e.preventDefault();
    const object = canvas.getActiveObject();
    if (!object) { return }

    const value = ((e.target.value * 96 / 2.54) / object.scaleY);


    object.set({ height: value });

    canvas.requestRenderAll();
})

rotationInput.addEventListener('change', e => {
    e.preventDefault();
    const object = canvas.getActiveObject();
    if (!object) { return }

    const value = parseInt(e.target.value);

    object.rotate(value);
    canvas.renderAll();
})


//Get all elements and loop through them adding event listeners
alignElementsBtns.forEach(element => {
    element.addEventListener('click', function getAction() {

        const action = this.getAttribute('data-action')
        const object = canvas.getActiveObject();

        if (action == '' || action === null) { return }
        if (!object) { return }

        const validActions = ['left', 'center', 'right', 'top', 'middle', 'bottom'];
        if (!validActions.includes(action)) { return }

        if (object.type === 'activeSelection') {
            //Take all the elements in the event that several are being selected
            //Get the respective propperties of height and width 
            let height = object.getBoundingRect(true).height;
            let width = object.getBoundingRect(true).width;
            let objects = canvas.getActiveObjects();

            //Go through all the objects and according to the verified action 
            //I set the values top and left
            objects.forEach(element => {
                switch (action) {
                    case 'left': {
                        element.set({
                            left: (-width / 2),
                        });
                        break;
                    }
                    case 'center': {
                        let itemWidth = element.getBoundingRect(true).width;
                        element.set({
                            left: 0 - itemWidth / 2,
                        });
                        break;
                    }
                    case 'right': {
                        let itemWidth = element.getBoundingRect(true).width;
                        element.set({
                            left: width / 2 - itemWidth,
                        });
                        break;
                    }
                    case 'top': {
                        element.set({
                            top: (-height / 2),
                        });
                        break;
                    }
                    case 'middle': {
                        let itemHeight = element.getBoundingRect(true).height
                        element.set({
                            top: (0 - itemHeight / 2),
                        });
                        break;
                    }
                    case 'bottom': {
                        let itemHeight = element.getBoundingRect(true).height
                        element.set({
                            top: (height / 2 - itemHeight),
                        });
                        break;
                    }
                    default:
                        break;
                }
            })

            //If not "activeSelection" ...
            //I take the action and the selected element
            //and set its left and top values to move the object 
            //to the canvas limits and center
        } else {
            switch (action) {
                case 'left': {
                    object.set('left', 0);
                    break;
                }
                case 'center': {
                    canvas.centerObjectH(object);
                    break;
                }
                case 'right': {
                    object.set('left', (canvas.width - object.getScaledWidth()));
                    break;
                }
                case 'top': {
                    object.set('top', 0);
                    break;
                }
                case 'middle': {
                    canvas.centerObjectV(object);
                    break;
                }
                case 'bottom': {
                    object.set('top', (canvas.height - object.getScaledHeight()));
                    break;
                }
                default:
                    break;
            }
        }
        canvas.renderAll();
    })
})





/* change font-family */
changeFontFamilyBtn.onchange = function () {
    const action = this.getAttribute('data-action')
    loadAndUse(action, this.value);
}
/* change font-weight */
changfontWeightBtn.onchange = function () {
    const action = this.getAttribute('data-action')
    loadAndUse(action, this.value);

}
/* change font-size */
changfontSizetBtn.onchange = function () {
    const action = this.getAttribute('data-action')
    loadAndUse(action, this.value);

}
function loadAndUse(action, value) {

    const object = canvas.getActiveObject();
    if (!object) { return }

    switch (action) {
        case 'fontFamily': {
            object.set(action, value);
            break;
        }
        case 'fontWeight': {
            object.set(action, value);
            break;
        }
        case 'fontSize': {
            object.set(action, value);
            break;
        }
        default:
            break;
    }

    getDimensionsInCm();
    getAngle();
    getPosition()
    canvas.requestRenderAll();
}





/* decoration (bold, italic, underline, strikeThrough )*/
textBoldBtn.addEventListener('click', e => {
    isBold = !isBold;

    const object = canvas.getActiveObject();
    if (!object) { return }


    object.set('fontWeight', isBold ? 'bold' : 'normal');
    canvas.renderAll();

})
textItalicBtn.addEventListener('click', e => {
    isItalic = !isItalic;

    const object = canvas.getActiveObject();
    if (!object) { return }


    object.set('fontStyle', isItalic ? 'italic' : 'normal');
    canvas.renderAll();
})
textUnderlineBtn.addEventListener('click', e => {
    isUnderline = !isUnderline;

    const object = canvas.getActiveObject();
    if (!object) { return }


    object.set('underline', isUnderline ? true : false);
    canvas.renderAll();
})
textStrikethroughBtn.addEventListener('click', e => {
    isStrikethrough = !isStrikethrough;

    const object = canvas.getActiveObject();
    if (!object) { return }


    object.set('linethrough', isStrikethrough ? true : false);
    canvas.renderAll();
})





/* text alignment*/
textAlignLeftBtn.addEventListener('click', e => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    object.set('textAlign', 'left')
    canvas.renderAll()

})
textAlignCenterBtn.addEventListener('click', e => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    object.set('textAlign', 'center')
    canvas.renderAll()
})
textAlignRightBtn.addEventListener('click', e => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    object.set('textAlign', 'right')
    canvas.renderAll()
})
textAlignJustifyBtn.addEventListener('click', e => {
    const object = canvas.getActiveObject();

    if (!object) { return }

    object.set('textAlign', 'justify')
    canvas.renderAll()
})