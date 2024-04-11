import {Control} from "ol/control";
import TileLayer from "ol/layer/Tile";
import {XYZ} from "ol/source";

class BaseMapSelector extends Control {

    constructor(map, updateBaseLayer) {
        const dict = [
            {
                key: 'ersi',
                value: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            },
            {
                key: 'openstreetmap',
                value: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            },
            {
                key: '高德影像图',
                value: 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
            }

        ];
        const selector = document.createElement('select');
        dict.forEach(item => {
            var htmlOptionElement = document.createElement('option');
            htmlOptionElement.value = item.value;
            htmlOptionElement.text = item.key;
            selector.appendChild(htmlOptionElement);
        });
        let optionValue;
        selector.addEventListener('change', function() {
            let baseLayer = map.getLayers().item(0)
            map.removeLayer(baseLayer);
            optionValue = this.value
            const newBaseLayer = new TileLayer({
                source: new XYZ({
                    url: optionValue,
                    crossOrigin: 'Anonymous'
                })
            });
            map.getLayers().insertAt(0, newBaseLayer)
            updateBaseLayer(newBaseLayer)
        });
        const labelElement = document.createElement("label");
        labelElement.textContent = '切换底图: ';

        const element = document.createElement('div');
        element.style.backgroundColor = 'white';
        element.appendChild(labelElement);
        element.appendChild(selector);
        super({
            element: element
        });
    }

}

export default BaseMapSelector;