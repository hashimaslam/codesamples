import isMobile from "ismobilejs";
import osType from "../configs/detectOs";
import  "intersection-observer";

export const deviceType = function (data, page) {
  let ua = data.req.headers["user-agent"];
  // ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36";
       
 
  
  
  let device = "android";
  if (ua)
  {
    device = isMobile(ua).apple.device
    ? "ios"
    : isMobile(ua).android.device
    ? "android"
    : "desktop";    
  }
  // let device = isMobile(ua).apple.device &&
  //   ? "ios"
  //   : isMobile(ua).android.device
  //   ? "android"
  //   : "desktop";

  let browserName;
  if (typeof window === "undefined") {
  } else {
     device = osType();
  }
  return {
    config: data.query ? data.query : data,
    device: device,
    browser: browserName,
    userString : ua 
  };
};

//Use isTouchScreen only on client-side & never on server-side.
export const isTouchScreen = function() {
  let r = false;
  if (window.PointerEvent && ('maxTouchPoints' in navigator))
  {
    if (navigator.maxTouchPoints>1)
      r = true;
  }
  else 
  {
    if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
      r = true;
    } else if (window.TouchEvent || ('ontouchstart' in window)) {
      r = true;
    }
  }
  return r;
}

//Use isApple only on client-side & never on server-side
export const isApple = function(){
  if ('platform' in navigator)
  {
    if (navigator.platform.toLowerCase().indexOf("mac")>=0)
      return true;
  }
  return false;
}


export const lazyImage = function () {
   if ("IntersectionObserver" in window) {
   const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          if (entry.target.hasAttribute("data-src")) {
            entry.target.setAttribute(
              "src",
              entry.target.getAttribute("data-src")
            );
            observer.unobserve(entry.target);
          }
        }
      });
    });
    document.querySelectorAll(".lazy-image").forEach((gameImg) => {
      if (gameImg.getAttribute("is-observed") != "true" && gameImg.getAttribute("data-src") != null)
      {
        gameImg.setAttribute("is-observed", "true")
        observer.observe(gameImg);  
      }
    });
   
  } else {
    var imgList = document.querySelectorAll(".lazy-image");
    Array.prototype.forEach.call(imgList, function (image) {
      image.setAttribute("src", image.getAttribute("data-src"));
    });
  }
};

export function getHTML(content) {
  return <span dangerouslySetInnerHTML={{ __html: content }} className="html-content"></span>;
}

export function getHTMLParagraph(content) {
  return <p dangerouslySetInnerHTML={{ __html: content }} className="html-content"></p>;
}
export function getHTMLwithSpan(content) {
  return <span dangerouslySetInnerHTML={{ __html: content }}></span>;
}


export function getParameterFromURL(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function convertMiliseconds(miliseconds) {
  var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;
  
  total_seconds = parseInt(Math.floor(miliseconds / 1000));
  total_minutes = parseInt(Math.floor(total_seconds / 60));
  total_hours = parseInt(Math.floor(total_minutes / 60));
  days = parseInt(Math.floor(total_hours / 24));

  seconds = parseInt(total_seconds % 60);
  minutes = parseInt(total_minutes % 60);
  hours = parseInt(total_hours % 24);
  if(days != 0 && hours != 0){
    return  `${days} days ${hours} hours`;
  }
  else if(days == 0 && hours != 0){
    return  `${hours} hours`;
  }
  else if(hours == 0 && days != 0){
    return `${days} days`;
  }
 
  return '';
  
};
