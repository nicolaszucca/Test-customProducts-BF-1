const imagesContainer = Array.from(document.querySelectorAll('.card'));

imagesContainer.forEach(card => {
    card.addEventListener('dragstart', (e) => {
        const img = e.target.children[0];
        const imgSrc = e.target.children[0].src

        const dataList = e.dataTransfer;
        dataList.setData('text/html', imgSrc);
    })
})

canvasContainer.addEventListener('dragover', (e) => {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'copy'; // See the section on the DataTransfer object.
})


canvasContainer.addEventListener('drop', (e) => {
    // console.log("drop", e.dataTransfer)
    const image = e.dataTransfer.getData('text/html');

    fabric.Image.fromURL(image, function (img) {
        // Escalar la imagen para ajustarla al canvas
        img.scaleToWidth(400);
        img.scaleToHeight(400);
        img.customType = 'imageBox'

        // Agregar la imagen al canvas
        //canvas.clear(); // Limpiar el canvas antes de agregar la nueva imagen
        canvas.add(img);
        canvas.renderAll();
    });
})