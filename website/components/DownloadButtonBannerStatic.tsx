import { DownloadStateConsumer } from "../components/DownloadState";
import React, { Component } from "react";
import osType from "../configs/detectOs";
import * as imgRef from "../configs/images";
import {
  ANROID_BUTTON_DOWNLOADED_TITLE,
  ANROID_BUTTON_DOWNLOADED_DESCRIPTION,
} from "../configs/constants";
export default class extends Component {
  constructor(props) {
    super(props);
    //If on server and if we have this.props.device available
    // this.imgRef = require('../configs/images')();
    this.state = {
      showDownload: true,
      btnTxt: "Install the vpl Pro App & Get 20 tokens!",
      btnLabel: "DOWNLOAD vpl PRO APP",
      osType: props.device,
      // btnImg: this.imgRef.IC_DOWNLOAD
    };
  }

  pixelSetup() {
    (function () {
      var colombiaPixelURL =
        "https://ade.clmbtech.com/cde/eventTracking.htm?pixelId=6232&_w=1&rd=" +
        new Date().getTime();
      new Image().src = colombiaPixelURL;
    })();
  }
  performTwoAction(changeState) {
    this.pixelSetup();
    changeState("Banner-Mid");
  }

  render() {
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <div
            style={{ width: "100%" }}
            className={`${this.props.page} ${this.props.device}`}
          >
            {this.state.showDownload ? (
              <div>
                {this.state.osType === "android" ? (
                  <React.Fragment>
                    {!currentState ? (
                      <a
                        onClick={() => {
                          this.performTwoAction(changeState);
                        }}
                      >
                        <div className="android-download-but">
                          <img
                            className="android-icon"
                            src={imgRef.APP_DOWNLOAD_BU_ANDROID_ICON}
                            alt="download vpl Android APP"
                          />
                          <h2>Download the vpl App</h2>
                          <img
                            className="download-icon"
                            src={imgRef.APP_DOWNLOAD_BUT_ICON}
                            alt="download vpl Android APP"
                          />
                        </div>
                      </a>
                    ) : (
                      <React.Fragment>
                        {this.props.buttonPosition &&
                        this.props.buttonPosition === "bottom" ? (
                          <div className="android-downloaded">
                            <div className="android-downloaded-image">
                              <picture>
                                <source
                                  srcSet={
                                    imgRef.ANDROID_DOWNLOADED_ICON + ".png"
                                  }
                                  type="image/webp"
                                />
                                <source
                                  srcSet={
                                    imgRef.ANDROID_DOWNLOADED_ICON + ".png"
                                  }
                                  type="image/png"
                                />
                                <img
                                  src={imgRef.ANDROID_DOWNLOADED_ICON + ".png"}
                                  className="downloaded-image-phone"
                                  alt="anroid downloaded icon"
                                />
                              </picture>
                            </div>

                            <div className="android-downloaded-message">
                              <strong>
                                {" "}
                                {ANROID_BUTTON_DOWNLOADED_TITLE}{" "}
                              </strong>
                              <div>
                                <span>
                                  <img
                                    src={imgRef.ANDROID_DOWNLOADED_ICON_ARROW}
                                  ></img>
                                </span>
                                <p>{ANROID_BUTTON_DOWNLOADED_DESCRIPTION} </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="android-download-but">
                            <h2>DOWNLOADING...</h2>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : (
                  <a
                    onClick={() => {
                      this.performTwoAction(changeState);
                    }}
                  >
                    <div className="ios-download-but">
                      <img
                        src={imgRef.BUTTON_DOWNLOAD_IOS}
                        alt="download vpl IOS APP"
                      />
                    </div>
                  </a>
                )}
              </div>
            ) : (
              ""
            )}
            <style jsx>{`
              .installbtn {
              }
              #download-but-new {
                display: none;
              }
              a {
                text-decoration: none;
              }
              #download-bar {
                padding: 5px 0;
                width: 100%;

                bottom: 80px;
                font-size: 16px;
                font-weight: bold;
                font-style: italic;
                font-stretch: condensed;
                line-height: normal;
                letter-spacing: normal;
                text-align: center;
                color: #4a4a4a;
                background-color: #f8e71c;
                // z-index: 100;
                box-shadow: 0 -2px 6px 0 rgba(90, 90, 90, 0.5);

                #download-but-new {
                  box-shadow: 2px 2px 8px #000;
                  margin-left: 10vw;
                  // margin-top: -10vh;
                  position: absolute;
                  margin-top: -11vh;
                  z-index: 1000;
                  text-transform: none;
                }
              }
              @keyframes shimmerBackground {
                0% {
                  background-position: -5000px 0;
                }
                100% {
                  background-position: 5000px 0;
                }
              }
              .android-download-but {
                background: linear-gradient(
                    121.19deg,
                    rgba(133, 239, 49, 0) 25.73%,
                    rgba(133, 239, 49, 0.6) 45.27%,
                    rgba(133, 239, 49, 0) 62.27%
                  ),
                  #19ce15;
                animation: shimmerBackground 35s linear infinite;
                border: 1px solid #20b11d;
                box-sizing: border-box;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                padding: 0 16px;
                height: 56px;
                display: flex;
                justify-content: center;
                align-items: center;
                h2 {
                  font-weight: bold;
                  font-size: 18px;
                  line-height: 26px;
                  text-align: center;
                  color: #ffffff;
                  align-self: center;
                  margin: 0 16px;
                  text-transform: none;
                }
                .android-icon {
                  width: 26px;
                  height: 24px;
                }
                .download-icon {
                  width: 19px;
                  height: 24px;
                }
              }
              .ios-download-but {
                display: flex;
                height: 56px;
                background: #000000;
                border: 2px solid #a6a6a6;
                box-sizing: border-box;
                border-radius: 8px;
                justify-content: center;
                align-items: center;
                color: #fff;
                img {
                  width: 112px;
                  height: 28px;
                }
              }
              #download-but-new {
                display: flex;
                height: 56px;
                font-family: Roboto;
                font-style: normal;
                font-weight: bold;
                font-size: 16px;
                line-height: 20px;
                text-align: center;
                background: #19be00;
                color: #fff;
                align-items: center;
                justify-content: center;
                text-transform: none;
                border: 2px solid #76e521;
                box-sizing: border-box;
                box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                #coin {
                  margin-left: 5px;
                  margin-right: 5px;
                }
                img {
                  width: 16.7px;
                  height: 20px;
                  margin: 0 9px;
                  vertical-align: middle;
                }
              }

              .android-downloaded {
                display: flex;
                margin: -16px 0 -16px -24px;
                .android-downloaded-image {
                  width: 212px;
                  height: 115px;
                }
                .downloaded-image-phone {
                  width: 140px;
                  height: 115px;
                  object-fit: cover;
                }

                .android-downloaded-message {
                  font-size: 12px;
                  line-height: 16px;
                  text-transform: none;
                  margin: 28px -8px 0 0;
                  text-align: left;
                  div {
                    display: flex;
                    align-items: center;
                    margin: 14px 0 0 0;
                  }
                  strong {
                    font-size: 12px;
                    line-height: 16px;
                    font-weight: 500;
                  }
                  p {
                    font-size: 10px;
                    line-height: 13px;
                    margin: 0;
                  }
                  span {
                    margin-right: 8px;
                    width: 24px;
                    height: 24px;
                    display: inline-block;
                  }
                }
              }

              .vpl-stories {
                width: 85% !important;
                margin: 20px auto 40px auto;

                .android-download-but {
                  background: linear-gradient(
                      121.19deg,
                      rgba(255, 30, 70, 0) 25.73%,
                      rgba(255, 30, 70, 0.6) 45.27%,
                      rgba(255, 30, 70, 0) 62.27%
                    ),
                    #ff1e46;
                  border: solid 1px #cc1838;
                }
              }
              .bpcl {
                width: 85% !important;
                margin: 20px auto 40px auto;
              }
            `}</style>
          </div>
        )}
      </DownloadStateConsumer>
    );
  }
}
// export default StickyButton;
