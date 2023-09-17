const ZoomElement = class {
  #x = 0;
  #y = 0;
  #startX = 0;
  #startY = 0;
  #prevX = 0;
  #prevY = 0;
  #deg = 0;
  #scale = 0;
  constructor(element) {
    this.element = element;
    this.translateX = 0;
    this.translateY = 0;
    this.scale = 1;
    this.maxScale = 5;
    this.minScale = 1;
    this.object = this;
    this.delay = new DelayLastEvent({ delay: 50 });
    this.element.addEventListener("mouseup", this.mouseup.bind(this.object));
    this.element.addEventListener("mousedown", this.mousedown.bind(this.object));
    this.element.addEventListener("wheel", this.wheel.bind(this.object));
  }

  get x() {
    return this.#x
  }
  set x(x) {
    this.#x = Math.round((x - this.#startX)/ this.scale) + this.#prevX;
  }

  get y() {
    return this.#y;
  }
  set y(y) {
    this.#y = Math.round((y - this.#startY)/ this.scale) + this.#prevY;

  }

  set scale(value) {
    if (value != this.#scale) {
      this.#scale = Number(value.toFixed(2));
      //call scale event

      this.#transform({scale: value})
      this.#onscaleFunc.forEach(func => {
        func({
          scale: {
            value: value,
            min: this.minScale,
            max: this.maxScale
          }
        });
      });
    }
  }
  get scale() {
    return this.#scale;
  }
  #onscaleFunc = [];
  onscale(func){
    this.#onscaleFunc.push(func);
  }
  removeEv = () => {
    console.log("ev removed");
    this.element.removeEventListener("mouseleave", this.mouseleave);
    this.element.removeEventListener("mousemove", this.mousemove);
  }
  mousedown = (event) => {
    if (event.button != 0) { return; }
    console.log("previous element x y", this.#x, this.#y);
    this.element.style.transition = "";

    this.#prevX = this.#x;
    this.#prevY = this.#y;

    this.#startX = event.x;
    this.#startY = event.y;

    this.x = event.x;
    this.y = event.y;

    console.log("event x y", event.x, event.y);
    console.log("start x y", this.#startX, this.#startY);
    console.log("down, element now x y", this.x, this.y);

    this.element.addEventListener("mouseleave", this.mouseleave);
    this.element.addEventListener("mousemove", this.mousemove);
    this.#transform();

  }
  mousemove = (event) => {
    event.preventDefault();
    this.x = event.x;
    this.y = event.y;

    console.log("move, element now", this.x, this.y);

    this.#transform();

  }
  mouseup = (event) => {
    console.log("mouseup");
    this.removeEv();
    this.x = event.x;
    this.y = event.y;
    this.#transform();

  }
  mouseleave = (event) => {
    console.log("mouseleave");
    this.removeEv();
    // this.x = event.x;// - this.x;
    // this.y = event.y;// - this.y;
  }
  wheel = (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.scale += 0.1;
      if (this.scale > this.maxScale) {
        this.scale = this.maxScale;
      }
      //this.#transform();
    } else {
      this.scale -= 0.1;
      if (this.scale <= this.minScale) {
        this.scale = this.minScale;
        this.#x = 0;
        this.#y = 0;
        this.#startX = 0;
        this.#startY = 0;
        return;
      }
      //this.#transform();
    }
  }
  #transform(event = {}) {
    if (event.scale) {
      const transitionEnd = () => {
        this.element.style.transition = "";
        this.element.removeEventListener('transitionend', transitionEnd);
      }
      this.element.removeEventListener('transitionend', transitionEnd);

      this.element.addEventListener('transitionend', transitionEnd);
      this.element.style.transition = "250ms";
    }
    if (event.rotate) {
      const transitionEnd = () => {
        this.element.style.transition = "";
        this.element.removeEventListener('transitionend', transitionEnd);
      }
      // need remove event if  
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
  set rotate(deg = 0 ) {
    this.#deg = deg;
    this.#transform({rotate: deg});
  }
  get rotate() { return this.#deg; }
}


const DelayLastEvent = class {
  #timeoutId;
  constructor({ func, delay = 1000 } = {}, execNow = false) {
    this.func = func;
    this.delay = delay;
    if (typeof func == 'function') {
      if (execNow) this.exec();
      //this.run();
    }
  }
  run(func = this.func, delay = this.delay) {
    clearTimeout(this.#timeoutId);
    this.#timeoutId = setTimeout(() => {
      console.log('delayed exec');
      func();
    }, delay);
  }
  exec() {
    clearTimeout(this.#timeoutId);
    this.func();
    console.log('Exec now');
  }
  stop() {
    console.log('execution stopped');
    clearTimeout(this.#timeoutId);
  }
};

//JsOnload.addOnload();
console.log("ZoomElement Ready");

FileReady.on("ZoomElement", true);