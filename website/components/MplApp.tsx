import * as imgRef from "../configs/images";
import React, { Component } from "react";
import "../styles/vpl-app.scss";

export default class extends Component {
  render() {
    return (
      <div id="vpl-app">
        <h2>{this.props.title}</h2>
        <div>
          <div>
            <img src={this.props.imageObj} alt="" />
          </div>

          <div id="txt">
            <div>
              <div>
                <h3>1</h3>
              </div>
              <div>
                <h4>{this.props.header1}</h4>
                <p>{this.props.paragraph1}</p>
              </div>
            </div>
            <div>
              <div>
                <h3>2</h3>
              </div>
              <div>
                <h4>{this.props.header2}</h4>
                <p>{this.props.paragraph2}</p>
              </div>
            </div>
            <div>
              <div>
                <h3>3</h3>
              </div>
              <div>
                <h4>{this.props.header3}</h4>
                <p>{this.props.paragraph3}</p>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          #vpl-app h2 {
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}

// const vplApp = props => (

// );
// export default vplApp;
