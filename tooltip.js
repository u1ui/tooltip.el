//import {Placer} from 'https://cdn.jsdelivr.net/gh/u1ui/Placer.js@3.6.0/Placer.js';
import {Placer} from '../Placer.js@3.6.0/Placer.js';

let idCounter = 0;

customElements.define('u1-tooltip', class extends HTMLElement {
    constructor() {
        super();
        this.placer = new Placer(this, {
            x:'center',
            y:'after',
            margin:20,
        });
    }
    connectedCallback() {
        if (!this.id) { // if no id is set, set one an make it the tooltip for its parent
            this.id = 'u1-tooltip-' + idCounter++;
            this.parentNode.setAttribute('aria-labelledby', this.id);
        }
        const rootEl = document.body;
        this.parentNode !== rootEl && rootEl.append(this);
    }
    static get observedAttributes() {
        return ['position'];
    }
    attributeChangedCallback(name, oldValue, value) {
        if (name === 'position') {
            if (value === 'top')    this.placer.setOptions({y:'before',x:'center'});
            if (value === 'bottom') this.placer.setOptions({y:'after',x:'center'});
            if (value === 'left')   this.placer.setOptions({y:'center',x:'before'});
            if (value === 'right')  this.placer.setOptions({y:'center',x:'after'});
        }
    }

    _showFor(el){
        let event = new CustomEvent('u1-tooltip-show', {bubbles: true, cancelable: true, detail: {tooltip: this} });
        el.dispatchEvent(event);
        if (event.defaultPrevented) return;

        let sEvent = new CustomEvent('u1-show', {bubbles: true, cancelable: true, detail: {target: el} });
        this.dispatchEvent(sEvent);
        if (event.defaultPrevented) return;

        return this.showFor(el);
    }
    showFor(el){
        this.setAttribute('open','');
        this.placer.toElement(el); // todo z-index top
        this.setAttribute(':position-x', this.placer.positionX);
        this.setAttribute(':position-y', this.placer.positionY);
    }
    hide(){
        this.removeAttribute('open');
        //this.placer.unfollow();
    }
});


document.addEventListener('mouseenter',checkOn,true); // on document: chrome
addEventListener('focusin',checkOn,true);
document.addEventListener('mouseleave',checkOff,true);
addEventListener('focusout',checkOff,true);

function checkOn(e){
    const tooltip = getTooltipForElement(e.target); // todo: safari>13.3 optional chaining
    tooltip && tooltip._showFor(e.target);
}
function checkOff(e){
    const tooltip = getTooltipForElement(e.target); // todo: safari>13.3 optional chaining
    tooltip && tooltip.hide();
}

function getTooltipForElement(el) {
    if (!el.getAttribute) return; // if document
    const id = el.getAttribute('aria-labelledby') || el.getAttribute('aria-describedby');
    if (!id) return;
    const tooltip = document.getElementById(id);
    if (!tooltip || tooltip.tagName !== 'U1-TOOLTIP') return;
    return tooltip;
}
