import React, { Component } from "react";

const JustButtonsComponent = (props) => (
  <div className="buttons--wrapper">
    <div className="button__box buttons__green">
      <a className="sms-but" target="_blank" href={props.googleFormLink}>
        <h3 className="button__text">{props.desktopBtnLableGoogleForm}</h3>
      </a>
    </div>
    <style jsx>{`
      .buttons--wrapper {
        display: flex;
        margin-top: 56px;
      }
      .button__box {
        background-color: transparent;
        height: 50px;
        width: 276px;
        font-size: 20px;
        border-radius: 4px;
      }
      .text--align--left {
        text-algin: left;
        border: solid 1px #828282;
      }
      .buttons__green {
        background-color: #19be00;
        border: solid 1px #19be00;
      }

      .buttons--wrapper .button__text {
        text-align: center;
        margin: 0px;
        line-height: 50px;
        color: #ffffff;
        opacity: 1 !important;
      }

      @media screen and (min-width: 768px) {
        .buttons--wrapper .button__text {
          text-align: center;
          margin: 0px;
          line-height: 50px;
          color: #ffffff;
          font-size: 20px !important;
        }
        .text--align--left {
          text-align: left !important;
        }
      }

      @media screen and (max-width: 767px) {
        .text--align--left {
          text-align: left !important;
        }
        .buttons--wrapper .button__text {
          text-align: center;
          margin: 0px;
          line-height: 50px;
          color: #ffffff;
          font-size: 12px !important;
        }
      }
    `}</style>
  </div>
);
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileNum: "",
      mobileNuvplaceholder: "",
      smsDisable: false,
      smsButLabel: this.props.defaultBtnLabel,
      sentSMSText: "",
      smsTextColor: "green",
    };
  }

  handleSubmit = (e) => {
    var vm = this;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "Get_App_Link_SMS",
    });

    e.preventDefault();
    var pageName = window.location.pathname;

    if (
      this.state.mobileNum && this.props.langauge === "id"
        ? this.state.mobileNum.length > 6 && this.state.mobileNum.length < 13
        : this.state.mobileNum.length === 10
    ) {
      this.setState({
        sentSMSText:
          this.props.langauge === "id"
            ? "Mengirim SMS ke " + this.state.mobileNum + " .... "
            : this.props.page !== "hindi-index"
            ? "sending sms to " + this.state.mobileNum + " ...."
            : "एसएमएस भेज रहा है " + this.state.mobileNum + " ....",
        smsTextColor: this.props.sendingCss
          ? this.props.sendingCss
          : "black--color",
      });

      let data = {
        To:
          this.props.langauge === "id"
            ? "+62" + vm.state.mobileNum
            : vm.state.mobileNum,
        VAR1: this.getParams(window.location)["utm_sms"]
          ? parseInt(this.getParams(window.location)["utm_sms"])
          : this.props.defaultSMSLinkText,
        pageName: this.props.pageName,
      };
      //vm.setState({ mobileNum: "" });
      fetch("/api/applink", {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((result) => result.json())
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              sentSMSText: this.props.sentText.replace(
                "#mobileno",
                this.state.mobileNum
              ),
              mobileNum: "",
              smsTextColor: this.props.successCss
                ? this.props.successCss
                : "black--color",
            });
          }
          if (res.status === 429) {
            this.setState({
              sentSMSText:
                this.props.langauge === "id"
                  ? "Terjadi masalah pengiriman. Coba beberapa saat lagi."
                  : "Something went wrong try again later",
              smsTextColor: this.props.errorCss
                ? this.props.errorCss
                : "red--color",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  handleChange = (evt) => {
    this.setState({
      mobileNum: evt.target.value,
      mobileNuvplaceholder: evt.target.value,
      sentSMSText: "",
    });
  };

  getParams = function (url) {
    var params = {};
    var parser = document.createElement("a");
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };
  render() {
    return (
      <div id="sms-form">
        {this.props.justButtons && this.props.justButtons ? (
          <JustButtonsComponent {...this.props} />
        ) : (
          <div
            className={this.props.tiktokClass ? "sms-form-tiktok" : "sms-form"}
          >
            <form className="desktop" onSubmit={this.handleSubmit}>
              <div
                className={` inp-txt1 ${
                  this.props.inputFieldBackgroundColor
                    ? this.props.inputFieldBackgroundColor
                    : " "
                }`}
              >
                {/* <label htmlFor="mobile">{this.props.countryMobileCode}</label> */}
                <input
                  onChange={this.handleChange}
                  className="inp-box"
                  id="mobile"
                  type="number"
                  name="mobile"
                  minLength={10}
                  maxLength={10}
                  // placeholder="Enter mobile number"
                  placeholder={this.props.mobileTxtboxPlaceholder}
                  value={this.state.mobileNum}
                />
              </div>

              <div className="getLinkSms">
                <input
                  id="sms-but"
                  type="submit"
                  className="download-but"
                  value={this.state.smsButLabel}
                />
              </div>
            </form>
            <div
              id="sms-msg"
              className={` section-header--small ${this.state.smsTextColor}`}
            >
              {/* SMS have been sent on your mobile number */}
              {this.state.sentSMSText}
            </div>
            <style jsx>{`
              .green--color {
                color: #19be00 !important;
              }
              .white--color {
                color: #fff !important;
                opacity: 0.6;
              }
              .red--color {
                color: #ff1e46 !important;
              }
              .black--color {
                color: #000 !important;
              }
              input::-webkit-outer-spin-button,
              input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
              .white-20 {
                background: rgba(255, 255, 255, 0.2) !important;
              }
              input[type="number"] {
                -moz-appearance: textfield;
              }
              #sms-msg {
                margin-top: 24px;
              }
              .inp-txt1 {
                border-radius: 4px;
                background-color: #ffffff;
                display: flex;
              }

              .inp-txt1 > label,
              .inp-txt1 > .inp-box {
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                letter-spacing: normal;
                border: 1px solid #b4b4b4;
                box-sizing: border-box;
              }

              .sms-form-tiktok {
                form {
                  align-content: center;
                }
                margin-top: 20px;
                .align-content {
                  align-content: start;
                }
                .inp-txt1 {
                  justify-content: center;
                }
                .inp-txt1 > label {
                  text-align: center;
                  line-height: 32px;
                  background: none;
                  height: 50px;
                  line-height: 50px;
                  color: #222;
                  font-size: 18px;
                  width: 43px;
                  border-bottom-left-radius: 4px;
                  border-top-left-radius: 4px;
                  border: 1px solid #b4b4b4;
                  border-right: none;
                }
                .inp-txt1 > .inp-box {
                  border-radius: 4px;
                  font-family: "TRIM";
                  padding-left: 10px;
                  background: #ffffff;
                  color: #b4b4b4;
                  font-size: 12px;
                  line-height: 18px;
                  height: 50px;
                  width: 352px;
                  font-size: 18px;
                  border-left: solid 1px #828282;
                }

                .download-but {
                  font-family: "TRIM";
                  cursor: pointer;
                  height: 50px;
                  border-left: solid 1px #828282;
                  border-radius: 4px;
                  background: #33ff66;
                  line-height: 28px;
                  letter-spacing: 0.01px;
                  text-align: center;
                  border: none;
                  font-weight: 600;
                  font-size: 24px;
                  color: #190a28;
                  padding: 12px 28px;
                }
                #sms-msg {
                  color: #19be00;
                }
              }
              .sms-form {
                margin-top: 56px;
                form {
                  display: flex;
                }
                .inp-txt1 > label {
                  font-size: 12px;
                  width: 37px;
                  text-align: center;
                  color: #646464;
                  line-height: 32px;
                  background: #f0f0f0;
                  border-bottom-left-radius: 4px;
                  border-top-left-radius: 4px;
                  border: 1px solid #b4b4b4;
                  border-right: none;
                }
                .inp-txt1 > .inp-box {
                  border-bottom-right-radius: 4px;
                  border-top-right-radius: 4px;
                  padding-left: 10px;
                  background: #ffffff;
                  color: #b4b4b4;
                  font-size: 12px;
                  line-height: 18px;
                  border-left: none;
                }
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }

                .download-but {
                  cursor: pointer;
                  height: 32px;
                  width: 120px;
                  border-radius: 4px;
                  background: #19be00;
                  font-family: Roboto;
                  font-size: 12px;
                  font-weight: 300;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 28px;
                  -webkit-letter-spacing: 0.01px;
                  -moz-letter-spacing: 0.01px;
                  -ms-letter-spacing: 0.01px;
                  letter-spacing: 0.01px;
                  text-align: center;
                  color: #ffffff;
                  border: none;
                  margin-left: 20px;
                }
              }

              @media screen and (min-width: 768px) {
                .sms-form {
                  .inp-txt1 > label {
                    background: none;
                    height: 50px;
                    line-height: 50px;
                    color: #222;
                    font-size: 20px;
                    width: 43px;
                  }

                  .download-but {
                    cursor: pointer;
                    font-size: 20px;
                    height: 50px;
                    width: 288px;
                  }
                  .inp-txt1 > .inp-box {
                    height: 50px;
                    width: 276px;
                    font-size: 20px;
                    border-left: solid 1px #828282;
                  }
                  #sms-msg {
                    color: #19be00;
                  }
                }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }
}
