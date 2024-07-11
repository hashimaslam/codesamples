import { DownloadStateConsumer } from "../components/DownloadState";
import React, { Component } from "react";
import * as imgRef from "../configs/images";

export default class extends Component {
  constructor(props) {
    super(props);

    //If on server and if we have this.props.device available
    //this.imgRef = require("../configs/images")(props.browser);
    this.state = {
      showDownload: props.showDownload,
      // btnTxt: "Install the vpl Pro App & Get 20 tokens!",
      //btnLabel: "DOWNLOAD vpl PRO APP",
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
    changeState(this.props.buttonPosition);
  }

  render() {
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config, pageJson }) => (
          <div style={{ width: "100%" }} className={this.props.page}>
            {this.state.showDownload ? (
              <div>
                {this.props.device === "android" ? (
                  <React.Fragment>
                    {!currentState ? (
                      <a
                        onClick={() => {
                          this.performTwoAction(changeState);
                        }}
                      >
                        <div className="android-download-but">
                          {/* <img
                            className="download-icon"
                            src={
                              pageJson.body.components[0].data
                                .downArrowGreenIcon.imageurl.png
                            }
                            alt={
                              pageJson.body.components[0].data
                                .downArrowGreenIcon.altText
                            }
                          /> */}
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill=""
                            xmlns="http://www.w3.org/2000/svg"
                            className="download-android-img"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M15 9.5H16.59C17.48 9.5 17.92 10.58 17.29 11.21L12.7 15.8C12.31 16.19 11.68 16.19 11.29 15.8L6.7 11.21C6.07 10.58 6.52 9.5 7.41 9.5H9V4.5C9 3.95 9.45 3.5 10 3.5H14C14.55 3.5 15 3.95 15 4.5V9.5ZM6 20.5C5.45 20.5 5 20.05 5 19.5C5 18.95 5.45 18.5 6 18.5H18C18.55 18.5 19 18.95 19 19.5C19 20.05 18.55 20.5 18 20.5H6Z"
                              fill=""
                            />
                          </svg>

                          <h2>
                            {
                              pageJson.body.components[0].data
                                .androidMiddleBtnLabel
                            }
                          </h2>
                        </div>
                      </a>
                    ) : (
                      <div className="android-download-but">
                        <h2>
                          {pageJson.body.components[0].data.androidDownloading}
                        </h2>{" "}
                        <div></div>
                      </div>
                    )}
                  </React.Fragment>
                ) : (
                  <>
                    {config.config.LANG_CODE === "id" ? (
                      <div className="ios-download-but ios-btn-top-games-indo">
                        <span>
                          {
                            pageJson.body.components[0].data.iosBlackIcon
                              .buttonText
                          }
                        </span>
                        <img
                          className="android-icon"
                          src={
                            pageJson.body.components[0].data.androidIcon
                              .imageurl.png
                          }
                        ></img>
                      </div>
                    ) : (
                      <a
                        onClick={() => {
                          this.performTwoAction(changeState);
                        }}
                      >
                        <div className="ios-download-but">
                          <img
                            src={
                              pageJson.body.components[0].data.iosBlackIcon
                                .imageurl.png
                            }
                            alt={
                              pageJson.body.components[0].data.iosBlackIcon
                                .altText
                            }
                          />
                        </div>
                      </a>
                    )}
                  </>
                )}
              </div>
            ) : (
              ""
            )}
            <style jsx>{`
              .android-download-but {
                margin: 0 24px;
                border: 1px solid #20b11d;
                box-sizing: border-box;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                height: 44px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 16px;
                h2 {
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 18px;
                  text-align: center;
                  color: #19be00;
                  align-self: center;
                  margin: 0;
                  margin-left: 12px;
                  text-transform: none;
                }
                .android-icon {
                  width: 14px;
                  height: 17px;
                }
                .download-icon {
                  // width: 14px;
                  // height: 17px;
                  fill: red;
                }
                .download-arrow {
                  fill: red;
                }
              }
              .ios-download-but {
                margin: 0 48px;
                display: flex;
                height: 44px;
                background: #fff;
                border: 1px solid #000000;
                box-sizing: border-box;
                border-radius: 4px;
                justify-content: center;
                align-items: center;
                color: #fff;
                &.ios-btn-top-games-indo {
                  background-color: #000000;
                  padding: 5px 20px;
                  display: flex;
                  span {
                    margin-left: -10px;
                  }
                }
                .android-icon {
                  width: 26px;
                  height: 24px;
                  margin: 0 0 0 14px;
                }
                img {
                  width: 112px;
                  height: 28px;
                }
              }

              .download-android-img {
                fill: #20b11d;
              }

              .vpl-stories {
                .android-download-but {
                  border: solid 1px #ff1e46;
                  h2 {
                    color: #ff1e46;
                  }
                  .download-android-img {
                    fill: #ff1e46;
                  }
                }
              }
            `}</style>
          </div>
        )}
      </DownloadStateConsumer>
    );
  }
}
// export default StickyButton;
