const canvas = new fabric.Canvas('canvas');
const canvasContainer = document.getElementById('canvas-container');


(function init() {
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

    // fabric.Canvas.prototype.isRedoing = false;

    /* canvas.add(new fabric.Image(oso, {
        left: 0,
        top: 0,
        angle: 0,
        backgroundColor: 'transparent',
    })); */

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

    const stroke = new fabric.IText('NICOLAS', {
        left: 50,
        top: 50,
        fill: 'red',

        stroke: 'red',
        strokeLineJoin: 'round',
        strokeWidth: 7,
        strokeUniform: true,

        fontSize: 70,

    });

    //TODO: actualizar estado (undo redo functions -> getState() )

    /* canvas.add(stroke)
    canvas.add(text) */
})();
