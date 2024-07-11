import React, { Component } from "react";
import DownloadButtonBanner from "../components/DownloadButtonBanner";
import DownloadButtonCheckbox from "../components/DownloadButtonCheckbox";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDownload: props.showDownload,
      btnTxt: props.rewardText,
      osType: props.device,
      btnImg: props.downloadImageurl,
    };
  }

  componentDidMount() {
    var vm = this;
    if (
      (this.props.page === "esports-cpl" ||
        this.props.alwaysVisible === true) &&
      this.props.device !== "desktop"
    )
      document.getElementById("download-but").style.display = "block";
    if (this.props.page !== "esports-cpl") {
      let self = this;
      window.onscroll = function () {
        if (self.props.alwaysVisible === true) return false;
        // print "false" if direction is down and "true" if up
        try {
          if (this.scrollY > 100) {
            document.getElementById("download-but").style.display = "block";
          } else {
            // if(!this.props.page || ( this.props.page && this.props.page !== "esports-cpl"))
            document.getElementById("download-but").style.display = "none";
          }
        } catch (error) {}
        this.oldScroll = this.scrollY;
      };
    }

    if (this.props.referralData) {
      this.setState({
        btnImg: this.props.downloadImageurl,
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
      let language = config.LANG_CODE;
      let cashBonus = config.referral
        ? config.referral.cashBonus
        : config.REWARDS.cashBonus;
      let cash = "";
      // language === "id"
      //   ? (cash = `${cashBonus} ${this.props.rewardsBar.currency}`)
      //   : (cash = `${this.props.rewardsBar.currency}${cashBonus}`);
      language === "id"
        ? (cash = `${cashBonus} ${this.props.rewardsBar.currency}`)
        : (cash = `${this.props.rewardsBar.currency}${
            this.props.page === "home" ||
            this.props.page === "lp/fantasy-cricket" ||
            this.props.page == "fantasy"
              ? 50
              : cashBonus
          }`);

      if (config.referral) {
        text = `${this.props.rewardsBar.joiningBonusText} ${cash} + ${config.referral.tokenBonus} ${this.props.rewardsBar.tokenFreeText}`;
      } else {
        if (config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `${this.props.rewardsBar.joiningBonusText} ${cash} + ${config.REWARDS.tokenBonus} ${this.props.rewardsBar.tokenFreeText}`;
        } else if (config.REWARDS.cashBonus && !config.REWARDS.tokenBonus) {
          text = `${this.props.rewardsBar.joiningBonusText} ${cash} ${this.props.rewardsBar.freeText}`;
        } else if (!config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `${this.props.rewardsBar.joiningBonusText} ${config.REWARDS.tokenBonus} ${this.props.rewardsBar.tokenFreeText}`;
        } else {
          text = "";
        }
      }
      return text;
    };
    return (
      <div>
        {this.state.showDownload &&
        this.props.device &&
        this.props.device !== "desktop" ? (
          <div>
            <div id="download-but">
              <div id="msg" className="mobile">
                {this.props.config ? getText(this.props.config.config) : ""}
              </div>
              <div id="bar" className="bar gradient stripe color4 mobile">
                <span className="animate" />
              </div>
              {this.props.hideDownloadButton &&
              this.props.hideDownloadButton === "true" ? (
                ""
              ) : (
                <div id="sticky-but" className={`mobile ${this.props.page}`}>
                  {this.props.page === "esports-cpl" &&
                  this.props.device === "android" ? (
                    <span style={{ padding: "5px" }}></span>
                  ) : (
                    this.props.page === "esports-cpl" && (
                      <span className="warning">
                        {this.props.iosEsportMessage}
                      </span>
                    )
                  )}
                  <div id="sticky-button">
                    {this.props.page !== "vpl-games-generic" ? (
                      <DownloadButtonBanner
                        device={this.props.device}
                        browser={this.props.browser}
                        config={this.props.config}
                        buttonPosition="bottom"
                        showDownload={this.state.showDownload}
                        page={this.props.page}
                      />
                    ) : (
                      <DownloadButtonCheckbox
                        device={this.props.device}
                        browser={this.props.browser}
                        config={this.props.config}
                        buttonPosition="bottom"
                        showDownload={this.state.showDownload}
                        page={this.props.page}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
            <div id="sticky-layer" />
          </div>
        ) : (
          ""
        )}
        <style global jsx>{`
          #download-but {
            display: none;
            z-index: 3;
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
            &.vpl-games-generic {
              padding-bottom: 27px;
            }
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

          #sticky-but.esports-cpl {
            padding-top: 0;
            .section-layout {
              padding: 0;
              .tournament-start-info {
                padding: 7px 0;
              }
            }
          }
          .warning {
            color: #ff6d00;
            font-size: 12px;
            line-height: 16px;
            font-weight: normal;
            padding: 9px 0;
          }
        `}</style>
      </div>
    );
  }
}
