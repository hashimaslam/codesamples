import React, { Component } from "react";

class OnBoarding2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };

    if (typeof window !== "undefined") {
      if (window.variantapk == "approach2") {
        this.state = {
          show: true,
        };

        window.onboardingExperiment =
          this.props.config.config.DOWNLOAD_LINK.ONBOARDING_V2;
      }

      var body = document.querySelector("body");
      body.addEventListener("approach2", this.performixEventListner);
    }
  }

  componentDidMount() {
    // const url = window.location.href;
    // const finalUrl = new URL(url)
    // const val = finalUrl.searchParams.get("af_sub2");
    // console.log(val,(val!=="v2"));
    // if(val!=="v2")
    //     return ;
    // this.setState({show:true});
    // var body = document.querySelector("body");
    // body.addEventListener("approach2",this.performixEventListner);
  }
  performixEventListner = (e) => {
    console.log("approach-2-called");
    window.onboardingExperiment =
      this.props.config.config.DOWNLOAD_LINK.ONBOARDING_V2;
    this.setState({ show: true });
  };
  render() {
    console.log("approach-2-rebnder-show" + this.state.show);
    if (!this.state.show) return <div></div>;
    return (
      <section>
        <div className="container">
          <div className="section-layout">
            <h2 className="heading">Its easy to start playing on vpl</h2>
            <div className="content--section">
              <div className="box__wrapper">
                <div className="box__area">
                  <div className="box__image">
                    <picture>
                      <source
                        srcSet="/static/flash-cards/on_boarding_2_img_1.webp"
                        type="image/webp"
                      />
                      <source
                        srcSet="/static/flash-cards/on_boarding_2_img_1.png"
                        type="image/png"
                      />

                      <img
                        className="box__image__css"
                        src="/static/flash-cards/on_boarding_2_img_1.png"
                        alt="on boarding image"
                      />
                    </picture>
                  </div>
                  <div className="number__box">
                    <div className="circle">
                      <h5 className="number__css">1</h5>
                    </div>
                  </div>
                  <div className="description__area">
                    <h5 className="description__heading">
                      Select from 50+ Games
                    </h5>
                    <p className="description__text">
                      Choose from a list of popular games like Fruit Chop, Go
                      Ride, Pro Cricket and many more
                    </p>
                  </div>
                </div>
              </div>
              <div className="box__wrapper">
                <div className="box__area">
                  <div className="box__image">
                    <picture>
                      <source
                        srcSet="/static/flash-cards/on_boarding_2_img_2.webp"
                        type="image/webp"
                      />
                      <source
                        srcSet="/static/flash-cards/on_boarding_2_img_2.png"
                        type="image/png"
                      />

                      <img
                        className="box__image__css"
                        src="/static/flash-cards/on_boarding_2_img_2.png"
                        alt="on boarding image"
                      />
                    </picture>
                  </div>
                  <div className="number__box">
                    <div className="circle">
                      <h5 className="number__css">2</h5>
                    </div>
                  </div>

                  <div className="description__area">
                    <h5 className="description__heading">
                      Join a Tournament or Battle
                    </h5>
                    <p className="description__text">
                      You can either join a LIVE tournament and battle or
                      register for an upcoming event
                    </p>
                  </div>
                </div>
              </div>
              <div className="box__wrapper">
                <div className="box__area">
                  <div className="box__image">
                    <picture>
                      <source
                        srcSet="/static/flash-cards/on_boarding_2_img_3.webp"
                        type="image/webp"
                      />
                      <source
                        srcSet="/static/flash-cards/on_boarding_2_img_3.png"
                        type="image/png"
                      />

                      <img
                        className="box__image__css"
                        src="/static/flash-cards/on_boarding_2_img_3.png"
                        alt="on boarding image"
                      />
                    </picture>
                  </div>

                  <div className="number__box">
                    <div className="circle">
                      <h5 className="number__css">3</h5>
                    </div>
                  </div>

                  <div className="description__area">
                    <h5 className="description__heading">Compete & Win</h5>
                    <p className="description__text">
                      Set a new score every time you play. Get your winnings
                      instantly to your wallet at the end of the tournament or
                      battle
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .heading {
            font-size: 20px;
            line-height: 28px;
            text-align: center;
            color: #000000;
          }

          .box__area {
            margin-top: 24px;
            display: flex;
          }
          .number__box {
            display: none;
          }
          .box__image {
            min-width: 72px;
            height: 72px;
            margin-right: 20px;
          }

          .box__image__css {
            width: 72px;
            height: 72px;
          }

          .description__heading {
            font-weight: 500;
            font-size: 14px;
            line-height: 18px;
            margin: 0;
            text-align: left;
          }

          .description__text {
            font-weight: normal;
            font-size: 12px;
            line-height: 16px;
            color: #4a4a4a;
            text-align: left;
            margin: 0;
            margin-top: 8px;
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
            .number__box {
              display: block;
              margin-top: -30px;
              padding: 0px 24px;
            }
            .circle {
              height: 60px;
              width: 60px;
              background-color: #e91051;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .number__css {
              font-weight: bold;
              font-size: 36px;
              line-height: 44px;
              color: #ffffff;
            }

            .box__wrapper {
              display: unset;
              justify-content: unset;
              border: 1px solid rgba(0, 0, 0, 0.2);
              border-radius: 12px;
              width: 336px;
              padding-bottom: 34px;
              margin-top: 64px;
            }
            .heading {
              font-size: 24px;
              line-height: 32px;
            }
            .box__area {
              display: block;
            }
            .box__image {
              min-width: 336px;
              height: 258px;
            }

            .box__image__css {
              width: 336px;
              height: 258px;
            }
            .description__heading {
              font-weight: bold;
              font-size: 20px;
              line-height: 28px;
            }
            .description__area {
              padding: 0px 24px;
              margin-top: 10px;
            }
            .description__text {
              line-height: 18px;
              margin-top: 8px;
            }
            .content--section {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
            }
          }

          @media screen and (min-width: 1224px) {
            .heading {
              font-size: 36px;
              line-height: 44px;
            }
          }
        `}</style>
      </section>
    );
  }
}

export default OnBoarding2;
