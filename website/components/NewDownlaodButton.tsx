import { DownloadStateConsumer } from "../components/DownloadState";
import React, { Component } from "react";
import * as imgRef from "../configs/images";
export default class extends Component {
  constructor(props) {
    super(props);
    //If on server and if we have this.props.device available
    // this.imgRef = require('../configs/images')()
    this.state = {
      showDownload: true,
      btnTxt: "Install the vpl Pro App & Get 20 tokens!",
      btnLabel: "DOWNLOAD vpl PRO APP",
      osType: props.device,
      btnImg: imgRef.IC_DOWNLOAD,
      config: props.config,
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
    changeState();
  }

  render() {
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <div>
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
                        <div id="download-but-new">
                          <div>
                            <img
                              src={imgRef.ANDROID_DOWNLOAD_BUTTON}
                              alt="download vpl Android APP"
                            />
                          </div>
                          <div className="installbtn">
                            <span>Install App</span>
                          </div>
                          {(this.props.config.config.REWARDS ||
                            this.props.config.config.referral) &&
                          this.props.hide === undefined ? (
                            <React.Fragment>
                              <div className="playstr">&nbsp; & Get </div>

                              {this.props.config.config.referral ? (
                                <React.Fragment>
                                  {this.props.config.config.referral
                                    .cashBonus ? (
                                    <React.Fragment>
                                      <div>
                                        <img
                                          id="coin"
                                          src={imgRef.IC_CASH}
                                          alt=""
                                        />
                                      </div>
                                      <div>
                                        {
                                          this.props.config.config.referral
                                            .cashBonus
                                        }
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    ""
                                  )}

                                  {this.props.config.config.referral
                                    .tokenBonus ? (
                                    <React.Fragment>
                                      <div>
                                        <img
                                          id="coin"
                                          src={imgRef.IC_COIN}
                                          alt=""
                                        />{" "}
                                      </div>
                                      <div>
                                        {
                                          this.props.config.config.referral
                                            .tokenBonus
                                        }
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    ""
                                  )}
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  {this.props.config.config.REWARDS
                                    .cashBonus ? (
                                    <React.Fragment>
                                      <div>
                                        &nbsp; Rs.{" "}
                                        {
                                          this.props.config.config.REWARDS
                                            .cashBonus
                                        }
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    ""
                                  )}

                                  {this.props.config.config.REWARDS
                                    .tokenBonus ? (
                                    <React.Fragment>
                                      <div>
                                        <img
                                          id="coin"
                                          src={imgRef.IC_COIN}
                                          alt=""
                                        />{" "}
                                      </div>
                                      <div>
                                        {
                                          this.props.config.config.REWARDS
                                            .tokenBonus
                                        }
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    ""
                                  )}
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          ) : (
                            ""
                          )}
                        </div>
                      </a>
                    ) : (
                      <div id="download-but-new">
                        <div>
                          <img
                            src={imgRef.IC_DOWNLOAD}
                            alt="downloading vpl Android APP"
                          />
                        </div>
                        <div>DOWNLOADING ...</div> <div></div>
                      </div>
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

              .ios-download-but {
                display: flex;
                height: 56px;
                background: #000000;
                border: 2px solid #a6a6a6;
                box-sizing: border-box;
                border-radius: 8px;
                justify-content: center;
                align-items: center;
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
            `}</style>
          </div>
        )}
      </DownloadStateConsumer>
    );
  }
}
