import React, { Component } from "react";

const data = {
  slides: [
    {
      empty: true,
    },
    {
      heading: "Welcome to vpl",
      subheading:
        "Play skill games against others for real money.  We will guide you through the platform.",
      empty: false,
      content: [
        {
          imageurl: {
            webp: "/static/flash-cards/img_exciting_games.webp",
            png: "/static/flash-cards/img_exciting_games.png",
          },
          altText: "Flash card image",
          title: "50+ Exciting Games ",
          text: "Play popular games like Rogue Heist, Fantasy Cricket, WCC, Fruit Chop & many more ",
        },
        {
          imageurl: {
            webp: "/static/flash-cards/img_play_free.webp",
            png: "/static/flash-cards/img_play_free.png",
          },
          altText: "Flash card image",
          title: "Play for Free",
          text: "Play in the free lobbies to practice & upgrade your skills",
        },
      ],
    },
    {
      heading: "How to win cash prizes",
      empty: false,
      content: [
        {
          imageurl: {
            webp: "/static/flash-cards/img_deposit.webp",
            png: "/static/flash-cards/img_deposit.png",
          },
          altText: "Flash card image",
          title: "Deposit",
          text: "Add Cash into your vpl wallet to play cash games. 5 payment options available",
        },
        {
          imageurl: {
            webp: "/static/flash-cards/img_win_cash_prizes.webp",
            png: "/static/flash-cards/img_win_cash_prizes.png",
          },
          altText: "Flash card image",
          title: "Win Cash Prizes",
          text: "Compete in tournaments and battles to win exciting cash prizes",
        },
        {
          imageurl: {
            webp: "/static/flash-cards/img_fastest_withdrawals.webp",
            png: "/static/flash-cards/img_fastest_withdrawals.png",
          },
          altText: "Flash card image",
          title: "Fastest Withdrawals",
          text: "Transfer winnings to your bank account or wallet instantly",
        },
      ],
    },
    {
      heading: "vpl Game formats",
      empty: false,
      content: [
        {
          imageurl: {
            webp: "/static/flash-cards/img_battles.webp",
            png: "/static/flash-cards/img_battles.png",
          },
          altText: "Flash card image",
          title: "Battles",
          text: "Play against one or more players & beat their scores to win",
        },
        {
          imageurl: {
            webp: "/static/flash-cards/img_tournament.webp",
            png: "/static/flash-cards/img_tournament.png",
          },
          altText: "Flash card image",
          title: "Tournaments",
          text: "Play to get a high score & a leaderboard rank to win prizes",
        },
      ],
    },
    {
      empty: true,
    },
  ],
};

const MobileOverlay = ({ close, next, data, slideArr, index, previous }) => (
  <div className="content--block">
    <div className="box__wrapper">
      <h3 className="box__heading">{data.heading}</h3>
      {data.subheading && (
        <h4 className="box__subheading">{data.subheading}</h4>
      )}
      <div className="content__box--section">
        {data.content.map((content, key) => (
          <div className="box__area" key={key}>
            <div className="box__image">
              <picture>
                <source srcSet={content.imageurl.webp} type="image/webp" />
                <source srcSet={content.imageurl.png} type="image/png" />

                <img
                  className="box__image__css"
                  src={content.imageurl.png}
                  alt={content.altText}
                />
              </picture>
            </div>

            <div className="description__area">
              <h5 className="description__heading">{content.title}</h5>
              <p className="description__text">{content.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="back__forward__area">
      <div className="circle" onClick={previous}>
        <div className="arrow next"></div>
      </div>
      <div className="dot--section">
        {slideArr.map((con, key) => {
          if (key === index - 2)
            return <div className="active--slide" key={key}></div>;
          else return <div className="unactive--slide" key={key}></div>;
        })}
      </div>
      <div className="circle" onClick={next}>
        <div className="arrow prev"></div>
      </div>
    </div>
    <style jsx>{`
      .content--block {
        width: 312px;
        margin: auto;
      }
      .box__wrapper {
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        height: 420px;
        background: #ffffff;
        padding: 28px 12px 0px 12px;
      }
      .back__forward__area {
        margin: 0px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
      }

      .content__box--section {
        margin-top: 12px;
      }
      .box__heading {
        font-weight: bold;
        font-size: 24px;
        line-height: 32px;
        color: #190a28;
        margin: 0;
      }

      .box__subheading {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: rgba(25, 10, 40, 0.6);
        margin: 0;
        margin-top: 4px;
      }

      .box__area {
        margin-top: 32px;
        display: flex;
      }
      .middle__box__area {
        margin-top: 44px;
        display: flex;
      }

      .box__image {
        min-width: 67px;
        height: 61px;
        margin-right: 20px;
      }
      .box__image__css {
        width: 67px;
        height: 61px;
      }

      .description__heading {
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #000000;
        margin: 0;
        text-align: left;
      }

      .description__text {
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        color: rgba(25, 10, 40, 0.6);
        text-align: left;
        margin: 0;
      }
      .arrow {
        display: inline-block;
        width: 6px;
        height: 6px;
        background: transparent;
        border-top: 2px solid #190a28;
        border-left: 2px solid#190A28;
        text-decoration: none;
        color: transparent;
      }

      .arrow.prev {
        transform: rotate(-45deg);
        left: 0;
      }

      .arrow.next {
        transform: rotate(135deg);
        right: 0;
      }
      .circle {
        height: 40px;
        width: 40px;
        background-color: #bbb;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
        transform: rotate(-180deg);
        cursor: pointer;
      }
      .active--slide {
        background: #e91051;
        border-radius: 50%;
        width: 8px;
        height: 8px;
        margin-right: 17px;
      }
      .unactive--slide {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(25, 10, 40, 0.3);
        margin-right: 17px;
      }
      .dot--section {
        display: flex;
        justify-content: center;
      }

      @media screen and (min-width: 360px) {
        .content--block {
          width: 332px;
        }
      }
    `}</style>
  </div>
);

const DesktopOverlay = ({
  close,
  next,
  data0,
  data1,
  data2,
  slideArr,
  index,
  previous,
}) => (
  <div className="content--block">
    <div className="content__area">
      <div className="circle" onClick={previous}>
        <div className="arrow next"></div>
      </div>
      <div className="circle" onClick={next}>
        <div className="arrow prev"></div>
      </div>
      <div className="boxes__content">
        <div className="boxes__css">
          {data0.empty ? (
            <div className="empty__box"></div>
          ) : (
            <div className="box__css box__wrapper">
              <h3 className="box__heading">{data0.heading}</h3>
              {data0.subheading && (
                <h4 className="box__subheading">{data0.subheading}</h4>
              )}
              <div className="content__box--section">
                {data0.content.map((content, key) => (
                  <div className="box__area" key={key}>
                    <div className="box__image">
                      <picture>
                        <source
                          srcSet={content.imageurl.webp}
                          type="image/webp"
                        />
                        <source
                          srcSet={content.imageurl.png}
                          type="image/png"
                        />

                        <img
                          className="box__image__css"
                          src={content.imageurl.png}
                          alt={content.altText}
                        />
                      </picture>
                    </div>

                    <div className="description__area">
                      <h5 className="description__heading">{content.title}</h5>
                      <p className="description__text">{content.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="box__css middle__box">
            <h3 className="box__heading">{data1.heading}</h3>
            <div className="content__box--section">
              {data1.content.map((content, key) => (
                <div className="middle__box__area" key={key}>
                  <picture>
                    <source srcSet={content.imageurl.webp} type="image/webp" />
                    <source srcSet={content.imageurl.png} type="image/png" />

                    <img
                      className="middle__box__img"
                      src={content.imageurl.png}
                      alt={content.altText}
                    />
                  </picture>

                  <div className="description__area">
                    <h5 className="description__heading">{content.title}</h5>
                    <p className="description__text">{content.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {data2.empty ? (
            <div className="empty__box"></div>
          ) : (
            <div className="box__css box__wrapper">
              <h3 className="box__heading">{data2.heading}</h3>
              {data2.subheading && (
                <h4 className="box__subheading">{data2.subheading}</h4>
              )}
              <div className="content__box--section">
                {data2.content.map((content, key) => (
                  <div className="box__area" key={key}>
                    <div className="box__image">
                      <picture>
                        <source
                          srcSet={content.imageurl.webp}
                          type="image/webp"
                        />
                        <source
                          srcSet={content.imageurl.png}
                          type="image/png"
                        />

                        <img
                          className="box__image__css"
                          src={content.imageurl.png}
                          alt={content.altText}
                        />
                      </picture>
                    </div>

                    <div className="description__area">
                      <h5 className="description__heading">{content.title}</h5>
                      <p className="description__text">{content.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="dot--section">
      {slideArr.map((con, key) => {
        if (key === index - 1)
          return <div className="active--slide" key={key}></div>;
        else return <div className="unactive--slide" key={key}></div>;
      })}
    </div>

    <style jsx>
      {`
        .content__area {
          height: 500px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }
        .boxes__content {
          position: absolute;
          left: 50px;
          right: 50px;
        }
        .box__wrapper {
          width: 340px;
          height: 450px;
          padding: 24px;
        }

        .empty__box {
          width: 340px;
          height: 450px;
        }

        .middle__box {
          width: 340px;
          height: 500px;
          padding: 48px 24px 0px 24px;
        }
        .box__css {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
          border-radius: 8px;
        }
        .arrow {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: transparent;
          border-top: 2px solid #190a28;
          border-left: 2px solid#190A28;
          text-decoration: none;
          color: transparent;
        }

        .arrow.prev {
          transform: rotate(-45deg);
          left: 0;
        }

        .arrow.next {
          transform: rotate(135deg);
          right: 0;
        }
        .circle {
          height: 48px;
          width: 48px;
          background-color: #bbb;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ffffff;
          box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
          transform: rotate(-180deg);
          cursor: pointer;
        }

        .boxes__css {
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        .content__box--section {
          margin-top: 12px;
        }
        .box__heading {
          font-weight: bold;
          font-size: 24px;
          line-height: 32px;
          color: #190a28;
          margin: 0;
        }

        .box__subheading {
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          color: rgba(25, 10, 40, 0.6);
          margin: 0;
          margin-top: 4px;
        }

        .box__area {
          margin-top: 32px;
          display: flex;
        }
        .middle__box__area {
          margin-top: 44px;
          display: flex;
        }

        .box__image {
          min-width: 67px;
          height: 61px;
          margin-right: 20px;
        }
        .box__image__css {
          width: 67px;
          height: 61px;
        }
        .middle__box__img {
          min-width: 74px;
          min-height: 69px;
          max-width: 74px;
          max-height: 69px;
          margin-right: 20px;
        }

        .description__heading {
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          color: #000000;
          margin: 0;
          text-align: left;
        }

        .description__text {
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          color: rgba(25, 10, 40, 0.6);
          text-align: left;
          margin: 0;
        }

        .active--slide {
          background: #e91051;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          margin-right: 17px;
        }
        .unactive--slide {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(25, 10, 40, 0.3);
          margin-right: 17px;
        }
        .dot--section {
          margin-top: 64px;
          display: flex;
          justify-content: center;
        }
      `}
    </style>
  </div>
);

class OnBoarding2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      slideIndex: 2,
      numberOfslidesArr: [],
    };
  }

  componentDidMount() {
    const arr = [];
    for (let i = 0; i < data.slides.length - 2; i++) {
      arr.push(i);
    }
    this.setState({ numberOfslidesArr: arr });
    // const body = document.querySelector("body");
    // body.addEventListener("approach3",this.performixEventListner);

    //if(typeof window !== 'undefined'){
    if (window.variantapk == "approach3") {
      window.onboardingExperiment =
        this.props.config.config.DOWNLOAD_LINK.ONBOARDING_V3;

      // const arr =[];
      // for(let i=0;i<data.slides.length-2;i++){
      //     arr.push(i);
      // }

      // this.state = {
      //     show:true,
      //     slideIndex:1,
      //     numberOfslidesArr:arr
      //   };

      this.setState({ show: true });
    }
    const body = document.querySelector("body");
    body.addEventListener("approach3", this.performixEventListner);
    // }
  }

  performixEventListner = (e) => {
    console.log("approach-3-called");
    window.onboardingExperiment =
      this.props.config.config.DOWNLOAD_LINK.ONBOARDING_V3;
    this.setState({ show: true });
  };

  close = () => {
    this.setState({
      show: false,
    });
  };

  nextSlideMobile = () => {
    if (this.state.slideIndex === 4) return;
    this.setState({
      slideIndex: this.state.slideIndex + 1,
    });
  };

  nextSlideDesktop = () => {
    if (this.state.slideIndex === 3) return;
    this.setState({
      slideIndex: this.state.slideIndex + 1,
    });
  };

  previousSlide = () => {
    if (this.state.slideIndex === 1) return;
    this.setState({
      slideIndex: this.state.slideIndex - 1,
    });
  };
  previousSlideMobile = () => {
    if (this.state.slideIndex === 2) return;
    this.setState({
      slideIndex: this.state.slideIndex - 1,
    });
  };

  render() {
    if (!this.state.show) return <div></div>;
    return (
      <section>
        <div className="container">
          <div className="section-layout">
            <h2 className="heading">Its easy to start playing on vpl</h2>
            {this.props.device && this.props.device === "desktop" ? (
              <div
                ref={this.outsideClick}
                className="desktop__overlay overlay--background"
              >
                <DesktopOverlay
                  close={this.close}
                  next={this.nextSlideDesktop}
                  data0={data.slides[this.state.slideIndex - 1]}
                  data1={data.slides[this.state.slideIndex]}
                  data2={data.slides[this.state.slideIndex + 1]}
                  slideArr={this.state.numberOfslidesArr}
                  index={this.state.slideIndex}
                  previous={this.previousSlide}
                />
              </div>
            ) : (
              <MobileOverlay
                close={this.close}
                next={this.nextSlideMobile}
                data={data.slides[this.state.slideIndex - 1]}
                slideArr={this.state.numberOfslidesArr}
                index={this.state.slideIndex}
                previous={this.previousSlideMobile}
              />
            )}
          </div>
        </div>
        <style jsx>{`
          .heading {
            font-size: 20px;
            line-height: 28px;
            text-align: center;
            color: #000000;
            margin-bottom: 24px;
          }
          .section-layout {
            padding: 24px 0px;
          }
          @media screen and (min-width: 360px) {
            .box__area {
              width: 340px;
            }
            .box__wrapper {
              display: flex;
              justify-content: center;
            }
          }
          @media screen and (min-width: 768px) {
            .heading {
              font-size: 24px;
              line-height: 32px;
              margin-bottom: 40px;
            }
          }

          @media screen and (min-width: 1224px) {
            .heading {
              font-size: 36px;
              line-height: 44px;
              margin-bottom: 64px;
            }
          }
        `}</style>
      </section>
    );
  }
}

export default OnBoarding2;
