import { DownloadStateConsumer } from "../components/DownloadState";
import React, { Component } from "react";
import NewDownlaodButton from "./NewDownlaodButton";
import DownloadButtonBanner from "../components/DownloadButtonBannerStatic";
import * as imgRef from "../configs/images";

export default class extends Component {
  // state = {
  //   showDownload: false,
  //   btnTxt: "Joining Bonus: Get 50 tokens!",
  //   btnLabel: "DOWNLOAD vpl PRO APP",
  //   btnImg: imgRef.IC_DOWNLOAD
  // };

  constructor(props) {
    super(props);
    //If on server and if we have this.props.device available
    // this.imgRef = require('../configs/images')(props.browser)
    this.state = {
      showDownload: true,
      btnTxt: "Joining Bonus: Get 50 tokens!",
      btnLabel: "DOWNLOAD vpl PRO APP",
      osType: props.device,
      btnImg: imgRef.IC_DOWNLOAD,
    };
  }

  componentDidMount() {
    var vm = this;
    window.onscroll = function () {
      // print "false" if direction is down and "true" if up
      try {
        if (this.scrollY > 100) {
          document.getElementById("download-but").style.display = "block";
        } else {
          document.getElementById("download-but").style.display = "none";
        }
      } catch (error) {}

      this.oldScroll = this.scrollY;
    };

    if (this.props.referralData) {
      this.setState({
        btnImg: imgRef.IC_DOWNLOAD,
      });
      if (
        this.props.referralData.cashBonus &&
        !this.props.referralData.tokenBonus
      ) {
        this.setState({
          btnTxt: `Joining Bonus: Get ₹${this.props.referralData.cashBonus} Free!`,
        });
      }

      if (
        this.props.referralData.tokenBonus &&
        !this.props.referralData.cashBonus
      ) {
        this.setState({
          btnTxt: `Joining Bonus: Get ${this.props.referralData.tokenBonus} tokens!`,
        });
      }
      if (
        this.props.referralData.cashBonus &&
        this.props.referralData.tokenBonus
      ) {
        this.setState({
          btnTxt: `Joining Bonus: Get ₹${this.props.referralData.cashBonus} + ${this.props.referralData.tokenBonus} vpl Tokens Free!`,
        });
      }
    } else {
      // this.setState({
      //   btnLabel: this.props.lang.butTxt,
      //   btnTxt: this.props.lang.STICKY_MSG,
      //   btnImg: imgRef.IC_DOWNLOAD
      // });
    }
  }
  render() {
    const getText = (config) => {
      let text = "";
      if (config.referral) {
        text = `Joining Bonus: Get ₹${config.referral.cashBonus} + ${config.referral.tokenBonus} vpl Tokens Free!`;
      } else {
        if (config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} + ${config.REWARDS.tokenBonus} vpl Tokens Free!`;
        } else if (config.REWARDS.cashBonus && !config.REWARDS.tokenBonus) {
          text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} Free!`;
        } else if (!config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `Joining Bonus: Get ${config.REWARDS.tokenBonus} vpl Tokens Free!`;
        } else {
          text = "";
        }
      }
      return text;
    };
    return (
      // <DownloadStateConsumer>
      //   {({ currentState, changeState, config }) => (
      <div>
        {this.state.showDownload &&
        this.props.device &&
        this.props.device !== "desktop" ? (
          <div>
            <div id="download-but">
              <div id="msg" className="mobile">
                {this.props.config ? getText(this.props.config.config) : ""}
                {/* Joining Bonus: Get ₹{config.config.REWARDS.cashBonus} + {config.config.REWARDS.tokenBonus} vpl Tokens Free! */}
              </div>
              <div id="bar" className="bar gradient stripe color4 mobile">
                <span className="animate" />
              </div>
              <div id="sticky-but" className="mobile">
                <div id="sticky-button">
                  <DownloadButtonBanner
                    device={this.props.device}
                    browser={this.props.browser}
                    config={this.props.config}
                    buttonPosition="bottom"
                  />
                </div>
              </div>
            </div>
            <div id="sticky-layer" />
          </div>
        ) : (
          ""
        )}
        <style global jsx>{`
          #download-but {
            display: none;
            z-index: 100;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.15);
          }
          #msg {
            padding: 5px;
            width: 100%;
            font-stretch: condensed;
            text-align: center;
            background-color: #ffe500;
            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 18px;
            text-align: center;
            color: #222222;
          }
          #sticky-but {
            background-color: #ffffff;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            padding: 16px 24px;
            a {
              cursor: pointer;
            }

            #sticky-button {
              width: 100%;
              text-transform: uppercase;
              text-decoration: none;
              display: flex;
              justify-content: center;
              align-items: center;

              > div {
                width: inherit;
                #download-but-new {
                  border: none;
                  box-sizing: unset;
                  box-shadow: none;
                }
              }
            }
          }
          #sticky-layer {
            width: 100%;
            height: 100px;
            margin-top: -100px;
            z-index: 1000;
            position: fixed;
            bottom: 0;
            left: 0;
            display: none;
          }
          #bar {
            display: none;
            position: fixed;
            bottom: 80px;
            transform: rotate(180deg);
          }
          .bar {
            width: 100%;
          }
          .color4 > span {
            background-color: #b4ec51;
            display: block;
            height: 10px;
            width: 100%;
          }

          .animate {
            animation: progress 2s linear infinite;
            -moz-animation: progress 2s linear infinite;
            -webkit-animation: progress 2s linear infinite;
            -ms-animation: progress 2s linear infinite;
            -o-animation: progress 2s linear infinite;
          }
          .stripe > span {
            background-size: 30px 30px;
            -moz-background-size: 30px 30px;
            -webkit-background-size: 30px 30px;
            -o-background-size: 30px 30px;

            background-image: -moz-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.15) 25%,
              rgba(255, 255, 255, 0) 25%,
              rgba(255, 255, 255, 0) 50%,
              rgba(255, 255, 255, 0.15) 50%,
              rgba(255, 255, 255, 0.15) 75%,
              rgba(255, 255, 255, 0) 75%,
              rgba(255, 255, 255, 0) 100%
            );
            background-image: -webkit-gradient(
              linear,
              left top,
              right bottom,
              color-stop(0%, rgba(255, 255, 255, 0.2)),
              color-stop(25%, rgba(255, 255, 255, 0.2)),
              color-stop(25%, rgba(255, 255, 255, 0)),
              color-stop(50%, rgba(255, 255, 255, 0)),
              color-stop(50%, rgba(255, 255, 255, 0.2)),
              color-stop(75%, rgba(255, 255, 255, 0.2)),
              color-stop(75%, rgba(255, 255, 255, 0)),
              color-stop(100%, rgba(255, 255, 255, 0))
            );
            background-image: -webkit-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.3) 0%,
              rgba(255, 255, 255, 0.3) 25%,
              rgba(255, 255, 255, 0) 25%,
              rgba(255, 255, 255, 0) 50%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0.3) 75%,
              rgba(255, 255, 255, 0) 75%,
              rgba(255, 255, 255, 0) 100%
            );
            background-image: -o-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.15) 25%,
              rgba(255, 255, 255, 0) 25%,
              rgba(255, 255, 255, 0) 50%,
              rgba(255, 255, 255, 0.15) 50%,
              rgba(255, 255, 255, 0.15) 75%,
              rgba(255, 255, 255, 0) 75%,
              rgba(255, 255, 255, 0) 100%
            );
            background-image: -ms-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.15) 25%,
              rgba(255, 255, 255, 0) 25%,
              rgba(255, 255, 255, 0) 50%,
              rgba(255, 255, 255, 0.15) 50%,
              rgba(255, 255, 255, 0.15) 75%,
              rgba(255, 255, 255, 0) 75%,
              rgba(255, 255, 255, 0) 100%
            );
            background-image: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.15) 25%,
              rgba(255, 255, 255, 0) 25%,
              rgba(255, 255, 255, 0) 50%,
              rgba(255, 255, 255, 0.15) 50%,
              rgba(255, 255, 255, 0.15) 75%,
              rgba(255, 255, 255, 0) 75%,
              rgba(255, 255, 255, 0) 100%
            );
          }

          @-webkit-keyframes progress {
            from {
              background-position: 0 0;
            }
            to {
              background-position: -60px -60px;
            }
          }
          @-moz-keyframes progress {
            from {
              background-position: 0 0;
            }
            to {
              background-position: -60px -60px;
            }
          }
          @-ms-keyframes progress {
            from {
              background-position: 0 0;
            }
            to {
              background-position: -60px -60px;
            }
          }
          @-o-keyframes progress {
            from {
              background-position: 0 0;
            }
            to {
              background-position: -60px -60px;
            }
          }
          @keyframes progress {
            from {
              background-position: 0 0;
            }
            to {
              background-position: -60px -60px;
            }
          }
        `}</style>
      </div>
      //   )}
      // </DownloadStateConsumer>
    );
  }
}
