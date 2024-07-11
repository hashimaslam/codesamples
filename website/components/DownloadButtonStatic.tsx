import * as imgRef from "../configs/images";
import { DownloadStateConsumer } from "../components/DownloadState";
import React, { Component } from "react";
import osType from "../configs/detectOs";
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDownload: true,
      btnTxt: "Install the vpl Pro App & Get 20 tokens!",
      btnLabel: "DOWNLOAD vpl PRO APP",
      btnImg: imgRef.IC_DOWNLOAD,
      osType: this.props.device ? this.props.device : "",
    };
  }
  componentDidMount() {
    this.setState({
      osType: osType(),
    });
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
                        // onClick={copy_referral}
                        onClick={() => {
                          this.performTwoAction(changeState);
                        }}
                        //onClick = {this.pixelSetup}
                        // href={
                        //   this.state.osType === "android"
                        //     ? this.props.APP_URL
                        //     : "itms-apps://itunes.apple.com/us/app/vpl-mobile-premier-league/id1447849626?ls=1&mt=8"
                        // }
                        // download="file"
                      >
                        <div
                          id="download-but-new"
                          style={
                            this.props.pwaEnabled ? { marginTop: "-20vh" } : {}
                          }
                        >
                          <div>
                            <img src={imgRef.ANDROID_DOWNLOAD_MOBILE} alt="" />
                          </div>
                          <div className="download-text">
                            <span
                              style={{ fontSize: "10px", textAlign: "left" }}
                            >
                              Download our
                            </span>
                            <div className="installbtn">
                              <span>ANDROID APP</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <a
                        onClick={() => {
                          this.performTwoAction(changeState);
                        }}
                      >
                        <div id="download-but-new">
                          <div>
                            <img src={imgRef.IC_DOWNLOAD} alt="" />
                          </div>
                          <div>DOWNLOADING ...</div>{" "}
                          <div>
                            {/* <img id="coin" src={imgRef.IC_COIN} alt="" /> */}
                          </div>
                        </div>
                      </a>
                    )}
                  </React.Fragment>
                ) : (
                  <a
                    onClick={() => {
                      this.performTwoAction(changeState);
                    }}
                  >
                    <img
                      id="ios_app"
                      width={"90%"}
                      src={imgRef.APP_STORE_IOS_MOBILE}
                      alt=""
                    />
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
                font-size: 14px;
                line-height: 18px;
                font-weight: bold;
                // font-style: italic;
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
              @media (max-width: 786px) {
                @keyframes shimmerBackground {
                  0% {
                    background-position: -5000px 0;
                  }
                  100% {
                    background-position: 5000px 0;
                  }
                }
                #ios_app {
                  /* position: absolute;
                  margin-top: -11vh; */
                }

                #download-but-new {
                  p {
                    display: flex;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 10px;
                    line-height: 14px;
                  }
                  display: flex;
                  width: 85vw;
                  height: 15vw;
                  color: #fff;
                  font-size: 16px;
                  align-items: center;
                  justify-content: center;
                  background: #000000;
                  border: 2px solid #a6a6a6;
                  box-sizing: border-box;
                  border-radius: 8px;
                  color: #fff;
                  font-size: 16px;
                  background: #000000;
                  background-image: linear-gradient(
                    -40deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.22) 50%,
                    rgba(255, 255, 255, 0) 100%
                  );
                  animation: shimmerBackground 35s linear infinite;
                  align-items: center;
                  justify-content: center;
                  text-transform: none;
                  #coin {
                    margin-left: 5px;
                    margin-right: 5px;
                  }
                  img {
                    width: 14px;
                    height: 17px;
                    margin: 0 9px;
                    vertical-align: middle;
                  }
                  .download-text {
                    display: flex;
                    flex-direction: column;
                    font-weight: bold;
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
