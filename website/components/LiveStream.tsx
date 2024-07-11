import React, { Component } from "react";
import Head from "next/head";
import Modal from "react-modal";
import "../styles/modal.scss";
import ClevertapReact from "clevertap-react";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      phoneno: "",
      isvalidphone: false,
      phonesubmitted: false,
    };
  }

  componentDidMount() {
    ClevertapReact.initialize(this.props.config.config.CLAVERTAP_KEY);
  }

  handlePhoneInput = (e) => {
    const phoneno_regex = /^[6-9][0-9]{9}$/;
    this.setState({ phoneno: e.target.value });
    this.setState({ isvalidphone: phoneno_regex.test(e.target.value) });
  };

  submitPhoneInput = (e) => {
    if (
      this.state.phoneno.length == 0 ||
      (this.state.phoneno.length !== 0 && !this.state.isvalidphone)
    ) {
      return false;
    } else {
      let payload = {
        "Phone No": `+91${this.state.phoneno}`,
      };
      this.setState({ phonesubmitted: true,showModal :true });
      console.log("celevertab data");
      console.log(payload);
      ClevertapReact.event("CPL Livestream Data", payload);
    }
  };

  hideModal = (e) => {
    this.setState({ showModal: false,phonesubmitted:false,phoneno:'' });
  };

  render() {
    return (
      <React.Fragment>
        <Head>
          <title> Esports CPL Livestream</title>
        </Head>
        <div style={{position:'relative'}}>
          <div className="cpl-live-stream"></div>
          <div className="input-text-container">
            {!this.state.phonesubmitted && (
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  onChange={(event) => this.handlePhoneInput(event)}
                  maxLength="10"
                  className={
                    this.state.phoneno.length !== 0
                      ? !this.state.isvalidphone
                        ? "invalid-phone-no"
                        : "valid-phone-no"
                      : ""
                  }
                />
                <button onClick={(event) => this.submitPhoneInput(event)}>
                  {" "}
                  <img src="/static/2x/lock-icon.svg" />
                  Get SMS Notification
                </button>
              </div>
            )}
          </div>
          {this.state.phonesubmitted && (
          <Modal
            isOpen={this.state.showModal}
            onRequestClose={this.hideModal}
            contentLabel="List Modal"
            ariaHideApp={false}
            style={{
              overlay: {
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 10000,
                position: "fixed",
                left: "0",
                top: "0",
                width: "100%",
                height: "100%",
                overflow: "auto",
                animationName: "fadeIn",
                animationDuration: "0.4s",
              },
              content: {
                borderRadius: "16px 16px 0px 0px",
                position: "fixed",
                bottom: "0",
                width: "100%",
                animationName: "slideIn",
                animationDuration: "0.4s",
                padding: "32px",
                boxSizing: "border-box",
                top: "auto",
                left: "auto",
                right: "auto",
                overflow: "visible",
              },
            }}
          >
            <div className="input-modal-text-container">
              
                <div className="sucess-section">
                  <img src="/static/2x/sucess.svg" />
                  <h1>SMS Notification Set!</h1>
                  <p>
                    You will get an SMS notification when the Livestream is
                    about to start.
                  </p>
                  <button onClick={(event) => this.hideModal(event)}>
                    {" "}
                    Okay
                  </button>
                </div>
              
            </div>
          </Modal>
          )}
        </div>
        
        <style jsx global>
          {`
            .cpl-live-stream {
              background-image: url("/static/banners/cpl-livestream-360.png");
              height: 300px;
              background-repeat: no-repeat;
              background-size: 100%;
              background-position: top;
              display: flex;
              align-items: flex-end;
              justify-content: center;
              background-size: cover;
              background-position: center top;
              margin-top: 57px;
            }
            .input-container{
              padding:24px;
              background: linear-gradient(0deg, #FFFFFF, #FFFFFF), #230046;
              border-radius: 8px 0px 0px 8px;
              margin-left:8px;
            }
            .input-text-container {
              width: 100%;
              padding: 0 0 0 1px;
              background: #190A28;
              box-sizing: border-box;
              input[type="text"] {
                padding: 4px;
                width: 100%;
                display: block;
                border: 1px solid rgba(25, 10, 40, 0.6);
                border-radius: 4px;
                padding: 16px;
                height: 56px;
                box-sizing: border-box;
                margin-bottom: 16px;
                &.invalid-phone-no {
                  border: solid 1px red;
                }
              }
             
            }

            button {
                background: #e91051;
                border-radius: 4px;
                font-weight: 500;
                font-size: 16px;
                height: 48px;
                line-height: 24px;
                color: #ffffff;
                padding: 12px 32px;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                cursor: pointer;
                border: none;
                img {
                  margin-right: 6px;
                }
              }

            .sucess-section {
              text-align: left;
              h1 {
                font-size: 24px;
                line-height: 32px;
              }
              p {
                font-size: 14px;
                line-height: 20px;
                color: rgba(25, 10, 40, 0.6);
              }
            }

            @media screen and (min-width: 361px) {
              .cpl-live-stream {
                background-image: url("/static/banners/cpl-livestream-361.png");
              }
            }

            @media screen and (min-width: 600px) {
              .cpl-live-stream {
                height: 600px;
              }
            }
            @media screen and (min-width: 1224px) {
              .cpl-live-stream {
                background-image: url("/static/banners/cpl-livestream-desktop.png");
                height: 600px;
                background-repeat: no-repeat;
                background-size: cover;
              }
              .input-text-container {
               
                position: absolute;
                bottom: 0;
                width: 421px;
                left: 63px;
                height: 192px;
                background:none;
                .input-container{
                    border-radius:8px;
                    margin:0;
                }

                input[type="text"] {
                  margin-bottom: 30px;
                }
              }
              .sucess-section {
                text-align: center;
              }
            }

            @media screen and (-webkit-min-device-pixel-ratio:0) { 
                select,
                textarea,
                input {
                  font-size: 16px;
                }
              }
          `}
        </style>
      </React.Fragment>
    );
  }
}
