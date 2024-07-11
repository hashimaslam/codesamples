import React, { Component } from "react";

const data = {
  slides: [
    {
      heading: "Welcome to vpl",
      subheading:
        "Play skill games against others for real money.  We will guide you through the platform.",
      content: [
        {
          empty: false,
          imageurl: {
            webp: "/static/flash-cards/img_exciting_games.webp",
            png: "/static/flash-cards/img_exciting_games.png",
          },
          altText: "Flash card image",
          title: "50+ Exciting Games ",
          text: "Play popular games like Rogue Heist, Fantasy Cricket, WCC, Fruit Chop & many more ",
        },
        {
          empty: false,
          imageurl: {
            webp: "/static/flash-cards/img_play_free.webp",
            png: "/static/flash-cards/img_play_free.png",
          },
          altText: "Flash card image",
          title: "Play for Free",
          text: "Play in the free lobbies to practice & upgrade your skills",
        },
        {
          empty: true,
        },
      ],
      singleButton: {
        text: "Get Started",
      },
    },
    {
      heading: "How to win cash prizes",
      content: [
        {
          empty: false,
          imageurl: {
            webp: "/static/flash-cards/img_deposit.webp",
            png: "/static/flash-cards/img_deposit.png",
          },
          altText: "Flash card image",
          title: "Deposit",
          text: "Add Cash into your vpl wallet to play cash games. 5 payment options available",
        },
        {
          empty: false,
          imageurl: {
            webp: "/static/flash-cards/img_win_cash_prizes.webp",
            png: "/static/flash-cards/img_win_cash_prizes.png",
          },
          altText: "Flash card image",
          title: "Win Cash Prizes",
          text: "Compete in tournaments and battles to win exciting cash prizes",
        },
        {
          empty: false,
          imageurl: {
            webp: "/static/flash-cards/img_fastest_withdrawals.webp",
            png: "/static/flash-cards/img_fastest_withdrawals.png",
          },
          altText: "Flash card image",
          title: "Fastest Withdrawals",
          text: "Transfer winnings to your bank account or wallet instantly",
        },
      ],
      doubleButton: {
        text1: "Previous",
        text2: "Next",
      },
    },
    {
      heading: "vpl Game formats",
      content: [
        {
          empty: false,
          imageurl: {
            webp: "/static/flash-cards/img_battles.webp",
            png: "/static/flash-cards/img_battles.png",
          },
          altText: "Flash card image",
          title: "Battles",
          text: "Play against one or more players & beat their scores to win",
        },
        {
          empty: false,
          imageurl: {
            webp: "/static/flash-cards/img_tournament.webp",
            png: "/static/flash-cards/img_tournament.png",
          },
          altText: "Flash card image",
          title: "Tournaments",
          text: "Play to get a high score & a leaderboard rank to win prizes",
        },
        {
          empty: true,
        },
      ],
      doubleButton: {
        text1: "Previous",
        text2: "Got it",
      },
    },
  ],
};

const MobileOverlay = ({ close, next, data, slideArr, index, previous }) => (
  <div className="overlay">
    <div className="content--area">
      <div className="text--content">
        <div className="close--sign__align-right">
          <div onClick={() => close(false)} className="close"></div>
        </div>
        {data.heading && <h3 className="heading">{data.heading}</h3>}
        {data.subheading && <h4 className="sub--heading">{data.subheading}</h4>}
        <div className="content__box--section">
          {data.content.map((content, key) => {
            if (content.empty)
              return <div className="empty--box" key={key}></div>;
            else
              return (
                <div className="box__area" key={key}>
                  <div className="box__image">
                    <picture>
                      <source
                        srcSet={content.imageurl.webp}
                        type="image/webp"
                      />
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
              );
          })}
        </div>
        <div className="dot--section">
          {slideArr.map((con, key) => {
            if (key === index)
              return <div className="active--slide" key={key}></div>;
            else return <div className="unactive--slide" key={key}></div>;
          })}
        </div>
        {data.singleButton && (
          <div className="single--button" onClick={next}>
            <h2 className="button--text">{data.singleButton.text}</h2>
          </div>
        )}

        {data.doubleButton && (
          <div className="double--button">
            <div className="button__css background--white" onClick={previous}>
              <h2 className="button--text color--red">
                {data.doubleButton.text1}
              </h2>
            </div>
            <div className="button__css background--red" onClick={next}>
              <h2 className="button--text">{data.doubleButton.text2}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
    <style jsx>{`
      .content--area {
        background: #ffffff;
        border-radius: 8px;
        position: relative;
      }

      .text--content {
        padding: 16px;
      }

      .heading {
        font-weight: bold;
        font-size: 24px;
        line-height: 32px;
        color: #190a28;
        margin: 0;
      }

      .sub--heading {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: rgba(25, 10, 40, 0.6);
        margin: 0;
        margin-top: 4px;
      }

      .close--sign__align-right {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }

      .close {
        width: 14px;
        height: 14px;
        color: #4a4a4a;
        cursor: pointer;
      }

      .close:before,
      .close:after {
        position: absolute;
        content: " ";
        height: 14px;
        width: 2px;
        border-radius: 1px;
        background: #190a28;
      }

      .close:before {
        transform: rotate(45deg);
      }
      .close:after {
        transform: rotate(-45deg);
      }

      .content__box--section {
        margin-top: 20px;
      }

      .box__area {
        margin-top: 24px;
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
      .empty--box {
        height: 70px;
        margin-top: 24px;
      }

      .active--slide {
        background: #e91051;
        border-radius: 7px;
        width: 15.36px;
        height: 5px;
        margin-right: 6px;
      }
      .unactive--slide {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: rgba(25, 10, 40, 0.3);
        margin-right: 6px;
      }
      .dot--section {
        margin-top: 50px;
        display: flex;
        justify-content: center;
      }

      .single--button {
        height: 44px;
        background: #e91051;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 16px;
        cursor: pointer;
      }
      .button--text {
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        color: #ffffff;
      }
      .double--button {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
      }
      .button__css {
        width: 47.5%;
        height: 44px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .background--white {
        background: #ffffff;
        border: 1px solid rgba(25, 10, 40, 0.15);
        border-radius: 4px;
      }
      .background--red {
        background: #e91051;
      }
      .color--red {
        color: #e91051 !important;
      }
    `}</style>
  </div>
);

const DesktopOverlay = ({ close, next, data, slideArr, index, previous }) => (
  <div className="content--block">
    <div className="skip--option--section">
      <h4 className="skip__css">SKIP</h4>
      <div onClick={() => close(false)} className="close"></div>
    </div>

    {data.heading && <h3 className="heading">{data.heading}</h3>}
    {data.subheading && <h4 className="sub--heading">{data.subheading}</h4>}
    <div className="content__box--section">
      {data.content.map((content, key) => {
        if (content.empty)
          return <div style={{ display: "none" }} key={key}></div>;
        else
          return (
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
          );
      })}
    </div>
    <div className="dot--section">
      {slideArr.map((con, key) => {
        if (key === index)
          return <div className="active--slide" key={key}></div>;
        else return <div className="unactive--slide" key={key}></div>;
      })}
    </div>
    {data.singleButton && (
      <div className="single--button--wrapper">
        <div className="single--button" onClick={next}>
          <h2 className="button--text">{data.singleButton.text}</h2>
        </div>
      </div>
    )}

    {data.doubleButton && (
      <div className="double--button">
        <div className="button__css background--white" onClick={previous}>
          <h2 className="button--text color--red">{data.doubleButton.text1}</h2>
        </div>
        <div className="button__css background--red" onClick={next}>
          <h2 className="button--text">{data.doubleButton.text2}</h2>
        </div>
      </div>
    )}

    <style jsx>
      {`
        .content--block {
          padding: 48px;
        }

        .skip--option--section {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .skip__css {
          margin: 0;
          margin-right: 13px;
          font-weight: bold;
          font-size: 16px;
          line-height: 24px;
          color: #190a28;
        }
        .close {
          width: 14px;
          height: 14px;
          color: #4a4a4a;
          cursor: pointer;
        }

        .close:before,
        .close:after {
          position: absolute;
          content: " ";
          height: 14px;
          width: 2px;
          border-radius: 1px;
          background: #190a28;
        }

        .close:before {
          transform: rotate(45deg);
        }
        .close:after {
          transform: rotate(-45deg);
        }

        .heading {
          font-weight: bold;
          font-size: 36px;
          line-height: 44px;
          color: #190a28;
          margin: 0;
        }

        .sub--heading {
          font-weight: 500;
          font-size: 20px;
          line-height: 28px;
          color: #4a4a4a;
          margin: 0;
          margin-top: 12px;
        }
        .content__box--section {
          margin-top: 54px;
          display: flex;
          justify-content: space-around;
        }
        .description__area {
          margin-top: 36px;
        }

        .box__area {
          width: 340px;
        }

        .box__image {
          display: flex;
          justify-content: center;
        }

        .box__image__css {
          width: 192px;
          height: 177px;
        }

        .description__heading {
          font-weight: 500;
          font-size: 24px;
          line-height: 32px;
          color: #000000;
          margin: 0;
          text-align: center;
        }

        .description__text {
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          color: rgba(25, 10, 40, 0.6);
          text-align: center;
          margin: 0;
        }

        .active--slide {
          background: #e91051;
          border-radius: 7px;
          width: 31px;
          height: 10px;
          margin-right: 12px;
        }
        .unactive--slide {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(25, 10, 40, 0.3);
          margin-right: 12px;
        }
        .dot--section {
          margin-top: 117px;
          display: flex;
          justify-content: center;
        }
        .single--button--wrapper {
          display: flex;
          justify-content: center;
        }
        .single--button {
          height: 48px;
          background: #e91051;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
          width: 240px;
          cursor: pointer;
        }
        .button--text {
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          color: #ffffff;
        }
        .double--button {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }
        .button__css {
          width: 240px;
          height: 48px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .background--white {
          background: #ffffff;
          border: 1px solid rgba(25, 10, 40, 0.15);
          border-radius: 4px;
        }
        .background--red {
          background: #e91051;
        }
        .color--red {
          color: #e91051 !important;
        }
      `}
    </style>
  </div>
);

class FlashCards extends Component {
  constructor(props) {
    super(props);
    this.outsideClick = React.createRef();
    this.startPos = null;
    this.state = {
      showOverlay: false,
      slideIndex: 0,
      numberOfslidesArr: [],
    };

    if (typeof window !== "undefined") {
      if (window.variantapk == "approach1") {
        window.onboardingExperiment =
          this.props.config.config.DOWNLOAD_LINK.ONBOARDING_V1;
        console.log("approach-1-show-0" + this.state.showOverlay);

        const arr = [];
        for (let i = 0; i < data.slides.length; i++) {
          arr.push(i);
        }

        this.state = {
          showOverlay: true,
          slideIndex: 0,
          numberOfslidesArr: arr,
        };
        console.log("approach-1-show-1" + this.state.showOverlay);

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "vpl_Homepage_PopupShown_Optimize",
          ExperimentName: "Homepage_WebsiteOnboarding_Experiment",
          ExperimentID: "AZ5qjlp2R6WtUQEVv9HmQw",
          Variant: "Variant1",
          eventAction: "vpl_Homepage_PopupShown_Optimize",
        });
      }

      const body = document.querySelector("body");
      body.addEventListener("approach1", this.performixEventListner);
    }
  }

  componentDidMount() {
    // const arr =[];
    // for(let i=0;i<data.slides.length;i++){
    //     arr.push(i);
    // }
    // this.setState({numberOfslidesArr:arr});
  }

  performixEventListner = (e) => {
    console.log("approach-1-called");

    window.onboardingExperiment =
      this.props.config.config.DOWNLOAD_LINK.ONBOARDING_V1;
    this.setState({ showOverlay: true });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "vpl_Homepage_PopupShown_Optimize",
      ExperimentName: "Homepage_WebsiteOnboarding_Experiment",
      ExperimentID: "AZ5qjlp2R6WtUQEVv9HmQw",
      Variant: "Variant1",
      eventAction: "vpl_Homepage_PopupShown_Optimize",
    });
  };

  close = (notGotIt) => {
    this.setState({
      showOverlay: false,
    });
    if (notGotIt) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "vpl_Homepage_NextCard2_Optimize",
        ExperimentName: "Homepage_WebsiteOnboarding_Experiment ",
        ExperimentID: "AZ5qjlp2R6WtUQEVv9HmQw ",
        Variant: "Variant1",
        eventAction: "vpl_Homepage_NextCard2_Optimize",
      });
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "vpl_Homepage_Close_Optimize",
        ExperimentName: "Homepage_WebsiteOnboarding_Experiment ",
        ExperimentID: "AZ5qjlp2R6WtUQEVv9HmQw ",
        Variant: "Variant1",
        eventAction: "vpl_Homepage_Close_Optimize",
      });
    }
  };

  nextSlide = () => {
    if (this.state.slideIndex === 0) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "vpl_Homepage_LetsGetStarted_Optimize",
        ExperimentName: "Homepage_WebsiteOnboarding_Experiment ",
        ExperimentID: "AZ5qjlp2R6WtUQEVv9HmQw ",
        Variant: "Variant1",
        eventAction: "vpl_Homepage_LetsGetStarted _Optimize",
      });
    }
    if (this.state.slideIndex === 1) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "vpl_Homepage_NextCard1_Optimize",
        ExperimentName: "Homepage_WebsiteOnboarding_Experiment ",
        ExperimentID: "AZ5qjlp2R6WtUQEVv9HmQw ",
        Variant: "Variant1",
        eventAction: "vpl_Homepage_NextCard1_Optimize",
      });
    }
    if (this.state.slideIndex === 2) {
      this.close(true);
    } else {
      this.setState({
        slideIndex: this.state.slideIndex + 1,
      });
    }
  };

  previousSlide = () => {
    this.setState({
      slideIndex: this.state.slideIndex - 1,
    });
  };

  render() {
    console.log("variant-1 -red" + this.state.showOverlay);
    if (!this.state.showOverlay) return <div></div>;
    return (
      <>
        <div>
          <div className="overlay-outer-area">
            <div className="overlay--center">
              {this.props.device && this.props.device === "desktop" ? (
                <div
                  ref={this.outsideClick}
                  className="desktop__overlay overlay--background"
                >
                  <DesktopOverlay
                    close={this.close}
                    next={this.nextSlide}
                    data={data.slides[this.state.slideIndex]}
                    slideArr={this.state.numberOfslidesArr}
                    index={this.state.slideIndex}
                    previous={this.previousSlide}
                  />
                </div>
              ) : (
                <div ref={this.outsideClick} className="mobile__overlay">
                  <MobileOverlay
                    close={this.close}
                    next={this.nextSlide}
                    data={data.slides[this.state.slideIndex]}
                    slideArr={this.state.numberOfslidesArr}
                    index={this.state.slideIndex}
                    previous={this.previousSlide}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <style jsx>{`
          .overlay-outer-area {
            left: 0px;
            top: 0px;
            position: fixed;
            overflow: hidden;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            background: rgba(25, 10, 40, 0.6);
            z-index: 12;
          }
          .overlay--center {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
          }
          .overlay--background {
            background: #ffffff;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
            border-radius: 6px;
          }

          .mobile__overlay {
            width: 312px;
            transition: all 0.3s;
          }
          .desktop__overlay {
            width: 1304px;
            transition: all 0.3s;
          }
          @media screen and (min-width: 360px) {
            .mobile__overlay {
              width: 340px;
              transition: all 0.3s;
            }
          }
        `}</style>
      </>
    );
  }
}

export default FlashCards;
