let hwNodeList,
  viewerContainer,
  homeworkImage,
  timeOutId,
  getHwIntervalId,
  zoomElement,
  slider;

const ImageViewer = {
  thumbnails: undefined,
  isCreated: false,
  urls: [],
  _index: 0,
  get index() { return this._index; },
  set index(value) { this._index = value; },
  setImage(url, index) {
    const endTransition = () => {
      homeworkImage.style.transition = "0";
      homeworkImage.removeEventListener("transitionend", endTransition);
    }
    homeworkImage.removeEventListener("transitionend", endTransition);
    homeworkImage.addEventListener("transitionend", endTransition);

    homeworkImage.style.transition = "0.7s";
    homeworkImage.style.backgroundImage = `url(${url})`;

    this.thumbnails[this._index].classList.remove('thumbnails-active');
    this.thumbnails[index].classList.add('thumbnails-active');

    this.index = index;
  }
}

const toggleViewer = function (show = true, index = 0) {
  let openButton = document.querySelectorAll(".open-buttons")[index];
  const zoomControl = document.getElementsByClassName('zoom-control')[0];
  const thumbnailsContainer = document.getElementsByClassName('thumbnails-container')[0];
  let { width, height, left, top } = openButton.getBoundingClientRect();
  if (show) {
    const keyframe = {
      width: [width + 'px', 100 + '%'],
      height: [height + 'px', 100 + '%'],
      transform: ['translate(' + left + 'px, ' + top + 'px)', 'translate(0px, 0px)'],
      borderRadius: ['20px', '0px'],
      easing: ["cubic-bezier(0.37, 0, 0.63, 1)"]
    }
    const opacity = {
      opacity: [0, 1]
    }

    zoomControl.style.opacity = "0";
    thumbnailsContainer.style.opacity = "0";
    viewerContainer.style.overflow = "hidden";
    viewerContainer.style.display = "flex";

    homeworkImage.animate(opacity, { duration: 350 });
    const animation = viewerContainer.animate(keyframe, { duration: 700 });
    animation.onfinish = () => {
      viewerContainer.style.overflow = "";
      zoomControl.style.opacity = "1";
      thumbnailsContainer.style.opacity = "1";
      zoomControl.animate(opacity, { duration: 500 });
      thumbnailsContainer.animate(opacity, { duration: 500 });
    }
  } else {
    const keyframe = {
      width: [100 + '%', width + 'px'],
      height: [100 + '%', height + 'px'],
      transform: ['translate(0px, 0px)', 'translate(' + left + 'px, ' + top + 'px)'],
      borderRadius: ['0px', '20px'],
      easing: ["cubic-bezier(0.37, 0, 0.63, 1)"]

    }
    const opacity = {
      opacity: [1, 0]
    }

    zoomControl.animate(opacity, { duration: 200 });
    thumbnailsContainer.animate(opacity, { duration: 200 }).onfinish = () => {
      zoomControl.style.opacity = "0";
      thumbnailsContainer.style.opacity = "0";

    };
    homeworkImage.animate(opacity, { duration: 350, delay: 350 });
    const animation = viewerContainer.animate(keyframe, { duration: 700 });
    animation.onfinish = () => {
      viewerContainer.style.display = "none";
    }
    viewerContainer.animate(opacity, { duration: 250, delay: 450 });
  }
}

let thumbnailsContainer;
const createViewer = function () {
  if (hwNodeList.length > 0) {
    viewerContainer = document.createElement("DIV");
    viewerContainer.className = 'homework-viewer';

    homeworkImage = document.createElement("div");
    homeworkImage.setAttribute("id", "HomeworkImage");

    imageContainer = document.createElement("DIV");
    imageContainer.setAttribute("id", "ImageContainer");
    imageContainer.appendChild(homeworkImage);

    viewerContainer.appendChild(imageContainer);
    document.body.prepend(viewerContainer);

    zoomElement = new ZoomElement(homeworkImage);
    zoomElement.onscale = (event) => {
      slider.value = parseFloat((event.scale.value * 100 / event.scale.max).toFixed(2));
    };

    thumbnailsContainer = new Thumbnails(
      {
        element: imageContainer,
        urls: ImageViewer.urls
      },
      {
        imageClick(ev, url) {
          ImageViewer.setImage(url, ev.index);
        }
      });
    thumbnailsContainer.create();
    ImageViewer.thumbnails = thumbnailsContainer.thumbnails;
    ImageViewer.setImage(hwNodeList[ImageViewer.index].lastChild.href, 0);
    createControlBtn();
    ImageViewer.isCreated = true;
  } else {
    console.log("No homework images found!");
  }
}

const setImageSize = function () {
  if (imageContainer) {
    const width = imageContainer.offsetWidth;
    const height = imageContainer.offsetHeight;
    if (width <= 0 || height <= 0) { return; }

    if (width <= height) {
      const size = Math.round(width * 86 / 100); // 86%
      homeworkImage.style.width = `${size}px`;
      homeworkImage.style.height = `${size - 48}px`;
    } else {
      const size = Math.round(height * 86 / 100); // 86%
      homeworkImage.style.width = `${size}px`;
      homeworkImage.style.height = `${size - 48}px`;
    }
  }
}

function createControlBtn() {
  let btnContainer = document.createElement("DIV");
  btnContainer.className = "btn-container";

  let rotateLeft = document.createElement("BUTTON");
  rotateLeft.className = "btn-control btn-rotate-left";
  rotateLeft.onclick = () => {
    setImageSize();
    zoomElement.rotate -= 90;
  }

  let rotateRight = document.createElement("BUTTON");
  rotateRight.className = "btn-control btn-rotate-right";
  rotateRight.onclick = () => {
    setImageSize();
    zoomElement.rotate += 90;
  }

  let nextiImg = document.createElement("BUTTON");
  nextiImg.className = "btn-control btn-rotate-next";
  nextiImg.setAttribute("id", "NextImg")
  nextiImg.onclick = () => {
    if (ImageViewer.index == ImageViewer.urls.length - 1) {
      ImageViewer.setImage(ImageViewer.urls[0], 0);
      return;
    }
    const index = ImageViewer.index + 1;
    ImageViewer.setImage(ImageViewer.urls[index], index);
  }

  let previousImg = document.createElement("BUTTON");
  previousImg.className = "btn-control btn-rotate-previous";
  previousImg.setAttribute("id", "PreviousImg")
  previousImg.onclick = () => {
    if (ImageViewer.index == 0) {
      const lastImg = ImageViewer.urls.length - 1;
      ImageViewer.setImage(ImageViewer.urls[lastImg], lastImg);
      return;
    }
    const index = ImageViewer.index - 1;
    ImageViewer.setImage(ImageViewer.urls[index], index);
  }

  if (hwNodeList.length == 1) {
    nextiImg.style.display = "none";
    previousImg.style.display = "none";
  }

  let btnClose = document.createElement("BUTTON");
  btnClose.className = "btn-control btn-close";
  btnClose.setAttribute("id", "BtnClose");

  btnClose.onclick = () => {
    toggleViewer(false, ImageViewer.index);
  }

  const btnScaleDown = document.createElement("BUTTON");
  btnScaleDown.className = "btn-control";
  btnScaleDown.setAttribute("id", "BtnScaleDown");
  const minus = document.createElement('span');
  minus.classList.add("btn-scale");
  minus.innerHTML = '-';
  btnScaleDown.appendChild(minus);
  btnScaleDown.onclick = function () {
    slider.value = parseInt(slider.value) - 10;
    slider.oninput();
  }

  const btnScaleUp = document.createElement("BUTTON");
  btnScaleUp.className = "btn-control";
  btnScaleUp.setAttribute("id", "BtnScaleUp");
  const plus = document.createElement('span');
  plus.classList.add("btn-scale", "scale-up");
  plus.innerHTML = '+';
  btnScaleUp.appendChild(plus);
  btnScaleUp.onclick = function () {
    slider.value = parseInt(slider.value) + 10;
    slider.oninput();
  }

  slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.setAttribute("min", "20");
  slider.setAttribute("max", "100");
  slider.setAttribute("value", "20");
  slider.setAttribute("id", "ScaleSlider");
  slider.classList.add("scale-slider");
  slider.oninput = function () {
    zoomElement.scale = this.value / 20;
  }

  let leftSideThumbnails = document.createElement("DIV");
  leftSideThumbnails.className += "left-side-thumbnails";

  btnContainer.appendChild(rotateLeft);
  btnContainer.appendChild(rotateRight);
  btnContainer.appendChild(btnScaleDown);
  btnContainer.appendChild(slider);
  btnContainer.appendChild(btnScaleUp);
  btnContainer.appendChild(previousImg);
  btnContainer.appendChild(nextiImg);

  const zoomControl = document.createElement("div");
  zoomControl.classList.add('zoom-control');
  zoomControl.appendChild(btnClose);
  zoomControl.prepend(btnContainer);

  viewerContainer.prepend(zoomControl);
}

const createOpenButtons = function (previewElements) {
  for (let i = 0; i < previewElements.length; i++) {
    ImageViewer.urls.push(previewElements[i].lastChild.href);

    const openButton = document.createElement("div");
    openButton.className = "open-buttons";
    openButton.onclick = () => {
      if (ImageViewer.isCreated == false) {
        createViewer();
      }
      zoomElement.clear();
      homeworkImage.style.width = "";
      homeworkImage.style.height = "";
      ImageViewer.setImage(previewElements[i].lastChild.href, i);
      if (ImageViewer.index == i) {
        toggleViewer(true, i);
        viewerContainer.style.display = "flex";
        return;
      }
      toggleViewer(true, i);
      viewerContainer.style.display = "flex";
    }
    previewElements[i].prepend(openButton);
  }
}

const getHwPreview = function () {
  getHwIntervalId = setInterval(function () {
    hwNodeList = document.getElementsByClassName("dz-image");

    if (hwNodeList.length > 0) {
      const formats = [".jpg", ".jpeg", ".png", ".bmp"];
      function checkFormats(url) {
        for (const format of formats) {
          if (url.endsWith(format)) {
            return true;
          }
        }
        return false
      }

      const elements = [];
      for (let element of hwNodeList) {
        if (checkFormats(element.lastElementChild.href)) {
          elements.push(element);
        }
      }

      if (elements.length == 0) {
        console.warn("Element is not image");
        clearInterval(getHwIntervalId);
        clearTimeout(timeOutId);
        return;
      }

      createOpenButtons(elements);
      clearInterval(getHwIntervalId);
      clearTimeout(timeOutId);
    } else {
      clearTimeout(timeOutId);
      clearInterval(getHwIntervalId)
    }
  }, 250);
}

timeOutId = setTimeout(() => {
  clearInterval(getHwIntervalId)
}, 18000);

getHwPreview();