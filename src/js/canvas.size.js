window.onload = function onloadSizeCanvas() {

    const containerWidth = (canvasContainer.clientWidth) - 20; //width container-canvas 
    const containerHeigt = (canvasContainer.clientHeight) - 20; //height container-canvas 

    canvas.setDimensions({ width: containerWidth, height: containerHeigt });
}

window.onresize = function resizeCanvas() {

    const containerWidth = (canvasContainer.clientWidth) - 20; //width container-canvas 
    const containerHeigt = (canvasContainer.clientHeight) - 20; //height container-canvas 
    /*
                // const scale = containerWidth / canvas.width;
                // const zoom = canvas.getZoom() * scale;
                //canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
    */
    canvas.setDimensions({ width: containerWidth, height: containerHeigt });
}