import React, { Component } from "react";
import { lazyImage } from '../configs/util';
class AboutSection extends Component {
  componentDidMount() {
    lazyImage();
  }
  
  render() {
    const { header,trustList } = this.props;
    return (
      <section className="about-section">
        <div className="container">
          <div className="section-layout">
            <div className="row">
              {/* {trustList && trustList.header ? ( */}
                <h2 className="section-header section-header--large">
                  {" "}
                  {header}{" "}
                </h2>
              {/* ) : (
                ""
              ) */}
              
            </div>
            <div className="row">
              {
              // trustList ?
                 trustList.map((trust, key) => (
                    <div className="about-tile" key={key}>
                      {/* <img
                        src={abt.imgLink}
                        alt={abt.text}
                        className="section-tile-image"
                      /> */}
                        <img
                          className="section-tile-image lazy-image"
                          data-src={trust.imageurl.png}
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                          alt={trust.title}
                        />
                      <h3 className="about-tile-header">{trust.title}</h3>
                      <h3 className="about-tile-sub-header">{trust.subTitle}</h3>
                    </div>
                  ))
                // : ""
                }
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .about-section {
              background: #ffffff;

              .about-tile {
                width: 25%;
              }

              .section-header{
                margin-bottom:16px;
              }

              .about-tile-header {
                font-size: 10px;
                color: #4a4a4a;
                font-weight:bold;
                margin-bottom:6px;
              }

              .about-tile-sub-header {
                font-size: 9px;
                color: #828282;
                font-weight:normal;
                margin-top:0;
              }
            }

            @media screen and (min-width: 768px) {
              .about-section {
                .about-tile {
                  width: 22%;
                }
                .about-tile-header {
                  font-size: 16px;
                 font-weight:500;
                }
                .about-tile-sub-header {
                  font-size: 14px;
                  font-weight:500;
                }
                h3 {
                  font-weight: 100;
                }
              }
            }

            @media screen and (min-width: 1224px) {
              .about-section {
                .about-tile {
                  width: 16%;
                }
                .about-tile-header {
                  font-size: 20px;

                }
                .about-tile-sub-header {
                  font-size: 16px;
                }

                .section-header{
                  margin-bottom:64px;
                }
              }

            }
          `}
        </style>
      </section>
    );
  }
}

export default AboutSection;
