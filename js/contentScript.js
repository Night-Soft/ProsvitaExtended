let dzImage,
  homeWorkViewer,
  homeWorkImage,
  timeOutId,
  getDzTimeOutId,
  zoomElement,
  slider,
  loader,
  needHide = true,
  stopTimeOut = false,
  prevZoom = 0.8;


const Viewer = {
  _isHidden: false,
  toggle(force = !this._isHidden) {
    this._isHidden = force;

    if (force) {
      const endAnimaton = () => {
        console.log("endAnim Force true");
        homeWorkViewer.classList.remove("scale-in-center");
        homeWorkViewer.removeEventListener("animationend", endAnimaton);
      }
      homeWorkViewer.style.display = "flex";
      homeWorkViewer.addEventListener("animationend", endAnimaton,);
      homeWorkViewer.classList.toggle("scale-in-center");
    } else {
      const endAnimaton = () => {
        console.log("endAnim Force false");
        homeWorkViewer.style.display = "none";
        homeWorkViewer.classList.remove("scale-in-center-reverse");
        homeWorkViewer.removeEventListener("animationend", endAnimaton);
      }
      homeWorkViewer.addEventListener("animationend", endAnimaton,);
      homeWorkViewer.classList.toggle("scale-in-center-reverse");

    }
  }
}

const imageOnload = function() {
  console.log("onload");

}

const setImage = function (url) {
  const endAnimaton = () => {
    homeWorkImage.style.transition = "0";
    homeWorkImage.removeEventListener("animationend", endAnimaton);
  }

  homeWorkImage.removeEventListener("animationend", endAnimaton);
  homeWorkImage.addEventListener("animationend", endAnimaton);
  homeWorkImage.style.transition = "0.7s";

  homeWorkImage.style.backgroundImage = `url(${url})`;
}

let ListImage = { // prosvita extended
  urls: [],
  currentDeg: 0,
  index: 0,
  setRotateDirection(direction) {
    if (direction == "left") {
      this.currentDeg -= 90;
      return this.currentDeg;
    } else if (direction == "right") {
      this.currentDeg += 90;
      return this.currentDeg;
    }
  },
  getDzImageLoad: () => {
    getDzTimeOutId = setInterval(function () {
      let dzImage = document.getElementsByClassName("dz-image");
      console.log("length = ", dzImage);

      if (dzImage.length > 0) {
        stopTimeOut = true;
        endLoad(); // if work
        clearInterval(getDzTimeOutId);
        clearTimeout(timeOutId);
        console.log("clear intervla, timeout");
      } else {
        if (stopTimeOut == true) {clearInterval(getDzTimeOutId)};
        console.log("interval stopTimeOut = ", stopTimeOut);
      }
    }, 250);
  }

}
let thumbnails;
let endLoad = function () {
  console.log("endLoad")
  dzImage = document.getElementsByClassName("dz-image");
  if (dzImage.length > 0) {
    console.log("success");
    homeWorkViewer = document.createElement("DIV");
    homeWorkViewer.className = 'home_work-viewer';

    homeWorkImage = document.createElement("div");
    homeWorkImage.setAttribute("id", "HomeWorkImage");
    homeWorkImage.onload = imageOnload;
    setImage(dzImage[ListImage.index].lastChild.href);

    imageContainer = document.createElement("DIV");
    imageContainer.setAttribute("id", "ImageContainer");
    imageContainer.appendChild(homeWorkImage);

    // loader = document.createElement("div");
    // loader.classList.add('custom-loader');
    // imageContainer.appendChild(loader);

    homeWorkViewer.appendChild(imageContainer);
    document.body.prepend(homeWorkViewer);
    createControlBtn();
    zoomElement = new ZoomElement(homeWorkImage);
    zoomElement.onscale((event)=>{
      console.log("scale", parseFloat(event.scale.value.toFixed(2)));
      slider.value = parseFloat((event.scale.value * 100 / event.scale.max).toFixed(2));
    });

    // to do 
    for (let i = 0; i < dzImage.length; i++) {
      ListImage.urls.push(dzImage[i].lastChild.href);

      const concealer = document.createElement("DIV");
      concealer.className = "concealer";
      concealer.onclick = () => {
        if (ListImage.index == i) {
          Viewer.toggle(true);
          homeWorkViewer.style.display = "flex";
          return;
        }
        ListImage.index = i;
        setImage(dzImage[i].lastChild.href);
        Viewer.toggle(true);
        homeWorkViewer.style.display = "flex";
      }
      dzImage[i].prepend(concealer);
    }

    thumbnails = new Thumbnails(homeWorkViewer, ListImage.urls, {
      imageClick(ev, url) {
        setImage(url);
      }
    });
    thumbnails.create();

  } else {
    console.log("not found");
  }
}

let isControlBtn = false;
function createControlBtn() {
  isControlBtn = true;
  let btnContainer = document.createElement("DIV");
  btnContainer.className = "btn-container";

  let rotateLeft = document.createElement("BUTTON");
  rotateLeft.className = "btn-control btn-rotate-left";
  rotateLeft.onclick = () => {
    zoomElement.rotate -= 90;
  }

  let rotateRight = document.createElement("BUTTON");
  rotateRight.className = "btn-control btn-rotate-right";
  rotateRight.onclick = () => {
    zoomElement.rotate += 90;
  }

  let nextiImg = document.createElement("BUTTON");
  nextiImg.className = "btn-control btn-rotate-next";
  nextiImg.setAttribute("id", "NextImg")
  nextiImg.onclick = () => {
    if (ListImage.index == ListImage.urls.length - 1) {
      ListImage.index = 0;
      setImage(ListImage.urls[0]);
      return;
    }
    ListImage.index++;
    setImage(ListImage.urls[ListImage.index]);
  }

  let previousImg = document.createElement("BUTTON");
  previousImg.className = "btn-control btn-rotate-previous";
  previousImg.setAttribute("id", "PreviousImg")
  previousImg.onclick = () => {
    ListImage.currentDeg = 0;
    if (ListImage.index == 0) {
      ListImage.index = ListImage.urls.length - 1;
      setImage(ListImage.urls[ListImage.index]);
      return;
    }
    ListImage.index--;
    setImage(ListImage.urls[ListImage.index]);
  }

  if (dzImage.length == 1) {
    nextiImg.style.display = "none";
    previousImg.style.display = "none";
  }

  let btnClose = document.createElement("BUTTON");
  btnClose.className = "btn-control btn-close";
  btnClose.setAttribute("id", "BtnClose");

  btnClose.onclick = () => {
    Viewer.toggle(false);
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

  homeWorkViewer.prepend(zoomControl);

}

ListImage.getDzImageLoad();

timeOutId = setTimeout(() => {
  console.log("stopTimeOut = true");
  stopTimeOut = true;
}, 18000);

let delayOnResize
FileReady.onload("ZoomElement", () => {
  delayOnResize = new DelayLastEvent({
    func() {
      const width = imageContainer.offsetWidth;
      const height = imageContainer.offsetHeight;
      if (width <= 0 || height <= 0) { return; }

      if (width <= height) {
        const size = Math.round(width * 84 / 100); // 84%
        homeWorkImage.style.width = `${size}px`;
        homeWorkImage.style.height = `${size}px`;
      } else {
        const size = Math.round(height * 84 / 100); // 84%
        homeWorkImage.style.width = `${size}px`;
        homeWorkImage.style.height = `${size}px`;
      }
    },
    delay: 300
  });
});


window.onresize = function () {
  delayOnResize.run();
}
