import React, { Component } from "react";

export default class extends Component {
    constructor () {
        super();
        this.state = { imgRef: false };
    }

  render() {
    return (
        <React.Fragment>
          <div id="payout">
              <h2>Withdraw Winnings Instantly</h2>
              <div className="payout-icons">
                  <div className="payout-icon">
                      <img src={this.props.imgRef.PAYOUT_ICON_PAYTM} />
                      <span>Paytm Wallet</span>
                  </div>
                  <div className="payout-icon">
                      <img src={this.props.imgRef.PAYOUT_ICON_AMAZON} />
                      <span>Amazon Pay</span>
                  </div>
                  <div className="payout-icon">
                      <img src={this.props.imgRef.PAYOUT_ICON_UPI} />
                      <span>UPI</span>
                  </div>
                  <div className="payout-icon">
                      <img src={this.props.imgRef.PAYOUT_ICON_BANK} />
                      <span>Bank Transfer</span>
                  </div>
              </div>
          </div>
        <style jsx>{`
            #payout {
                padding: 24px 0;
                h2 {
                    font-weight: 500;
                }
                .payout-icons {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    flex-basis: auto;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    margin-left: -30px;
                }
                .payout-icon {
                    position: relative;
                    flex-basis: auto;
                    margin-left: 60px;

                    img {

                    }

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
               #payout {
                padding: 24px 0;

                h2 {
                    font-style: normal;
                    font-weight: bold;
                    font-size: 16px;
                    line-height: 20px;
                }
                .payout-icons {
                    display: flex;
                    flex-direction: row;
                    align-items: flex-end;
                    justify-content: space-evenly;
                    margin: 16px 30px 0 30px;
                }
                .payout-icon {
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
