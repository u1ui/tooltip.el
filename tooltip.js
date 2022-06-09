
let idCounter = 0;

customElements.define('u1-tooltip', class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        if (!this.id) { // if no id is set, set one an make it the tooltip for its parent
            this.id = 'u1-tooltip-' + idCounter++;
            this.parentNode.setAttribute('aria-labeledby', this.id);
        }

        const rootEl = document.body;
        this.parentNode !== rootEl && rootEl.append(this);
    }
    showFor(el){

        let event = new CustomEvent('u1-tooltip-show', {
            bubbles: true,
            cancelable: true,
            detail: {for: el}
        });
        this.dispatchEvent(event);
        if (event.defaultPrevented) return;

        this.style.willChange = 'opacity, visibility';
        this.setAttribute('open','');

        // bottom
        // todo z-index top
        this.style.marginLeft = '0';
        this.style.marginRight = '0';
        this.style.marginBottom = '0';
        const rect = el.getBoundingClientRect();
        const elCenter = rect.left + rect.width / 2;
        this.style.left = elCenter - this.offsetWidth/2 + scrollX + 'px';
        this.style.top  = rect.bottom + scrollY + 'px';
    }
    hide(){
        this.removeAttribute('open');
    }
});


document.addEventListener('mouseenter',checkOn,true); // on document: chrome
addEventListener('focusin',checkOn,true);
document.addEventListener('mouseleave',checkOff,true);
addEventListener('focusout',checkOff,true);

function checkOn(e){
    getTooltipForElement(e.target)?.showFor(e.target);
    // const tooltip = getTooltipForElement(e.target);
    // if (!tooltip) return;
    // tooltip.showFor(e.target);
}
function checkOff(e){
    getTooltipForElement(e.target)?.hide();
    // const tooltip = getTooltipForElement(e.target);
    // if (!tooltip) return;
    // tooltip.hide();
}

function getTooltipForElement(el) {
    const id = el.getAttribute('aria-labeledby') || el.getAttribute('aria-describedby');
    if (!id) return;
    const tooltip = document.getElementById(id);
    if (!tooltip || tooltip.tagName !== 'U1-TOOLTIP') return;
    return tooltip;
}
