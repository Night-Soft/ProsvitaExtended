let dzImage,
  zoomist,
  zoomistElement,
  timeOutId,
  getDzTimeOutId,
  needHide = true,
  stopTimeOut = false,
  prevZoom = 0.8;

let ListImage = {
  hrefs: [],
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

let endLoad = function () {
  console.log("endLoad")
  dzImage = document.getElementsByClassName("dz-image");
  if (dzImage.length > 0) {
    console.log("success");
    let imageModal = document.createElement("DIV");
    imageModal.className = 'image-modal';

    zoomistElement = document.createElement("DIV");
    zoomistElement.setAttribute("id", "my-zoomist");

    imageContainer = document.createElement("DIV");
    imageContainer.setAttribute("id", "ImageContainer");
    imageContainer.appendChild(zoomistElement);

    imageModal.appendChild(imageContainer);
    document.body.prepend(imageModal);

    zoomistElement.setAttribute("data-zoomist-src", dzImage[ListImage.index].lastChild.href);
    createModalElement();

    let modalOpenAnim = new OpenCloseAnim(imageModal, "scale-in-center", false, () => {
      if (zoomist == undefined) {
        createModalElement();
      }
      zoomist.update();
    });

    for (let i = 0; i < dzImage.length; i++) {
      let concealer = document.createElement("DIV");
      concealer.className = "concealer";
      dzImage[i].prepend(concealer);
      ListImage.hrefs.push(dzImage[i].lastChild.href);
      concealer.onclick = () => {
        zoomist.options.enableRetun = true;
        if (ListImage.index == i) {
          modalOpenAnim.animate();
          imageModal.style.display = "flex";
          return;
        }
        ListImage.index = i;
        zoomistElement.setAttribute("data-zoomist-src", dzImage[i].lastChild.href);
        modalOpenAnim.animate();
        imageModal.style.display = "flex";
      }
    }
  } else {
    console.log("not found");
  }
}

let createModalElement = () => {
  const myZoomist = document.querySelector('#my-zoomist')
  let percent = window.innerHeight * 100 / window.innerWidth;
  zoomist = new Zoomist(myZoomist, {
    fill: "contain",
    height: percent.toFixed(1) + "%",
    slider: true,
    zoomer: true,
    on: {
      ready() {
        console.log('Zoomist ready!');
        zoomist.zoomTo(0.8);
 
        if (isControlBtn == false) {
          let zoomistSlider = document.getElementsByClassName("zoomist-slider")[0];
          let zoomistInZoomer = document.getElementsByClassName("zoomist-in-zoomer")[0];
          let zoomistOutzoomer = document.getElementsByClassName("zoomist-out-zoomer")[0];
  
          zoomistSlider.style.display = "flex";
          zoomistSlider.style.height = "40px";
          zoomistSlider.style.position = "relative";
          zoomistSlider.style.borderRadius = "0px 0px 4px 4px";
          zoomistSlider.style.overflow = "hidden";
  
          zoomistInZoomer.className += " btn-controlPL"
          zoomistOutzoomer.className += " btn-controlPL"
          zoomistInZoomer.style.borderRadius = "0px"
          zoomistOutzoomer.style.borderRadius = "0px 0px 0px 4px"
  
          zoomistSlider.prepend(zoomistOutzoomer);
          zoomistSlider.appendChild(zoomistInZoomer);    
          createControlBtn();
          let btnContainer = document.getElementsByClassName("btn-container")[0];
          btnContainer.prepend(zoomistSlider);  



        };

        if(needHide) {
          zoomist.update();
          let imageModal = document.getElementsByClassName("image-modal")[0];
          imageModal.style.display = "none";
          console.log("needhide", needHide);
          needHide = false;
        }

      }
    }
  })

}

let isControlBtn = false;
let createControlBtn = () => {
  isControlBtn = true;
  let myZoomist = document.getElementById("my-zoomist");
  let btnContainer = document.createElement("DIV");
  btnContainer.className = "btn-container";

  let rotateLeft = document.createElement("BUTTON");
  rotateLeft.className = "btn-control btn-rotate-left";
  rotateLeft.onclick = () => {
    zoomist.options.rotate = ListImage.setRotateDirection("left");
    prevZoom = zoomist.getZoomRatio();
    zoomist.zoomTo(prevZoom);
  }

  let rotateRight = document.createElement("BUTTON");
  rotateRight.className = "btn-control btn-rotate-right";
  rotateRight.onclick = () => {
    zoomist.options.rotate = ListImage.setRotateDirection("right");
    prevZoom = zoomist.getZoomRatio();
    zoomist.zoomTo(prevZoom);
  }

  let nextiImg = document.createElement("BUTTON");
  nextiImg.className = "btn-control btn-rotate-next";
  nextiImg.setAttribute("id", "NextImg")
  nextiImg.onclick = () => {
    ListImage.currentDeg = 0;
    zoomist.options.rotate = 0;
    let img = document.getElementById("ImageContent");
    if (ListImage.index == ListImage.hrefs.length - 1) {
      ListImage.index = 0;
      zoomistElement.setAttribute("data-zoomist-src", ListImage.hrefs[0]);
      prevZoom = zoomist.getZoomRatio();
      zoomist.update();
      setTimeout(() => {
        zoomist.zoomTo(prevZoom);
      }, 200);
      return;
    }
    ListImage.index++;
    zoomistElement.setAttribute("data-zoomist-src", ListImage.hrefs[ListImage.index]);
    prevZoom = zoomist.getZoomRatio();
    zoomist.update();
    setTimeout(() => {
      zoomist.zoomTo(prevZoom);
    }, 200);
  }

  let previousImg = document.createElement("BUTTON");
  previousImg.className = "btn-control btn-rotate-previous";
  previousImg.setAttribute("id", "PreviousImg")
  previousImg.onclick = () => {
    ListImage.currentDeg = 0;
    zoomist.options.rotate = 0;
    let img = document.getElementById("ImageContent");
    if (ListImage.index == 0) {
      ListImage.index = ListImage.hrefs.length - 1;
      zoomistElement.setAttribute("data-zoomist-src", ListImage.hrefs[ListImage.index]);
      prevZoom = zoomist.getZoomRatio();
      zoomist.update();
      setTimeout(() => {
        zoomist.zoomTo(prevZoom);
      }, 200);
      return;
    }
    ListImage.index--;
    zoomistElement.setAttribute("data-zoomist-src", ListImage.hrefs[ListImage.index]);
    prevZoom = zoomist.getZoomRatio();
    zoomist.update();
    setTimeout(() => {
      zoomist.zoomTo(prevZoom);
    }, 200);
  }
  if (dzImage.length == 1) {
    nextiImg.style.display = "none";
    previousImg.style.display = "none";
  }

  let btnClose = document.createElement("BUTTON");
  btnClose.className = "btn-control btn-rotate-close";
  btnClose.setAttribute("id", "BtnClose")
  let imageModal = document.getElementsByClassName("image-modal")[0];
  let modalCloseAnim = new OpenCloseAnim(imageModal, "scale-in-center-reverse", true);

  btnClose.onclick = () => {
    modalCloseAnim.animate();
  }
  let leftSideThumbnails = document.createElement("DIV");
  leftSideThumbnails.className += "left-side-thumbnails";
  for (let i = 0; i < dzImage.length; i++) {
    let thumbnails = document.createElement("img");
    thumbnails.className += "thumbnails";
    thumbnails.src = ListImage.hrefs[i];
    thumbnails.onclick = () => {
      ListImage.index = i;
      zoomistElement.setAttribute("data-zoomist-src", ListImage.hrefs[i]);
      prevZoom = zoomist.getZoomRatio();
      zoomist.update();
      setTimeout(() => {
        zoomist.zoomTo(prevZoom);
      }, 200);
    }
    leftSideThumbnails.append(thumbnails);
  }
  let imageContainer = document.getElementById("ImageContainer");
  imageContainer.prepend(leftSideThumbnails);
  let zoomistSlider = document.getElementsByClassName("zoomist-slider")[0];

  zoomistSlider.appendChild(rotateLeft);
  zoomistSlider.appendChild(rotateRight);
  zoomistSlider.appendChild(previousImg);
  zoomistSlider.appendChild(nextiImg);
  myZoomist.appendChild(btnClose);
  myZoomist.prepend(btnContainer);

}

let resizeTimeOutId
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeOutId);
  resizeTimeOutId = setTimeout(() => {
    let percent = window.innerHeight * 100 / window.innerWidth;
    zoomist.options.height = percent.toFixed(1) + "%";
    zoomist.update();
  }, 100);
});

ListImage.getDzImageLoad();
timeOutId = setTimeout(() => {
  console.log("stopTimeOut = true");
  stopTimeOut = true;
}, 18000);
