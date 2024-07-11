import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";

export default class extends Component {
  componentDidMount() {}
  state = {
    mobileNum: "",
    mobileNuvplaceholder: "",
    smsDisable: false,
    smsButLabel: "Get SMS with Download link",
    sentSMSText: "",
  };
  handleSubmit = (e) => {
    var vm = this;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "Get_App_Link_SMS",
    });

    // gtag("event", "Send-SMS", {
    //   // hitType: "event",

    //   event_label:
    //     pageName === "/" ? "Home" : pageName.slice(1, pageName.length)

    //   // eventAction: "Download-Pro"
    // });
    e.preventDefault();
    var pageName = window.location.pathname;

    // gtag("event", "Sent SMS", {
    //   // hitType: "event",

    //   event_category: this.state.osType,
    //   event_label:
    //     pageName === "/" ? "Home" : pageName.slice(1, pageName.length)

    //   // eventAction: "Download-Pro"
    // });

    if (this.state.mobileNum.length === 10) {
      // vm.setState({
      //   smsDisable: true,
      //   smsButLabel: "SMS SENT",
      // });

      this.setState({
        sentSMSText: `We have sent the vpl App Download link to ${this.state.mobileNuvplaceholder}. Check your phone now!`,
      });

      let data = {
        To: vm.state.mobileNum,
        VAR1: this.getParams(window.location)["utm_sms"]
          ? parseInt(this.getParams(window.location)["utm_sms"])
          : "DEFAULT",
      };
      vm.setState({ mobileNum: "" });
      fetch("/api/applink", {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((result) => {
          result.json();
        })
        .then((res) => {});
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
        <div className="sms-form desktop">
          <form className="desktop" onSubmit={this.handleSubmit}>
            <div className="">
              <div className="inp-txt1">
                <label htmlFor="mobile">+91</label>

                <input
                  onChange={this.handleChange}
                  className="inp-box"
                  id="mobile"
                  type="number"
                  name="mobile"
                  minLength={10}
                  maxLength={10}
                  placeholder="Enter mobile number"
                  value={this.state.mobileNum}
                />
              </div>
            </div>
            <div className="getLinkSms">
              <input
                id="sms-but"
                disabled={this.state.smsDisable}
                type="submit"
                className="download-but"
                value={this.state.smsButLabel}
              />
            </div>
          </form>

          <div id="sms-msg" className="section-header--small">
            {this.state.sentSMSText}
          </div>
        </div>
        <style jsx>{`
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type="number"] {
            -moz-appearance: textfield;
          }
          #sms-form {
            margin-top: 56px;
            form {
              display: flex;
            }
            #sms-msg {
              margin-top: 24px;
            }
            .inp-txt1 {
              border-radius: 4px;
              background-color: #ffffff;
              // border: solid 1px rgba(0, 0, 0, 0.3);
              // height: 32px;
              width: 100%;
              display: flex;
            }
            .inp-txt1 > label {
              font-size: 12px;
              width: 37px;
              font-weight: normal;
              font-style: normal;
              font-stretch: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: center;
              color: #646464;
              line-height: 32px;
              background: #f0f0f0;
              border-bottom-left-radius: 4px;
              border-top-left-radius: 4px;
              border: 1px solid #b4b4b4;
              border-right: none;
              box-sizing: border-box;
            }
            .inp-txt1 > .inp-box {
              width: 140px;
              border: none;
              border-bottom-right-radius: 4px;
              border-top-right-radius: 4px;
              padding-left: 10px;
              background: #ffffff;
              color: #b4b4b4;
              font-size: 12px;
              line-height: 18px;
              border: 1px solid #b4b4b4;
              border-left: none;
              box-sizing: border-box;
            }
            input[type="number"]::-webkit-inner-spin-button,
            input[type="number"]::-webkit-outer-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }

            .download-but {
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
            .download-but img {
              vertical-align: middle;
            }
          }

          @media screen and (min-width: 768px) {
            #sms-form {
              .inp-txt1 > label {
                background: none;
                height: 50px;
                line-height: 50px;
                color: #222;
                font-size: 20px;
                width: 43px;
              }

              .download-but {
                font-size: 20px;
                height: 50px;
                width: 288px;
                margin-left: 15px;
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
    );
  }
}
