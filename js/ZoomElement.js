const ZoomElement = class {
  #x = 0;
  #y = 0;
  #startX = 0;
  #startY = 0;
  #prevX = 0;
  #prevY = 0;
  #deg = 0;
  #scale = 0;
  #onscale;
  constructor(element) {
    this.element = element;
    this.scale = 1;
    this.maxScale = 5;
    this.minScale = 1;
    this.object = this;
    this.element.addEventListener("mouseup", this.mouseup.bind(this.object));
    this.element.addEventListener("mousedown", this.mousedown.bind(this.object));
    this.element.addEventListener("wheel", this.wheel.bind(this.object));
  }

  get x() {
    return this.#x
  }
  set x(x) {
    this.#x = Math.round((x - this.#startX) / this.scale) + this.#prevX;
  }

  get y() {
    return this.#y;
  }
  set y(y) {
    this.#y = Math.round((y - this.#startY) / this.scale) + this.#prevY;

  }

  get scale() {
    return this.#scale;
  }
  set scale(value) {
    if (value != this.#scale) {
      this.#scale = Number(value.toFixed(2));
      this.#transform({ scale: value });

      //call scale event
      if (typeof this.#onscale === 'function') {
        this.#onscale({
          scale: {
            value: value,
            min: this.minScale,
            max: this.maxScale
          }
        });
      }
    }
  }

  get onscale() {
    return this.#onscale;
  }
  set onscale(func) {
    if (typeof func === "function") {
      this.#onscale = func;
    } else {
      throw new Error("The onscale must be a function.");
    }
  }

  get rotate() { return this.#deg; }
  set rotate(deg = 0) {
    this.#deg = deg;
    this.#transform({ rotate: deg });
  }

  removeEv = () => {
    this.element.removeEventListener("mouseleave", this.mouseleave);
    this.element.removeEventListener("mousemove", this.mousemove);
  }
  mousedown = (event) => {
    event.preventDefault();
    if (event.button != 0) { return; }
    this.element.style.transition = "";

    this.#prevX = this.#x;
    this.#prevY = this.#y;

    this.#startX = event.x;
    this.#startY = event.y;

    this.x = event.x;
    this.y = event.y;

    this.element.addEventListener("mouseleave", this.mouseleave);
    this.element.addEventListener("mousemove", this.mousemove);
    this.#transform();

  }
  mousemove = (event) => {
    event.preventDefault();

    this.x = event.x;
    this.y = event.y;
    this.#transform();

  }
  mouseup = (event) => {
    this.removeEv();
    this.x = event.x;
    this.y = event.y;
    this.#transform();

  }
  mouseleave = (event) => {
    this.removeEv();
  }
  wheel = (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      if (this.scale + 0.1 >= this.maxScale) {
        this.scale = this.maxScale;
        return;
      }
      this.scale += 0.1;
    } else {
      if (this.scale - 0.1 <= this.minScale) {
        this.scale = this.minScale;
        this.#x = 0;
        this.#y = 0;
        this.#startX = 0;
        this.#startY = 0;
        return;
      }
      this.scale -= 0.1;
    }
  }
  #transform(event = {}) {
    if (event.scale != null) {
      const transitionEnd = () => {
        this.element.style.transition = "";
        this.element.removeEventListener('transitionend', transitionEnd);
      }
      this.element.removeEventListener('transitionend', transitionEnd);
      this.element.addEventListener('transitionend', transitionEnd);
      this.element.style.transition = "250ms";
    }
    if (event.rotate != null) {
      const transitionEnd = () => {
        this.element.style.transition = "";
        this.element.removeEventListener('transitionend', transitionEnd);
      }
      this.element.removeEventListener('transitionend', transitionEnd);

      this.element.addEventListener('transitionend', transitionEnd);
      this.element.style.transition = "450ms";
    }

    this.element.style.transform =
      `scale(${this.scale}) translate(${this.x}px, ${this.y}px) rotate(${this.#deg}deg)`;
  }
  clear() {
    this.#x = 0;
    this.#y = 0;
    this.#startX = 0;
    this.#startY = 0;
    this.#deg = 0;
    this.scale = 1;
    this.element.style.transform = "";
    this.removeEv();
  }
}