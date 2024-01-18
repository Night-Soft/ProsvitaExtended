const ZoomElement = class {
  #x = 0;
  #y = 0;
  #startX = 0;
  #startY = 0;
  #prevX = 0;
  #prevY = 0;
  #deg = 0;
  #onscale;
  constructor(element) {
    let scaleValue = 1, max = 5, min = 1;
    this.scale = {}
    Object.defineProperties(this.scale, {
      value: {
        get() { return scaleValue; },
        set: (value) => {
          if (isFinite(value) === false) throw new TypeError(`The '${value}' must be number`);
          if (value < 1) throw new Error(`The '${value}' less than 1`);
          if (value > max) throw new Error(`The '${value}' greather than max ${max}`);
          if (value != scaleValue) {
            scaleValue = Number(value.toFixed(2));
            this.#transform({ scale: value });

            //call scale event
            if (typeof this.#onscale === 'function') {
              this.#onscale({ value: scaleValue, min, max });
            }
          }
          scaleValue = value;
        }
      },
      min: {
        get() { return min; },
        set(value) {
          if (isFinite(value) === false) throw new TypeError(`The '${value}' must be number`);
          if (value < 1) throw new Error(`The '${value}' less than 1`);
          min = value;
        }
      },
      max: {
        get() { return max; },
        set(value) {
          if (isFinite(value) === false) throw new TypeError(`The '${value}' must be number`);
          max = value;
        }
      },
    });
    Object.defineProperty(this, "scale", { writable: false });
    this.element = element;
    this.object = this;
    this.element.addEventListener("mouseup", this.mouseup.bind(this.object));
    this.element.addEventListener("mousedown", this.mousedown.bind(this.object));
    this.element.addEventListener("wheel", this.wheel.bind(this.object));
  }

  get x() {
    return this.#x
  }
  set x(x) {
    this.#x = Math.round((x - this.#startX) / this.scale.value) + this.#prevX;
  }

  get y() {
    return this.#y;
  }
  set y(y) {
    this.#y = Math.round((y - this.#startY) / this.scale.value) + this.#prevY;

  }

  get onscale() { return this.#onscale; }
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
      if (this.scale.value + 0.1 >= this.scale.max) {
        this.scale.value = this.scale.max;
        return;
      }
      this.scale.value += 0.1;
    } else {
      if (this.scale.value - 0.1 <= this.scale.min) {
        this.scale.value = this.scale.min;
        this.#x = 0;
        this.#y = 0;
        this.#startX = 0;
        this.#startY = 0;
        return;
      }
      this.scale.value -= 0.1;
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
      `scale(${this.scale.value}) translate(${this.x}px, ${this.y}px) rotate(${this.#deg}deg)`;
  }
  clear() {
    this.#x = 0;
    this.#y = 0;
    this.#startX = 0;
    this.#startY = 0;
    this.#deg = 0;
    this.scale.value = 1;
    this.element.style.transform = "";
    this.removeEv();
  }
  reinit() {}
}