import { DownloadStateConsumer } from "../components/DownloadState";
import { getHTML } from "../configs/util";
const OfferSticker = (props) => {
  const performTwoAction = (changeState) => {
    //changeState();
  };
  return (
    <DownloadStateConsumer>
      {({ currentState, changeState, config, keysToComponentMap }) => (
        <section
          className={`offer-sticker-section ${
            props.device !== "desktop"
              ? props.position === "bottom"
                ? "hide"
                : "show"
              : props.position === "bottom"
              ? "show"
              : "hide"
          } ${props.cssClassList ? props.cssClassList.join(" ") : ""}`}
          onClick={(e) => {
            props.device !== "desktop" ? performTwoAction(changeState) : "";
          }}
        >
          <div className="container">
            <div className="section-layout">
              <div className="row">
                <div className="offer-sticker-container">
                  <h2 className="banner-title">
                    Own the Indian Cricket Team’s Jersey!
                  </h2>

                  {/* <div className="offer-text">
                    <h2>{props.header}</h2>
                    {props.offerType && props.offerType === "vpl-sports" ? (
                      <div className="offer-content">
                        <span className="offer-subheader">
                          {props.offerText}{" "}
                        </span>
                        <span className="action-link">
                          {" "}
                          {getHTML(props.offerLink)}
                        </span>
                      </div>
                    ) : (
                      <button>{props.offerButtonText}</button>
                    )}
                  </div> */}

                  <div className="offer-sticker">
                    <picture>
                      <source
                        srcSet={props.stickerImageUrl.webp}
                        type="image/webp"
                      />
                      <source
                        srcSet={props.stickerImageUrl.png}
                        type="image/png"
                      />

                      <img
                        className="sticker"
                        src={props.stickerImageUrl.png}
                        alt={"vpl IPL offer"}
                      />
                    </picture>
                  </div>
                  <div className="buy-now-button">
                    <a href="http://vplsports.in/">Buy Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style jsx global>
            {`
              .offer-sticker-section {
                &.vpl-sports {
                  .action-link a {
                    color: #fff;
                    font-size: 14px;
                    white-space: pre-wrap;
                    padding: 10px 2px;
                  }
                }
              }

              @media screen and (min-width: 1224px) {
                .offer-sticker-section {
                  &.vpl-sports {
                    .action-link a {
                      font-size: 22px;
                    }
                  }
                }
              }
            `}
          </style>
          <style jsx>
            {`
              .offer-sticker-section {
                // background: #ff1e46;

                .offer-sticker-container {
                  width: 100%;
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .button {
                  background: #fdd835;
                  border-radius: 8px;
                }

                .banner-title {
                  position: absolute;
                  top: 9px;
                  font-size: 23px;
                  font-weight: 500;
                  margin-top: 0;
                }
                .sticker {
                  width: 100%;
                  height: 400px;
                  object-fit: cover;
                  border-radius: 10px;
                }

                .row {
                  flex-direction: row;
                  flex-wrap: nowrap;
                  align-items: center;
                }
                .offer-sticker-container > div {
                  // width: 50%;
                }
                .offer-text {
                  text-align: left;
                  padding-left: 10px;
                }
                .offer-text h2 {
                  font-style: normal;
                  font-weight: bold;
                  font-size: 16px;
                  line-height: 19px;
                  color: #ffffff;
                  margin: 0 0px 10px 0;
                  text-align: left;
                }
                .offer-text button {
                  background: #fdd835;
                  border-radius: 11px;
                  border: none;
                  font-style: normal;
                  font-weight: 500;
                  font-size: 10px;
                  line-height: 14px;
                  color: #190a28;
                  min-height: 18px;
                  padding: 5px;
                }
                .offer-sticker {
                  margin-left: 13px;
                  text-align: left;
                }
              }
              .show {
                display: block;
              }
              .hide {
                display: none;
              }

              .offer-sticker-section {
                &.vpl-sports {
                  .offer-sticker-container {
                  }
                  // .offer-sticker {
                  //   display: flex;
                  //   align-items: flex-end;
                  //   justify-content: flex-end;
                  //   img {
                  //     width: auto;
                  //     height: auto;
                  //   }
                  // }
                  .offer-text h2 {
                    font-weight: bold;
                    font-size: 16px;
                  }
                  .offer-subheader {
                    color: rgba(255, 255, 255, 0.94);

                    font-size: 14px;
                    line-height: 20px;
                  }
                  .offer-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 67%;
                  }
                  .action-link {
                    display: block;
                  }
                }
              }

              .buy-now-button {
                background: linear-gradient(
                    121.19deg,
                    rgba(133, 239, 49, 0) 25.73%,
                    rgba(133, 239, 49, 0.6) 45.27%,
                    rgba(133, 239, 49, 0) 62.27%
                  ),
                  #19ce15;
                -webkit-animation: shimmerBackground-jsx-2404973545 35s linear
                  infinite;
                animation: shimmerBackground-jsx-2404973545 35s linear infinite;
                border: 1px solid #20b11d;
                position: absolute;
                height: 44px;
                border-radius: 4px;
                padding: 0 16px;
                line-height: 44px;
                width: 200px;
                text-align: center;
                bottom: 15px;
                a {
                  color: #fff;
                  width: 200px;
                  height: 44px;
                  display: inline-block;
                }
              }

              @media screen and (min-width: 360px) {
                .offer-sticker-section {
                  .sticker {
                    width: 100%;
                    height: 400px;
                    object-fit: cover;
                  }

                  .offer-text h2 {
                    margin: 0 0px 10px 0;
                  }

                  .offer-text button {
                    border-radius: 8px;
                    padding: 2px 8px;
                  }
                }
              }
              @media screen and (min-width: 700px) {
                .offer-sticker-section {
                  padding: 55px;
                  .offer-sticker-container {
                    text-align: left;
                    .offer-text h2 {
                      margin: 0 0 20px 0;
                      font-size: 18px;
                    }
                    .offer-text button {
                      font-size: 12px;
                      padding: 3px 10px;
                    }
                  }
                  .sticker {
                    width: 100%;
                    height: 523px;
                  }
                }
              }
              @media screen and (min-width: 1224px) {
                .offer-sticker-section {
                  &.vpl-sports {
                    .offer-sticker-container {
                      width: 656px;
                      height: 453px;

                      padding: 30px 0 0 30px;
                    }
                    // .offer-sticker {
                    //   display: flex;
                    //   align-items: flex-end;
                    //   justify-content: flex-end;
                    //   img {
                    //     width: auto;
                    //     height: auto;
                    //   }
                    // }

                    .offer-text h2 {
                      font-weight: 500;
                      font-size: 30px;
                    }
                    .offer-subheader {
                      font-size: 24px;
                      color: rgba(255, 255, 255, 0.94);
                      line-height: 28px;
                    }
                    .offer-content {
                      display: flex;
                      flex-direction: column;
                      justify-content: space-between;
                      min-height: 67%;
                    }
                    .action-link {
                      display: block;
                    }
                  }
                }

                .offer-sticker-section {
                  background: #fff;
                  .offer-sticker-container {
                    width: 68%;
                    padding: 70px 44px;
                    border-radius: 16px;
                    min-height: 263px;
                    box-sizing: border-box;
                  }
                  .offer-sticker-container {
                    .offer-text {
                      text-align: left;
                    }
                    .offer-text h2 {
                      font-weight: bold;
                      font-size: 28px;
                      line-height: 33px;
                      margin: 0 0 20px 0;
                    }
                    .offer-text button {
                      font-style: normal;
                      font-weight: 500;
                      font-size: 16px !important;
                      line-height: 24px;
                      letter-spacing: 0.2px;
                      border-radius: 24px;
                      min-height: 33px;
                      padding: 2px 13px !important;
                    }
                    .sticker {
                      width: 100%;
                      height: 523px;
                    }
                  }
                }
              }
            `}
          </style>
        </section>
      )}
    </DownloadStateConsumer>
  );
};

export default OfferSticker;
