let OpenCloseAnim = class {
    constructor(element, className, hideElemet = false, onEndAnimaton) {
        this.element= element;
        this.className = className;
        this.hideElemet = hideElemet;
        this.onEndAnimaton = onEndAnimaton;

    }
    animate() {
        let endAnimaton = () => {
            console.log("endAnimaton")
            if (this.hideElemet) {
                this.element.style.display = "none";
            }
            this.element.removeEventListener("animationend", endAnimaton);
            this.element.classList.remove(this.className);
            if (this.onEndAnimaton != undefined) {
                console.log("onEndAnimation")
                this.onEndAnimaton();
            }
        }
        console.log("startAnimation");
        this.element.addEventListener("animationend", endAnimaton);
        this.element.className += " " + this.className;
    }
}