import React, { Component } from "react";
class MoneyWithdraw extends Component {
  
  render() {
    const { header,paymentList } = this.props;
    return (
      <section className="money-withdraw-section">
        <div className="container">
          <div className="section-layout money-withdraw-layout">
            <div className="row">
              <h2 className="section-header section-header--large">
                {/* {paymentMode ? paymentMode.heading : ""} */}
                {header}
              </h2>
            </div>
            <div className="row money-withdraw">
              {paymentList.map((mode, key) => (
                    <div className="money-withdraw-tile" key={key}>
                      {/* <img
                        src={mode.imgLink}
                        alt={mode.text}
                        className="section-tile-image"
                      /> */}
                      <picture>
                        <source
                          srcSet={mode.imageurl.webp}
                          type="image/webp"
                        />
                        <source 
                            srcSet={mode.imageurl.png} 
                            type="image/png" 
                        />
                       <img
                          src={mode.imageurl.png}  
                          alt={mode.text} 
                          className="section-tile-image" 
                       />
                      </picture>
                      <h2>{mode.text}</h2>
                    </div>
                  ))
                    }
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .money-withdraw-section {
              background: #ffffff;
              .money-withdraw-layout {
                margin-bottom: -20px;
              }
              .section-header {
                margin-bottom: 8px;
              }
              .row {
                margin-bottom: 16px;
              }
            }
            .money-withdraw {
              .money-withdraw-tile {
                width: 25%;
                h2 {
                  font-size: 10px;
                  color: #4a4a4a;
                  margin: 8px 0;
                  font-weight: 400;
                }
              }
            }

            @media screen and (min-width: 768px) {
              .money-withdraw-section {
                .section-header {
                  margin-bottom: 30px;
                }
                .row {
                  margin-bottom: 0;
                }
              }

              .money-withdraw {
                .money-withdraw-tile {
                  h2 {
                    font-size: 14px;
                  }
                }
              }
            }

            @media screen and (min-width: 1224px) {
              .money-withdraw-section {
                .section-header {
                  margin-bottom: 64px;
                }
              }

              .money-withdraw {
                .money-withdraw-tile {
                  width: 16%;
                  h2 {
                    font-size: 20px;
                    margin-bottom: 5px;
                    margin-top: 0;
                  }
                }
              }
            }
          `}
        </style>
      </section>
    );
  }
}

export default MoneyWithdraw;
