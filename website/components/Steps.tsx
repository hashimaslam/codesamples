import React, { Component } from "react";
import osType from "../configs/detectOs";
import {lazyImage} from '../configs/util';
export default class extends Component {
  constructor(props) {
    super(props);
    // this.showSlides(1);
  }
  // componentDidMount() {
  //   this.setState({
  //     osType: osType()
  //   });
  // }
  state = {
    slideIndex: 1
  };
  // Next/previous controls
  plusSlides(n) {
    this.showSlides((this.state.slideIndex += n));
  }

  showSlides = n => {
    if (n > 3) {
      this.setState({ slideIndex: 1 });
    } else if (n < 1) {
      this.setState({ slideIndex: 1 });
    } else {
      this.setState({ slideIndex: n });
    }
  };
  componentDidMount() {
   
  this.setState({
      osType: osType()
    });
    window.location.pathname === "/hero"
      ? this.setState({
          showBanner: true
        })
      : this.setState({
          showBanner: false
        });

    if (osType() === "android") {
      this.setState({
        showSteps: true
      },  () => {
        lazyImage()
      }
      );
    }
   
  }
  render() {
    return (
     
      <React.Fragment>
          {this.state.showSteps ? (      
            <section className={`steps-section ${this.props.cssClassList ? this.props.cssClassList.join(" "):""}`}>
          <div className="container">
          <div className="section-layout">
            <div className="row">
          <div id="steps" className="mobile">
              
              {this.props.header ? (
              this.props.H1Header ? (
                <h1 className="section-header section-header--medium main-header">
                  {this.props.header}
                </h1>
              ) : (
                <h2 className="section-header--large">{this.props.header}</h2>
              )
            ) : (
              ""
            )}
              <p>{this.props.subheader}</p>

            <div id="inst">
              <div
                className={
                  this.state.slideIndex === 1 ? " fade" : "mySlides fade"
                }
              >
                <img data-src={this.props.stepList[0].imageurl.png} alt={this.props.stepList[0].altText} className="lazy-image"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII=" />
                <p>{this.props.stepList[0].stepText}</p>
                <p>{this.props.stepList[0].info}</p>
              </div>
              <div
                className={
                  this.state.slideIndex === 2 ? " fade" : "mySlides fade"
                }
              >
                <img data-src={this.props.stepList[1].imageurl.png} alt={this.props.stepList[1].altText}   className="lazy-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="/>

                <p>{this.props.stepList[1].stepText}</p>
              </div>
              <div
                className={
                  this.state.slideIndex === 3 ? " fade" : "mySlides fade"
                }
              >
                <img data-src={this.props.stepList[2].imageurl.png} alt={this.props.stepList[2].altText}  className="lazy-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII=" />
                <p>{this.props.stepList[2].stepText}</p>
              </div>

              <a className="prev mobile" onClick={() => this.plusSlides(-1)}>
                &#10094;
              </a>
              <a className="next mobile" onClick={() => this.plusSlides(1)}>
                &#10095;
              </a>
              <p id="current-support">
               {this.props.supportedVersionInfo}
              </p>
            </div>
          </div>
          </div>
          </div>
          </div>
         </section>

        ) : (
          ""
        )}
        <style jsx>{`
        .reduce__margin{
          margin-top: -44px;
          margin-bottom: -44px;
        }
        .steps-section{
         .section-layout{
          padding: 44px 24px;
         }
        }
          #steps {
            // padding: 44px 24px;
            // font-family: Roboto;
            // >h2 {
            //   font-weight: bold;
            //   font-size: 14px;
            //   line-height: 18px;
            //   text-align: center;
            //   color: #222222;
            //   align-self: center;
            // }
            >p{
              font-weight: normal;
              font-size: 14px;
              line-height: 18px;
              text-align: center;
              color: #828282;
              margin:16px 0;
            }
            #inst {
              background-color: #ffffff;
              padding-bottom: 20px;

              > div {
                // height: 50vh;
                padding-bottom: 20px; 
              }
            }
            #inst img {
              width: 80%;
              margin-bottom: 20px;
            }
            #inst p {
             // padding: 0 16px;
              font-size: 14px;
              //font-weight: normal;
             // font-style: normal;
             // font-stretch: roboto;
              line-height: 1.5;
              margin: 0;
              // margin-top: 10px;
              // letter-spacing: normal;
             // text-align: center;
              color: #515151;
            }
            #current-support {
              font-size: 16px;
              font-weight: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              text-align: center;
              color: #828282;
              padding-bottom: 20px;
            }
          }

          .mySlides {
            display: none;
          }
          .prev,
          .next {
            cursor: pointer;
            position: absolute;
            width: 30px;
            height: 60px;

            background-color: #ffffff;
            color: #4a4a4a;
            font-weight: bold;
            font-size: 18px;
            transition: 0.6s ease;
            // border-radius: 0 3px 3px 0;
            margin-top: -65%;
            // background: #fff;
            display: flex !important;
            align-items: center;
            justify-content: center;
          }

          .prev {
            left: 0;
            padding-right: 5px;
            border-radius: 0 100px 100px 0;
          }
          /* Position the "next button" to the right */
          .next {
            right: 0;
            padding-left: 5px;
            border-radius: 100px 0 0 100px;
            // border-radius: 3px 0 0 3px;
          }

          /* Fading animation */
          .fade {
            -webkit-animation-name: fade;
            -webkit-animation-duration: 0.3s;
            animation-name: fade;
            animation-duration: 0.3s;
          }

          @-webkit-keyframes fade {
            from {
              opacity: 0.4;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fade {
            from {
              opacity: 0.4;
            }
            to {
              opacity: 1;
            }
          }

          @media (min-width: 1200px) {
            #steps {
              > div {
                width: 1200px;
                margin: auto;
              }
              h2 {
                margin-top: 48px;
                font-size: 56px;
              }
              h2 + p {
                font-size: 36px;
              }
              #inst {
                margin-top: 96px;
                display: flex;

                > div {
                  display: block;
                }
                img {
                  margin-bottom: 40px;
                }
                p {
                  font-size: 18px;
                  padding: 0 10%;
                  margin: 0;
                }
              }
            }
          }
        `}</style>
      </React.Fragment>
      );
  }
}
