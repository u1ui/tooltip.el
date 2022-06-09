
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

        //this.targets = document.querySelectorAll('aria-labeledby['+this.id+'], aria-describedby['+this.id+']');
    }

    disconnectedCallback() {
    }

    showFor(el){
        document.body.append(this);
        const rect = el.getBoundingClientRect();
        const elCenter = rect.left + rect.width / 2;
        this.style.display = 'block';
        this.style.left = elCenter - this.offsetWidth/2 + scrollX + 'px';
        this.style.top = rect.bottom + scrollY + 'px';
        this.style.transition = 'none';
        this.style.opacity = '0';
        clearTimeout(this._hideTimeout);
        setTimeout(()=>{ // Wait a moment, maybe the user is just running over for a moment
            this.style.opacity = '1';
            this.style.transition = ''; // transition back to normal
        },150);
    }
    hide(){
        this.style.opacity = '0';
        clearTimeout(this._hideTimeout);
        this._hideTimeout = setTimeout(()=>{
            this.style.display = 'none';
        },1000);
    }


});

addEventListener('mouseenter',checkOn,true);
addEventListener('focusin',checkOn,true);
addEventListener('mouseleave',checkOff,true);
addEventListener('focusout',checkOff,true);

function checkOn(e){
    const tooltip = getTooltipForElement(e.target);
    if (!tooltip) return;
    //console.log('enter', tooltip)
    tooltip.showFor(e.target);
}
function checkOff(e){
    const tooltip = getTooltipForElement(e.target);
    if (!tooltip) return;
    //console.log('leave', tooltip)
    tooltip.hide();
}


function getTooltipForElement(el) {
    const id = el.getAttribute('aria-labeledby') || el.getAttribute('aria-describedby');
    if (!id) return;
    const tooltip = document.getElementById(id);
    if (!tooltip || tooltip.tagName !== 'U1-TOOLTIP') return;
    return tooltip;
}
