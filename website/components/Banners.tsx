import React, { Component } from "react";

import * as imgRef from "../configs/images";
// import "../styles/test.scss";
import Slider from "react-slick";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = { showBanner: false, banners: [] };
  }

  componentDidMount() {
    var vm = this;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css";
    link.async = true;
    const link2 = document.createElement("link");

    link2.href =
      "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css";
    link2.rel = "stylesheet";
    link2.type = "text/css";
    link2.async = true;
    document.body.appendChild(link);
    document.body.appendChild(link2);
    fetch("/api/banners")
      .then(function (response) {
        return response.json();
      })
      .then(function (res) {
        if (res.banners && res.banners.length) {
          vm.setState({
            showBanner: true,
            banners: res.banners,
          });
        }
      })
      .catch((err) => {});

    ///////////////////////////////////
  }

  render() {
    const settings = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      // slidesToShow: 2,
      // centerPadding: "60px",
      slidesToScroll: 1,
      centerMode: true,
      variableWidth: true,
      adaptiveHeight: true,
    };
    return (
      <React.Fragment>
        {this.state.showBanner ? (
          <div id="vpl-hero">
            <div>
              <h2>MEET OUR HEROES</h2>
            </div>
            <div id="hero-block">
              <Slider {...settings}>
                {this.state.showBanner
                  ? this.state.banners.map((element, index) => {
                      return element.actionParams ? (
                        <a
                          key={index}
                          href={
                            element.actionParams
                              ? JSON.parse(element.actionParams).link
                              : "#"
                          }
                          target="blank"
                        >
                          <img
                            className="banner"
                            src={element.imageUrl}
                            alt=""
                          />
                        </a>
                      ) : (
                        <a href="#vpl-hero" key={index}>
                          {" "}
                          <img
                            className="banner"
                            src={element.imageUrl}
                            alt=""
                          />
                        </a>
                      );
                    })
                  : ""}
              </Slider>
            </div>
          </div>
        ) : (
          ""
        )}
        <style jsx>{`
          #vpl-hero {
            padding-bottom: 72px;
            h2 {
              padding: 40px 0;
              font-size: 24px;
            }
          }
          .banner {
            margin: 0vh 20px;
            height: 380px;
            border-radius: 10px;
            box-shadow: 2px 2px 6px 0 rgba(90, 90, 90, 0.2);
          }
          #hero-block {
            a:focus {
              outline: none;
            }

            > div {
              display: flex;
            }
            #banner-arrow {
              position: absolute;

              margin-top: -188px;
              width: 100vw;
              display: flex;
              justify-content: space-between;
              img {
                height: 28px;
              }
            }
          }
          @media (min-width: 1200px) {
            .slick-dots {
              bottom: -65px !important;
            }
            .banner {
              height: 440px !important;
              margin: 0 40px !important;
            }
            #banner-arrow {
              margin-top: -244px !important;
            }
            #vpl-hero h2 {
              font-size: 40px;
              margin: 50px 0;
            }
          }
        `}</style>
      </React.Fragment>
    );
  }
}

// id="hero-inner"
//                 onTouchMove={touchMoveEvent =>
//                   this.handleTouchMove(touchMoveEvent)
//                 }
