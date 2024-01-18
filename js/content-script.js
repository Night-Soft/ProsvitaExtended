let hwNodeList,
  homeworkViewer,
  homeworkImage,
  zoomElement,
  slider;

  const ImageViewer = {
  thumbnails: undefined,
  isCreated: false,
  urls: [],
  index: 0,
  setImage(index) {
    const endTransition = () => {
      homeworkImage.style.transition = "0";
      homeworkImage.removeEventListener("transitionend", endTransition);
    }
    homeworkImage.removeEventListener("transitionend", endTransition);
    homeworkImage.addEventListener("transitionend", endTransition);

    homeworkImage.style.transition = "0.7s";
    homeworkImage.style.backgroundImage = `url(${this.urls[index]})`;
    if (this.thumbnails) {
      this.thumbnails[this.index].classList.remove('thumbnails-active');
      this.thumbnails[index].classList.add('thumbnails-active');
    }
    this.index = index;
  }
}

const toggleViewer = function (show = true, index = 0) {
  let openButton = document.querySelectorAll(".open-button")[index];
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
    if (thumbnailsContainer) thumbnailsContainer.style.opacity = "0";
    homeworkImage.style.width = "";
    homeworkImage.style.height = "";
    homeworkViewer.style.overflow = "hidden";
    homeworkViewer.style.display = "flex";

    homeworkImage.animate(opacity, { duration: 350 });
    const animation = homeworkViewer.animate(keyframe, { duration: 700 });
    animation.onfinish = () => {
      homeworkViewer.style.overflow = "";
      zoomControl.style.opacity = "1";
      zoomControl.animate(opacity, { duration: 500 });
      if (thumbnailsContainer) {
        thumbnailsContainer.style.opacity = "1";
        thumbnailsContainer.animate(opacity, { duration: 500 });
      }
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

    zoomControl.animate(opacity, { duration: 200 }).onfinish = () => {
      zoomControl.style.opacity = "0";
    }
    if (thumbnailsContainer) {
      thumbnailsContainer.animate(opacity, { duration: 200 }).onfinish = () => {
        thumbnailsContainer.style.opacity = "0";
      }
    }
    homeworkImage.animate(opacity, { duration: 350, delay: 350 });
    const animation = homeworkViewer.animate(keyframe, { duration: 700 });
    animation.onfinish = () => {
      homeworkViewer.style.display = "none";
    }
    homeworkViewer.animate(opacity, { duration: 250, delay: 450 });
  }
}

let thumbnailsContainer;
const createViewer = function () {
  if (hwNodeList.length > 0) {

    homeworkViewer = document.createElement("DIV");
    homeworkViewer.className = 'homework-viewer';

    let controlImageContainer = document.createElement("DIV");
    controlImageContainer.classList.add("control-image-container");
    controlImageContainer.appendChild(createZoomControl()); // add zoom-control

    homeworkImage = document.createElement("DIV");
    homeworkImage.setAttribute("id", "HomeworkImage");

    imageContainer = document.createElement("DIV");
    imageContainer.setAttribute("id", "ImageContainer");
    imageContainer.appendChild(homeworkImage);

    controlImageContainer.appendChild(imageContainer);
    homeworkViewer.appendChild(controlImageContainer);

    if (hwNodeList.length > 1) {
      thumbnailsContainer = new Thumbnails({
        element: homeworkViewer,
        urls: ImageViewer.urls
      }, {
        imageClick(ev, url) {
          ImageViewer.setImage(ev.index);
        }
      });
      thumbnailsContainer.create();
      ImageViewer.thumbnails = thumbnailsContainer.thumbnails;
    }

    document.body.prepend(homeworkViewer);

    zoomElement = new ZoomElement(homeworkImage);
    zoomElement.onscale = (event) => {
      slider.value = (event.value / event.max * parseInt(slider.max)).toFixed(2);
    };

    ImageViewer.setImage(0);
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

function createZoomControl() {
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
      ImageViewer.setImage(0);
      return;
    }
    ImageViewer.setImage(ImageViewer.index + 1);
  }

  let previousImg = document.createElement("BUTTON");
  previousImg.className = "btn-control btn-rotate-previous";
  previousImg.setAttribute("id", "PreviousImg")
  previousImg.onclick = () => {
    if (ImageViewer.index == 0) {
      ImageViewer.setImage(ImageViewer.urls.length - 1); // lastImg
      return;
    }
    ImageViewer.setImage(ImageViewer.index - 1);
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
    slider.value = parseInt(slider.value) - 1;
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
    slider.value = parseInt(slider.value) + 1;
    slider.oninput();
  }

  slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.setAttribute("min", "10");
  slider.setAttribute("max", "50");
  slider.setAttribute("value", "1");
  slider.setAttribute("id", "ScaleSlider");
  slider.classList.add("scale-slider");
  slider.oninput = function () {
    zoomElement.scale.value = this.value / this.max * zoomElement.scale.max;
  }

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

  return zoomControl;
}

const createOpenButtons = function (previewElements) {
  console.log("createOpenButtons")
  for (let i = 0; i < previewElements.length; i++) {
    ImageViewer.urls.push(previewElements[i].lastChild.href);

    const openButton = document.createElement("div");
    openButton.className = "open-button";
    openButton.onclick = () => {
      if (ImageViewer.isCreated == false) { createViewer(); }
      zoomElement.clear();
      ImageViewer.setImage(i);
      toggleViewer(true, i);
    }
    previewElements[i].prepend(openButton);
  }
}

const getHwElements = function () {
  hwNodeList = document.getElementsByClassName("dz-image");
  if (hwNodeList.length > 0) {
    const previewElements = [];
    const formats = [".jpg", ".jpeg", ".png", ".bmp"];
    formats.forEach(format => {
      for (let element of hwNodeList) {
        if (element.lastElementChild.href.endsWith(format)) {
           previewElements.push(element);
         }
      }
    });

    if (previewElements.length == 0) {
      console.warn("Element is not image");
      clearTime()
      return;
    }

    clearTime();
    createOpenButtons(previewElements);
  }
}

let getHwIntervalId = setInterval(getHwElements, 250);

let timeOutId = setTimeout(() => {
  clearInterval(getHwIntervalId)
}, 18000);

const clearTime = function() {
  console.log("clearTime")
  clearInterval(getHwIntervalId);
  clearTimeout(timeOutId);
}

window.onload = () => {
  if (hwNodeList == undefined || hwNodeList.length == 0) {
    clearTime();
    getHwElements();
  }
}