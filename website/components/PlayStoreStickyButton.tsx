// import { butTxt, butnum } from "../configs/home_data";
import * as imgRef from "../configs/images";

import React, { Component } from "react";
import osType from "../configs/detectOs";
export default class extends Component {
  state = {
    showDownload: false,
    btnTxt: "Install the vpl Pro App & Get 50 tokens!",
    btnLabel: "DOWNLOAD vpl PRO APP",
    btnImg: imgRef.IC_DOWNLOAD,
  };
  componentDidMount() {
    this.setState({
      osType: osType(),
      showDownload: true,
    });
    if (this.props.referralData) {
      this.setState({
        btnImg: imgRef.IC_DOWNLOAD,
      });
      if (
        this.props.referralData.cashBonus &&
        !this.props.referralData.tokenBonus
      ) {
        this.setState({
          btnTxt: `Install the vpl Pro App & Get ₹${this.props.referralData.cashBonus} Free!`,
        });
      }

      if (
        this.props.referralData.tokenBonus &&
        !this.props.referralData.cashBonus
      ) {
        this.setState({
          btnTxt: `Install the vpl Pro App & Get ${this.props.referralData.tokenBonus} tokens!`,
        });
      }
      if (
        this.props.referralData.cashBonus &&
        this.props.referralData.tokenBonus
      ) {
        this.setState({
          btnTxt: `Install the vpl Pro App & Get ₹${this.props.referralData.cashBonus} + ${this.props.referralData.tokenBonus} vpl Tokens Free!`,
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
    const copy_referral = () => {
      var pageName = window.location.pathname;

      gtag("event", "Download-Pro", {
        // hitType: "event",

        event_category: this.state.osType,
        event_label:
          pageName === "/" ? "Home" : pageName.slice(1, pageName.length),

        // eventAction: "Download-Pro"
      });

      // fbq  ("track", "Download-Pro");
      //   if (this.state.osType === "android") {
      //     document
      //       .getElementById("sticky-layer")
      //       .setAttribute("style", "display:block");
      //     // document
      //     //   .getElementById("sticky-button")
      //     //   .setAttribute("class", "downloading");
      //     document.getElementById("msg").setAttribute("style", "display: none;");
      //     document.getElementById("bar").setAttribute("style", "display: block;");
      //     document
      //       .getElementById("copyright")
      //       .setAttribute("style", "margin-bottom: 90px;");

      //     this.setState({
      //       btnTxt: "Check notification to see the Download status",
      //       btnLabel: "DOWNLOADING APP",
      //       btnImg: imgRef.IC_DOWNLOADING,
      //       downloading: true
      //     });

      //     window.location.hash = "steps";
      //     let steps = document.getElementById("steps");
      //     window.scroll({
      //       behavior: "smooth",
      //       left: 0,
      //       top: steps.offsetTop
      //     });
      //   }

      if (this.props.referralData !== undefined) {
        var $body = document.getElementsByTagName("body")[0];
        var $tempInput = document.createElement("INPUT");
        $body.appendChild($tempInput);
        $tempInput.setAttribute(
          "value",
          `vpl::${this.props.referralData.referralCode}::WEB`
        );
        $tempInput.select();
        document.execCommand("copy");
        $body.removeChild($tempInput);
      } else {
      }
    };
    return (
      <div>
        {this.state.showDownload ? (
          <div>
            <a
              id="download-but"
              onClick={copy_referral}
              href={
                this.state.osType === "android"
                  ? "https://getvpl.com/iMeibzcTLV"
                  : "itms-apps://itunes.apple.com/us/app/vpl-mobile-premier-league/id1447849626?ls=1&mt=8"
              }
              download="file"
            >
              <div id="msg" className="mobile">
                {this.state.btnTxt}
              </div>
              <div id="bar" className="bar gradient stripe color4 mobile">
                <span className="animate" />
              </div>
              <div id="sticky-but" className="mobile">
                <div id="sticky-button">
                  {/* <span>
                    <img src={this.state.btnImg} alt="" />
                  </span>

                  <span>{this.state.btnLabel}</span> */}
                  {!this.state.downloading ? (
                    <img
                      width={this.state.osType === "android" ? "60%" : "80%"}
                      src={
                        this.state.osType === "android"
                          ? imgRef.APP_STORE_PLAY_STORE_MOBILE
                          : imgRef.APP_STORE_IOS_MOBILE
                      }
                      alt=""
                    />
                  ) : (
                    ""
                    // <div id="download-but-new">
                    //   <div>
                    //     <img src={imgRef.IC_DOWNLOAD} alt="" />
                    //   </div>
                    //   <div>DOWNLOAD APP & GET</div>{" "}
                    //   <div>
                    //     <img id="coin" src={imgRef.IC_COIN} alt="" />
                    //   </div>
                    //   <div>20</div>{" "}
                    // </div>
                    // <div id="download-but-new">
                    //   <div>
                    //     <img src={imgRef.IC_DOWNLOAD} alt="" />
                    //   </div>
                    //   <div>DOWNLOADING ...</div>{" "}
                    //   <div>
                    //     {/* <img id="coin" src={imgRef.IC_COIN} alt="" /> */}
                    //   </div>
                    // </div>
                  )}
                  {/* <span>{props.referral ? "" : props.lang.butnum}</span> */}
                  {/* osType() === "android"
                        ? imgRef.APP_STORE_ANDROID_MOBILE
                        : */}
                </div>

                <style global jsx>{`
                  #copyright {
                    margin-bottom: 100px;
                  }
                  #currency {
                    margin-left: 5px;
                  }
                `}</style>
              </div>
            </a>
            <div id="sticky-layer" />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
// export default StickyButton;
