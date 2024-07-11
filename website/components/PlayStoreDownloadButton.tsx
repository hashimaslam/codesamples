// import { butTxt, butnum } from "../configs/home_data";
import * as imgRef from "../configs/images";
import { DownloadStateConsumer } from "../components/DownloadState";
import React, { Component } from "react";
import osType from "../configs/detectOs";
export default class extends Component {
  state = {
    showDownload: false,
    btnTxt: "Install the vpl Pro App & Get 20 tokens!",
    btnLabel: "DOWNLOAD vpl PRO APP",
    btnImg: imgRef.IC_DOWNLOAD,
  };
  componentDidMount() {
    this.setState({
      osType: osType(),
      showDownload: true,
    });
    // if (this.props.referralData) {
    //   this.setState({
    //     btnImg: imgRef.IC_DOWNLOAD
    //   });
    //   if (
    //     this.props.referralData.cashBonus &&
    //     !this.props.referralData.tokenBonus
    //   ) {
    //     this.setState({
    //       btnTxt: `Install the vpl Pro App & Get ₹${
    //         this.props.referralData.cashBonus
    //       } Free!`
    //     });
    //   }

    //   if (
    //     this.props.referralData.tokenBonus &&
    //     !this.props.referralData.cashBonus
    //   ) {
    //     this.setState({
    //       btnTxt: `Install the vpl Pro App & Get ${
    //         this.props.referralData.tokenBonus
    //       } tokens!`
    //     });
    //   }
    //   if (
    //     this.props.referralData.cashBonus &&
    //     this.props.referralData.tokenBonus
    //   ) {
    //     this.setState({
    //       btnTxt: `Install the vpl Pro App & Get ₹${
    //         this.props.referralData.cashBonus
    //       } + ${this.props.referralData.tokenBonus} vpl Tokens Free!`
    //     });
    //   }
    // } else {
    // }
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
                        <button
                          style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 8,
                            paddingBottom: 8,
                            background: "#00865E",
                            color: "white",
                            display: "flex",
                          }}
                          // onClick={()=>{this.performTwoAction(changeState)}}
                        >
                          INSTALL
                        </button>
                      </a>
                    ) : (
                      <button
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          paddingTop: 8,
                          paddingBottom: 8,
                          background: "#00865E",
                          color: "white",
                          display: "flex",
                        }}
                        // onClick={()=>{this.performTwoAction(changeState)}}
                      >
                        DOWNLOADING ...
                      </button>
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
                }
              }
              @media (max-width: 786px) {
                #ios_app {
                  /* position: absolute;
                  margin-top: -11vh; */
                }

                #download-but-new {
                  display: flex;
                  width: 85vw;
                  height: 15vw;
                  border-radius: 8px;
                  border: solid 1px #4fba00;
                  font-weight: bold;
                  background-image: linear-gradient(
                    to bottom,
                    #a4cf00,
                    #33cc00
                  );
                  color: #fff;
                  font-size: 16px;
                  align-items: center;
                  justify-content: center;
                  #coin {
                    margin-left: 5px;
                    margin-right: 5px;
                  }
                  img {
                    width: 25px;
                    margin: 0 5px;
                    vertical-align: middle;
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
