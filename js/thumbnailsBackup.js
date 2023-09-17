let Thumbnails = class {
  constructor(element, hrefs = [], options = {}) {
    if (element == undefined) {
      const referenceError = new ReferenceError("The element missing!");
      throw referenceError;
    } else if (hrefs.length == 0) {
      const referenceError = new Error("The list of hrefs is empty");
      throw referenceError;
    }

    this.element = element;
    this.hrefs = hrefs;
    this.#defaultOptions.instance = this;
    Object.defineProperties(this.options = {}, Object.getOwnPropertyDescriptors(this.#defaultOptions));
    Object.defineProperties(this.options, Object.getOwnPropertyDescriptors(options));

    if (options.on) {
      const eventKeys = Object.keys(this.#events);
      const onKeys = Object.keys(this.options.on);
      for (let i = 0; i < eventKeys.length; i++) {
        for (let j = 0; j < onKeys.length; j++) {
          if (eventKeys[i] == onKeys[j]) {
            console.log("==", eventKeys[i]);
            Object.defineProperties(this.#events, Object.getOwnPropertyDescriptors(options.on));
          }
        }
      }
      delete this.options.on;
    }
  }

  #size = 90;
  #hoverSize = 250;
  #isHover = true;
  #thumbnailsHoverContainer;
  #thumbnailsContainer;
  #events = {
    imageClick: null
  }
  #defaultOptions = {
    get isHover() {
      return this.instance.#isHover;
    },

    set isHover(value) {
      if (value === true || value === false) {
        this.instance.#isHover = value;
        if (value) {
          this.instance.#thumbnailsHoverContainer.style.display = "";
        } else {
          this.instance.#thumbnailsHoverContainer.style.display = "none";
          for (img of this.instance.#thumbnailsHoverContainer.children) {
            img.style.display = "none";
          }
        }
      } else {
        console.log(`The value ${value} must be boolean. (true,false)`)
      }
    },

    get size() {
      console.log("get size")
      return this.instance.#size;
    },

    set size(value) {
      let lenght = this.instance.#thumbnailsContainer.children.length;
      for (let i = 0; i < lenght; i++) {
        this.instance.#thumbnailsContainer.children[i].style.setProperty('--size', value + 'px');
        this.instance.#thumbnailsHoverContainer.children[i].style.setProperty('--size', value + 'px');
      }
      console.log("set size")
      this.instance.#size = value;
    },

    get hoverSize() {
      return this.instance.#hoverSize;
    },

    set hoverSize(value) {
      let lenght = this.instance.#thumbnailsContainer.children.length;
      for (let i = 0; i < lenght; i++) {
        this.instance.#thumbnailsHoverContainer.children[i].style.setProperty('--sizeHover', value + 'px');
      }
      this.instance.#hoverSize = value;
    }
  }

  create() {
    this.#thumbnailsHoverContainer = document.createElement("DIV");
    this.#thumbnailsContainer = document.createElement("DIV");
    this.#thumbnailsContainer.className += "thumbnails-container";
    this.#thumbnailsHoverContainer.className += "thumbnails-hover-container"

    for (let i = 0; i < this.hrefs.length; i++) {
      let thumbnailsHover = document.createElement("img");
      thumbnailsHover.className += "thumbnails-hover";
      thumbnailsHover.src = this.hrefs[i];
      thumbnailsHover.addEventListener('click', (ev) => {
        console.log("click on hover");
        this.#runEvent(this.#events.imageClick, {
          event: ev,
          href: this.hrefs[i]
        });
      });

      let currentThumbnails;
      thumbnailsHover.addEventListener('mouseenter', (ev) => {
        if (this.options.isHover) {
          let lastTop = this.offset(currentThumbnails).top - this.options.hoverSize / 2 + this.options.size / 2; // top - half hovered image, + half default size
          let lastLeft = this.offset(currentThumbnails).left - this.options.hoverSize / 2 + this.options.size / 2; // top - half hovered image, + half default size
          
          console.log("lastTop", lastTop)
          // height
          if (lastTop + this.options.hoverSize > this.element.offsetHeight ) {
            lastTop = imageContainer.offsetHeight - this.options.hoverSize;
            thumbnailsHover.style.top = lastTop + "px";
            //
            // check left

          
            //thumbnailsHover.style.display = "block";

            //return;
          } else {
          thumbnailsHover.style.top = lastTop + "px";
          }
          // left 
          if (lastLeft + this.options.hoverSize > this.element.offsetWidth) {
            lastLeft = imageContainer.offsetWidth - this.options.hoverSize;
            thumbnailsHover.style.left = lastLeft + "px";

          } else {
          thumbnailsHover.style.left = lastLeft + "px";
          }
          
          if (lastTop < 0) {
            thumbnailsHover.style.top = "0px";
            //thumbnailsHover.style.display = "block";
            //return;
          }
          thumbnailsHover.style.display = "block";
        }
      });

      thumbnailsHover.addEventListener('mouseleave', (ev) => {
        if (this.options.isHover) {
          thumbnailsHover.style.top = this.offset(currentThumbnails).top + "px";
          thumbnailsHover.style.left = this.offset(currentThumbnails).left + "px";
          let endTransition = () => {
            thumbnailsHover.style.display = "none";
            thumbnailsHover.removeEventListener("transitionend", endTransition);
          }
          thumbnailsHover.addEventListener("transitionend", endTransition);
        }
      });
      this.#thumbnailsHoverContainer.appendChild(thumbnailsHover);

      let thumbnails = document.createElement("img");
      thumbnails.className += "thumbnails";
      thumbnails.src = this.hrefs[i];
      thumbnails.addEventListener('click', (ev) => {
        console.log("click on thubnails");
        this.#runEvent(this.#events.imageClick, {
          event: ev,
          href: this.hrefs[i]
        });
      });

      thumbnails.addEventListener('mouseenter', (ev) => {
        if (this.options.isHover) {
          currentThumbnails = thumbnails;
          thumbnailsHover.style.top = this.offset(thumbnails).top + "px";
          thumbnailsHover.style.left = this.offset(thumbnails).left + "px";
          thumbnailsHover.style.display = "block";
        }
      });
      this.#thumbnailsContainer.append(thumbnails);
    }
    this.element.prepend(this.#thumbnailsHoverContainer);
    this.element.prepend(this.#thumbnailsContainer);
  }

  destroy() {
    this.#thumbnailsContainer.remove();
    this.#thumbnailsHoverContainer.remove();
    console.log("Thumbnails removed");

  }

  #isFunction = (event) => {
    return typeof (event) == "function" ? true : false;
  }

  #runEvent(event, paramters) {
    if (this.#isFunction(event)) {
      event.call(paramters.event, paramters.event, paramters.href);
    } else {
      console.log(event + " should be function.");
    }
  }

  offset = element => {
    return {
      top: element.getBoundingClientRect().top,
      left: element.getBoundingClientRect().left
    }
  };
}