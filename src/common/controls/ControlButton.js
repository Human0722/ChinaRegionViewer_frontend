import {Control} from "ol/control";

class ControlButton extends Control {
    constructor (options) {

        const button = document.createElement('button')
        button.innerText = 'hi'

        const div = document.createElement('div')
        div.className = 'mybutton ol-control'
        div.appendChild(button)


        super({
        element: div
        });

    }
}

export default ControlButton;