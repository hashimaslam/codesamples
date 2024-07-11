export const VideoOverlay = (props) => {
  return (
    <section>
      <div className="container">
        <div
          className={`${
            props.cssClassList ? props.cssClassList.join(" ") : ""
          }`}
        >
          <div className={"main--section "}>
            <iframe
              className="video__section"
              frameBorder="0"
              allowFullScreen
              id={`youtube-embed-iframe`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              style={{ display: "block" }}
              srcDoc={`
                              <script>
                              function videoClicked(videoName) {
                                window.parent.dataLayer = window.parent.dataLayer || [];
                                window.parent.dataLayer.push({
                                  event: "VideoPlayed",
                                   VideoName: videoName  === "undefined"?  window.parent.location.pathname.substring(1) === "" ? "home": window.parent.location.pathname.substring(1): videoName ,
                                  Game:window.parent.location.pathname.substring(1) === "" ? "home": window.parent.location.pathname.substring(1),
                                  ButtonName:"",
                                  question: "",
                                  LocationofAction : ""
                                });
                              }
                             </script>
                              
                              <style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black} .play-icon{width: 56px;
                          height: 57px;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -25%);} </style>
                          <a href=${props.videoLink} onClick=videoClicked('${
                props.videoTitle
              }')>
                          <picture>
                          <source srcSet=${
                            props.videoThumbnailImageUrl &&
                            props.videoThumbnailImageUrl.webp
                          } type="image/webp" />
                          <source srcSet=${
                            props.videoThumbnailImageUrl &&
                            props.videoThumbnailImageUrl.png
                          } type="image/png" />
                          <img
                            src=${
                              props.videoThumbnailImageUrl &&
                              props.videoThumbnailImageUrl.png
                            }
                            alt="vpl Game Video"
                            class="video-preview"
                          />
                        </picture>
                          <span><img class="play-icon" src="/static/image/icons/play_button.svg"/></span></a>`}
            ></iframe>

            <div className="img__section">
              <img className="img__css" src={props.nameSvg} alt={props.alt} />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .video__section {
          height: 222px;
          width: 343px;
          margin: auto;
          display: block;
          border-radius: 16px;
          border-width: inherit;
        }
        .img__css {
          margin-top: -40px;
          position: absolute;
          left: 0;
          right: 0;
          margin-left: auto;
          margin-right: auto;
          width: 103px;
          height: 58px;
        }
        @media screen and (max-width: 375px) {
          .video__section {
            height: 222px;
            width: 100%;
          }
        }
        @media screen and (min-width: 1224px) {
          .container {
            margin: auto;
          }
          .img__css {
            margin-top: -75px;
            position: absolute;
            left: 0;
            right: 0;
            width: 248px;
            height: 140px;
            margin-left: auto;
            margin-right: auto;
          }
          .video__section {
            height: 672px;
            width: 1013px;
            border-radius: 16px;
            display: block;
            margin: auto;
          }
        }
      `}</style>
    </section>
  );
};
