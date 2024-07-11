import React, { Component } from "react";
import * as imgRef from "../configs/images";
import osType from "../configs/detectOs";
import "../styles/step-super-team.scss";
export default class extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.setState({
      osType: osType()
    });
  }
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
    if (osType() === "android") {
      this.setState({
        showSteps: true
      });
    }
  }
  render() {
    return (
      <React.Fragment>
        {this.state.showSteps ? (
          <div id="steps" className="mobile">
            <div>
              <h2>{this.props.lang.HEADING2}</h2>
              <p>{this.props.lang.SUBHEAD}</p>
            </div>

            <div id="inst">
              <div
                className={
                  this.state.slideIndex === 1 ? " fade" : "mySlides fade"
                }
              >
                <img src={imgRef.INST_STEP1} alt="" />
                <p>{this.props.lang.STEP11}</p>
                <p>{this.props.lang.STEP12}</p>
              </div>
              <div
                className={
                  this.state.slideIndex === 2 ? " fade" : "mySlides fade"
                }
              >
                <img src={imgRef.INST_STEP2} alt="" />
                <p>{this.props.lang.STEP2}</p>
              </div>
              <div
                className={
                  this.state.slideIndex === 3 ? " fade" : "mySlides fade"
                }
              >
                <img src={imgRef.INST_STEP3} alt="" />
                <p>{this.props.lang.STEP3}</p>
              </div>
              <a className="prev mobile" onClick={() => this.plusSlides(-1)}>
                &#10094;
              </a>
              <a className="next mobile" onClick={() => this.plusSlides(1)}>
                &#10095;
              </a>
            </div>
            <div>
              <p id="current-support">
                Currently supported on Android 5.1 and above
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}
