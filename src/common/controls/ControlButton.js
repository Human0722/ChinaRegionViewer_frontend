import {Control} from "ol/control";

class ControlButton extends Control {
    constructor (map, getGeoJson) {

        const shp_button = document.createElement('button')
        shp_button.innerText = 'Shapefile下载'
        shp_button.disabled = true
        shp_button.style.backgroundColor = 'gray'
        shp_button.addEventListener('click', ()=> {
            let hash = window.location.hash
        })

        const gson_button = document.createElement('button')
        gson_button.innerText = 'GeoJSON下载'
        gson_button.addEventListener('click', ()=> {
            let geojson = JSON.stringify(getGeoJson())
            const blob = new Blob([geojson], { type: 'text/plain' }); // 将字符串封装成 Blob 对象
            const link = document.createElement('a');
            link.download = 'map.geojson'; // 设置下载的文件名
            link.href = URL.createObjectURL(blob); // 将 Blob 对象转换为临时链接
            link.click(); // 触发点击事件，开始下载文件
        })

        const png_button = document.createElement('button');
        png_button.innerText = 'PNG下载'
        png_button.addEventListener('click', ()=>{
            map.once('rendercomplete', function () {
                const mapCanvas = document.createElement('canvas');
                const size = map.getSize();
                mapCanvas.width = size[0];
                mapCanvas.height = size[1];
                const mapContext = mapCanvas.getContext('2d');
                Array.prototype.forEach.call(
                    map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
                    function (canvas) {
                        if (canvas.width > 0) {
                            const opacity =
                                canvas.parentNode.style.opacity || canvas.style.opacity;
                            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                            let matrix;
                            const transform = canvas.style.transform;
                            if (transform) {
                                // Get the transform parameters from the style's transform matrix
                                matrix = transform
                                    .match(/^matrix\(([^\(]*)\)$/)[1]
                                    .split(',')
                                    .map(Number);
                            } else {
                                matrix = [
                                    parseFloat(canvas.style.width) / canvas.width,
                                    0,
                                    0,
                                    parseFloat(canvas.style.height) / canvas.height,
                                    0,
                                    0,
                                ];
                            }
                            // Apply the transform to the export map context
                            CanvasRenderingContext2D.prototype.setTransform.apply(
                                mapContext,
                                matrix,
                            );
                            const backgroundColor = canvas.parentNode.style.backgroundColor;
                            if (backgroundColor) {
                                mapContext.fillStyle = backgroundColor;
                                mapContext.fillRect(0, 0, canvas.width, canvas.height);
                            }
                            mapContext.drawImage(canvas, 0, 0);
                        }
                    },
                );
                mapContext.globalAlpha = 1;
                mapContext.setTransform(1, 0, 0, 1, 0, 0);
                fetch(mapCanvas.toDataURL());
                var aTag = document.createElement('a');
                aTag.download = 'map.png';
                aTag.href = mapCanvas.toDataURL();
                aTag.click();
            });
            map.renderSync();
        })


        const div = document.createElement('div')
        div.appendChild(shp_button)
        div.appendChild(gson_button)
        div.appendChild(png_button)



        super({
        element: div
        });

    }
}

export default ControlButton;