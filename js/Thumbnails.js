const Thumbnails = class {
  #thumbnailsContainer;
  #thumbnailsContent;
  #events = {
    imageClick: null
  }
  thumbnails = [];
  constructor({element, urls = [], elementsAs = 'img'}, options = {}){
    if (element == undefined) {
      throw new ReferenceError("The element missing!");
    } else if (urls.length == 0) {
      throw new Error("The list of urls is empty");
    }
    this.element = element;
    this.elementsAs = elementsAs.toLowerCase();
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
    this.#thumbnailsContent = document.createElement("DIV");
    this.#thumbnailsContent.className += "thumbnails-content";

    if (this.elementsAs == "div") {
      for (let i = 0; i < this.urls.length; i++) {
        const thumbnails = document.createElement("div");
        thumbnails.className += "thumbnails";
        thumbnails.style.backgroundImage = `url(${this.urls[i]})`;

        thumbnails.addEventListener('click', (ev) => {
          if (typeof this.#events.imageClick == 'function') {
            this.#events.imageClick(ev, this.urls[i]);
          }
        });
        this.#thumbnailsContent.append(thumbnails);
        this.thumbnails.push(thumbnails);
      }

      this.#thumbnailsContainer.append(this.#thumbnailsContent);
      this.element.prepend(this.#thumbnailsContainer);
    } else if (this.elementsAs == "img") {
      for (let i = 0; i < this.urls.length; i++) {
        const thumbnails = document.createElement("img");
        thumbnails.className += "thumbnails-img";
        thumbnails.setAttribute("src", this.urls[i]);
        thumbnails.setAttribute("loading", "lazy");

        thumbnails.addEventListener('click', (ev) => {
          if (typeof this.#events.imageClick == 'function') {
            ev.index = i;
            this.#events.imageClick(ev, this.urls[i]);
          }
        });
        this.#thumbnailsContent.append(thumbnails);
        this.thumbnails.push(thumbnails);

      }
      
      this.#thumbnailsContainer.append(this.#thumbnailsContent);
      this.element.prepend(this.#thumbnailsContainer);
    } else {
      throw new Error("The created elements must be as 'div' or 'img'");
    }
  }
}