import { DownloadStateConsumer } from "./DownloadState";
import React, { Component } from "react";
import * as imgRef from "../configs/images";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDownload: props.showDownload,
      osType: props.device,
    };
  }

  openForm(changeState) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
     this.props.googleFormLink
    );
    element.setAttribute("target", "_blank");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  render() {
    if(this.props.hideInDesktop && this.props.hideInDesktop===true && this.state.osType==="desktop")
      return "";
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config, keysToComponentMap }) => (
          <div className="action-button-section">
            {this.state.showDownload ? (
              <div>
                <React.Fragment>
                  <a
                    onClick={() => {
                      this.openForm();
                    }}
                  >
                    <div className="android-action-but">
                      <h2>{this.props.androidBtnLabel}</h2>
                      <img
                        className="download-icon"
                        src={this.props.greenRightArrowIcon.imageurl.png}
                        alt={this.props.greenRightArrowIcon.altText}
                      />
                    </div>
                  </a>
                </React.Fragment>
              </div>
            ) : (
              ""
            )}
            <style jsx>{`
              .android-action-but {
                margin:  24px;
                border: 1px solid #20b11d;
                box-sizing: border-box;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                height: 44px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 16px;
                cursor: pointer;
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
                  width: 14px;
                  height: 17px;
                  margin: 0 0 0 10px;
                }
              }

              @media screen and (min-width: 1224px) {
                .action-button-section {
                  width: 50%;
                  margin: auto;
                }
                .android-action-but {
                  height: 55px;
                  border: 2px solid #20b11d;
                  h2 {
                    font-size: 18px;
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
