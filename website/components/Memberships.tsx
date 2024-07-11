import React, { Component } from "react";

export default class extends Component {
  constructor () {
      super();
      this.state = { imgRef: false };
  }

  render() {
    const renderLandingTrust = () => {
      if(this.props.showLandingTrust) {
        return (
          <div id="abt1">
            <img className="icnimg" src={this.props.imgRef.LANDING_TRUST} />
          </div>
        );
      }
    }

    return (
      <React.Fragment>
        <div id="memberships">
          <div className="memberships-icons">
            <div className="memberships-icon">
              <img src={this.props.imgRef.MEMBERSHIP_ICON_TRF} />
            </div>
            <div className="memberships-icon">
              <img src={this.props.imgRef.MEMBERSHIP_ICON_AIGF} />
            </div>
            <div className="memberships-icon">
              <img src={this.props.imgRef.MEMBERSHIP_ICON_IAMAI} />
            </div>
          </div>
        </div>
        {renderLandingTrust()}
        <style jsx>{`
          #memberships {
            padding: 24px 0;

            .memberships-icons {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              flex-basis: auto;
              margin-top: 20px;
              margin-bottom: 10px;
              margin-left: -30px;
            }
            .memberships-icon {
              position: relative;
              flex-basis: auto;
              margin-left: 60px;

              span {
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                justify-content: space-evenly;
                font-size: 12px;
                line-height: 14px;
                color: #828282;
              }
            }
          }

          a {
            text-decoration: none;
          }

          @media (max-width: 786px) {
            #memberships {
              padding: 24px 0;

              .memberships-icons {
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                justify-content: space-evenly;
                margin: 16px 30px 0 30px;
              }
              .memberships-icon {
                position: relative;
                margin-left: 0;

                img {
                  height: 60%;
                  width: 60%;
                  padding-bottom: 8px;
                }

                span {
                  display: flex;
                  flex-direction: row;
                  align-items: flex-end;
                  justify-content: space-evenly;
                  font-style: normal;
                  font-weight: normal;
                  font-size: 10px;
                  line-height: 14px;
                  color: #828282;
                }
              }
            }

            a {
              text-decoration: none;
            }
          }
        `}</style>
      </React.Fragment>

    );
  }
}
