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
const alignElementsBtns = document.querySelectorAll('.align-svg');

const positionXInput = document.querySelector('#input-positionX');
const positionYInput = document.querySelector('#input-positionY');

const sizeWInput = document.querySelector('#input-sizeW');
const sizeHInput = document.querySelector('#input-sizeH');

//appearance
const changFontFamilyBtn = document.querySelector('#select-change-font')

const rotationInput = document.querySelector('#input-rotation');

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
changFontFamilyBtn.onchange = function () {
    loadAndUse(this.value);
    getDimensionsInCm();
    getAngle();
    getPosition()
}
function loadAndUse(font) {
    canvas.getActiveObject().set("fontFamily", font);
    canvas.requestRenderAll();
}




