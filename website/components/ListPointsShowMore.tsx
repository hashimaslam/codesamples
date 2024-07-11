import React, { Component } from "react";
import { getHTMLwithSpan } from "../configs/util";

class ListPointsShowMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  toggle = () => {
    this.setState({ show: !this.state.show });
  };
  render() {
    return (
      <section
        className={`list-section ${
          this.props.cssClassList ? this.props.cssClassList.join(" ") : ""
        }`}
      >
        <div className="container">
          <div className="section-layout">
            <div>
              {this.props.header ? (
                <h2 className="section-header section-header--medium">
                  {this.props.header}
                </h2>
              ) : (
                ""
              )}
            </div>
            {this.props.h3Title ? (
              <h3
                className={`start--title  ${
                  this.props.reduceMarginH3 ? this.props.reduceMarginH3 : ""
                }  ${this.props.h3LeftAlign ? "h3__left-align" : ""}`}
                style={{}}
              >
                {this.props.h3Title}
              </h3>
            ) : (
              ""
            )}
            <div
              className={` show__content_min_768 ${
                this.state.show ? "show__content" : "hide__content"
              }`}
            >
              <div
                className={`list-row-aligned ${
                  this.props.cssClassList
                    ? this.props.cssClassList.join(" ")
                    : ""
                }`}
              >
                {this.props.description
                  ? this.props.description.map((des, key) => (
                      <p className="list-description" key={key}>
                        {getHTMLwithSpan(des)}
                      </p>
                    ))
                  : ""}
              </div>

              <div className="list-layout">
                {this.props.declareGameList
                  ? this.props.declareGameList.map((item, key) => (
                      <div className="list" key={key}>
                        <span>
                          <svg
                            className="list-icon"
                            width="8px"
                            height="16px"
                            viewBox="0 0 8 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.1 0.200012L0.399994 5.8L0.850001 6.20005H4.00002V9.80001H4.90003L7.59999 4.24439L7.26716 3.80003H4.00002V0.200012H3.1Z"
                              fill="#828282"
                            />
                          </svg>
                        </span>
                        {item.includes(":") ? (
                          <p className="list-description">
                            <b>
                              {getHTMLwithSpan(
                                item.substring(0, item.indexOf(":"))
                              )}
                            </b>
                            {getHTMLwithSpan(item.substring(item.indexOf(":")))}
                          </p>
                        ) : (
                          <p className="list-description">
                            {getHTMLwithSpan(item)}
                          </p>
                        )}
                      </div>
                    ))
                  : ""}
              </div>
              {this.props.summaryList
                ? this.props.summaryList.map((info, key) => (
                    <div className="row list-row-aligned" key={key}>
                      <p className="list-description">
                        {getHTMLwithSpan(info)}
                      </p>
                    </div>
                  ))
                : ""}

              {this.props.pageLink ? (
                <div className="row list-row-aligned">
                  <p className="list-description">
                    <span className="know-more">
                      <a href={this.props.pageLink}>Click here </a>{" "}
                      {getHTMLwithSpan(this.props.pageLinkContent)}
                    </span>
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>

            {this.props.showMoreContentLine && (
              <div
                className={this.state.show ? "hide__content" : "show__content"}
              >
                <p className="list-description">
                  {getHTMLwithSpan(this.props.showMoreContentLine)}
                </p>
              </div>
            )}

            {this.props.showMoreContentLinePoint && (
              <div
                className={this.state.show ? "hide__content" : "show__content"}
              >
                <div className="list-layout">
                  <div className="list">
                    <span>
                      <svg
                        className="list-icon"
                        width="8px"
                        height="16px"
                        viewBox="0 0 8 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.1 0.200012L0.399994 5.8L0.850001 6.20005H4.00002V9.80001H4.90003L7.59999 4.24439L7.26716 3.80003H4.00002V0.200012H3.1Z"
                          fill="#828282"
                        />
                      </svg>
                    </span>
                    {this.props.showMoreContentLinePoint.includes(":") ? (
                      <p className="list-description">
                        <b>
                          {getHTMLwithSpan(
                            this.props.showMoreContentLinePoint.substring(
                              0,
                              this.props.showMoreContentLinePoint.indexOf(":")
                            )
                          )}
                        </b>
                        {getHTMLwithSpan(
                          this.props.showMoreContentLinePoint.substring(
                            this.props.showMoreContentLinePoint.indexOf(":")
                          )
                        )}
                      </p>
                    ) : (
                      <p className="list-description">
                        {getHTMLwithSpan(this.props.showMoreContentLinePoint)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {this.props.showMoreText && (
              <div
                className={`width_100_per ${
                  this.state.show ? "hide__content " : "show__content"
                }`}
                onClick={this.toggle}
              >
                <div className="align__text__icon">
                  <p className="show__hide">{this.props.showMoreText}</p>
                  <div>
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.94 0.726562L4 3.7799L7.06 0.726562L8 1.66656L4 5.66656L0 1.66656L0.94 0.726562Z"
                        fill="#FF1E46"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            {this.props.showLessText && (
              <div
                className={`width_100_per ${
                  this.state.show ? "show__content" : "hide__content"
                }`}
                onClick={this.toggle}
              >
                <div className="align__text__icon">
                  <p className="show__hide">{this.props.showLessText}</p>
                  <div>
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.4425 5.55664L5 2.12164L1.5575 5.55664L0.5 4.49914L5 -0.000859261L9.5 4.49914L8.4425 5.55664Z"
                        fill="#FF1E46"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx global>
          {`
            .list-section a {
              all: inherit;
              display: inline;
              cursor: pointer;
              color: #ff0000;
              font-weight: 500;
            }
          `}
        </style>

        <style jsx>
          {`
            .show__content {
              display: block;
            }
            .hide__content {
              display: none;
            }
            .align__text__icon {
              align-items: center;
              display: flex;
              justify-content: flex-end;
              cursor: pointer;
            }
            .width_100_per {
              width: 100%;
            }
            .show__hide {
              font-weight: 500;
              font-size: 12px;
              line-height: 16px;
              color: #ff1e46;
              margin-right: 5px;
            }
            .list-colored {
              background: #f0f0f0;
            }
            .list-layout {
              padding: 0;
              justify-content: flex-start;
              flex-direction: column;
              span {
                margin: 0 8px 0 0;
              }
            }
            .list-section a {
              all: inherit;
              display: inline;
              cursor: pointer;
              color: #ff0000;
              font-weight: 500;
            }
            .list-section {
              .section-header--medium {
                margin-bottom: 24px;
              }
            }

            .list-description {
              font-size: 12px;
              line-height: 16px;
              text-align: left;
              margin: 0 0 20px 0;
            }
            .start--title {
              color: #4a4a4a;
              font-style: normal;
              font-weight: 500;
              font-size: 12px;
              line-height: 16px;
              justify-content: flex-start;
              text-align: left;
            }
            .reduceMargin {
              margin-top: -24px;
            }
            .h3__left-align {
              text-align: left !important;
            }
            .list {
              display: flex;
              align-items: stretch;
              .list-description {
                margin: 0 0 12px 0;
              }
            }

            .list-row-aligned {
              justify-content: flex-start;
            }
            .list-description-center {
              max-width: 830px;
              margin: auto;
            }
            .know-more a {
              font-size: 12px;
              line-height: 16px;
              text-align: left;
            }
            .know-more a {
              color: #ff0000;
            }

            .esports-points-distribution {
              .section-header {
                font-size: 16px;
                line-height: 24px;
                color: rgba(0, 0, 0, 0.8);
                font-weight: 500;
                text-align: left;
                width: 100%;
                margin-left: 8px;
              }
              .list-icon {
                display: none;
              }
            }

            @media screen and (min-width: 768px) {
              .show__content_min_768 {
                display: block !important;
              }

              .show__content {
                display: none;
              }
              .hide__content {
                display: none;
              }
              .list-colored {
                background: #fff;
              }
              .start--title {
                justify-content: center;
                font-size: 14px;
                line-height: 19px;
                text-align: center;
              }
              .h3__left-align {
                padding: 0 110px;
              }
              .list-layout {
                padding: 0 110px;
                span {
                  margin: 0 16px 0 0;
                }
              }
              .list-description {
                font-size: 14px;
                line-height: 19px;
              }

              .list {
                .list-description {
                  margin: 0 0 12px 0;
                }
                .list-icon {
                  width: 12px;
                  height: 16px;
                }
              }
              .list-row-aligned {
                justify-content: center;
              }
              .know-more a {
                font-size: 14px;
                line-height: 19px;
                text-align: center;
              }
            }

            @media screen and (min-width: 1224px) {
              .list-layout {
                width: 830px;
                padding: 0;
                margin: auto;
                span {
                  margin: 0 16px 0 0;
                }
              }
              .start--title {
                font-size: 20px;
                line-height: 28px;
              }
              .reduceMargin {
                margin-top: -120px;
              }
              .h3__left-align {
                width: 830px;
                margin-left: auto;
                margin-right: auto;
              }
              .list-description {
                font-size: 20px;
                line-height: 28px;
                margin: 0 0 56px 0;
              }

              .list-section {
                .section-header--medium {
                  margin-bottom: 56px;
                }
              }

              .list {
                .list-description {
                  margin: 0 0 24px 0;
                }
                .list-icon {
                  width: 14px;
                  height: 28px;
                }
              }
              .know-more a {
                font-size: 20px;
                line-height: 28px;
              }
            }
          `}
        </style>
      </section>
    );
  }
}

export default ListPointsShowMore;
