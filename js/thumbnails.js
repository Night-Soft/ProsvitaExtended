const Thumbnails = class {
  #thumbnailsContainer;
  #events = {
    imageClick: null
  }
  constructor(element, urls = [], options = {}){
    if (element == undefined) {
      const referenceError = new ReferenceError("The element missing!");
      throw referenceError;
    } else if (urls.length == 0) {
      const referenceError = new Error("The list of urls is empty");
      throw referenceError;
    }

    this.element = element;
    this.urls = urls;
    
    const existingEvents = [];
    for (const key in this.#events) {
      if (options.hasOwnProperty(key)) {
        if (typeof options[key] == "function") {
          existingEvents.push(key);
        }
      }
    }
    for (const event of existingEvents) {
      Object.defineProperty(this.#events, event, Object.getOwnPropertyDescriptor(options, event));
    }

  }
  create(){
    this.#thumbnailsContainer = document.createElement("DIV");
    this.#thumbnailsContainer.className += "thumbnails-container";

    for (let i = 0; i < this.urls.length; i++) {

      let thumbnails = document.createElement("div");
      thumbnails.className += "thumbnails";
      thumbnails.style.backgroundImage = `url(${this.urls[i]})`;
      thumbnails.addEventListener('click', (ev) => {
        if (typeof this.#events.imageClick == 'function') {
          this.#events.imageClick(ev, this.urls[i]);
        }
      });
      this.#thumbnailsContainer.append(thumbnails);
    }
    this.element.prepend(this.#thumbnailsContainer);
  }
}

console.log("thumbnails load")