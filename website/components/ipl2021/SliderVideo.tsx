import React, { useState, useEffect } from "react";
// import Swiper from "react-id-swiper";
// import "swiper";
import { Text } from "./Text";
import { CustomImage } from "./CustomImage";

export const SliderVideo = (props) => {
  useEffect(() => {}, []);
  const params = {
    slidesPerView: "auto",
    spaceBetween: 12,
    loop: false,
    slideToClickedSlide: true,
    freeMode: true,
    watchOverflow: true,
  };

  return (
    <>
      <div className="slick-container scrollable-section">
        {props.videoList &&
          Object.keys(props.videoList).length > 0 &&
          props.videoList.map((video, index) => {
            return (
              <div key={index} className="slider-container">
                <div className={`video-container`}>
                  <div className={`video-tile`}>
                    <iframe
                      className="video-tile-iframe"
                      frameBorder="0"
                      allowFullScreen
                      id={`youtube-embed-iframe_${index}`}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      style={{ display: "block" }}
                      srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black} .play-icon{width: 56px;
                        height: 57px;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);} .video-preview {width:256px; height:222px;}</style><a href=${video.videourl}>
                        <picture>
                        <source srcSet=${video.videoThumbnailImageUrl.webp} type="image/webp" />
                        <source srcSet=${video.videoThumbnailImageUrl.png} type="image/png" />
                        <img
                          src=${video.videoThumbnailImageUrl.png}
                          alt="vpl Game Video"
                          class="video-preview"
                        />
                      </picture>
                        <span><img class="play-icon" src="/static/image/icons/play_button.svg"/></span></a>`}
                    ></iframe>
                  </div>
                  <div>
                    <CustomImage {...video.customImageComponent} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <style jsx>
        {`
          .slick-container {
            display: flex;
            flex-direction: row;
          }
          .slider-container {
            height: 268px;
            width: 256px;
            margin-left: 8px;
          }
          .video-container {
            height: 222px;
            width: 256px;
            position: relative;
          }
          .video-tile {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .video-tile-iframe {
            border-radius: 16px;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
    </>
  );
};
