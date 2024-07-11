import React, { Component } from "react";

const Pargraph = ({ subParagraph, showBlock, description, headerList }) => {
  if (showBlock) {
    return (
      <>
        <div className="para-expand">
          <p
            className="content-list-points-description"
            style={{ display: "block" }}
          >
            {description}
          </p>
          <div className={`content-list-points-header`}>
            {headerList.map((header) => (
              <span>{header}</span>
            ))}
          </div>
          {subParagraph &&
            subParagraph.map((item, index) =>
              item.studentInfo.college.includes("}") ? (
                <span></span>
              ) : (
                <div className={`content-list-points-container`} key={index}>
                  <span className="serial-no">{item.serialNo}</span>

                  <div className="content-info">
                    {item.studentInfo.name && (
                      <span className="winner-name">
                        {item.studentInfo.name}
                      </span>
                    )}
                    {item.studentInfo.college && (
                      <span className="college">{item.studentInfo.college}</span>
                    )}
                    {item.studentInfo.amount && (
                      <span className="prize-money">
                        {item.studentInfo.amount}
                      </span>
                    )}
                  </div>
                  <span className="points">{item.result}</span>
                </div>
              )
            )}

          <style jsx>
            {`
              .content-list-points-description {
                text-align: left;
                color: #828282;
                font-size: 12px;
                line-height: 15px;
              }
              .content-list-points-header {
                display: flex;
                justify-content: space-between;
                background: #f0f0f0;
                padding: 5px;
                span {
                  font-size: 10px;
                  line-height: 14px;
                  font-weight: bold;
                  color: rgba(0,0,0,0.5);
                }
              }
              .content-list-points-container {
                font-weight: 500;
                font-size: 14px;
                line-height: 18px;
                padding: 24px 14px;
                .serial-no{
                 width:10%;
                 text-align:center;
                 word-break: break-word;
                }
                .content-info {
                  display: flex;
                  flex-direction: column;
                  width:74%;
                  text-align:center;
                  word-break: break-word;
                  padding: 0 3px;
                }
                .winner-name {
                  color: #828282;
                }
                .prize-money {
                  font-weight: normal;
                  font-size: 12px;
                  line-height: 16px;
                  color: #19be00;
                  text-align:center;
                  word-break: break-word;
                }
                .points {
                  color: #828282;
                  font-style: normal;
                  font-weight: 500;
                  font-size: 12px;
                  line-height: 16px;
                  width:15%;
                  text-align:center;
                  word-break: break-all;
                }
              }
              .para-expand {
                margin: 0 auto;
                text-align: left;
                .content-list-points-container {
                  display: flex;
                  justify-content: space-between;
                  padding: 24px 14px;
                  border-bottom: solid 1px #f0f0f0;
                  color: #4a4a4a;
                }
                .content-list-points-container:last-child {
                  border-bottom: none;
                }
              }

              @media screen and (min-width: 1224px) {
                .content-list-points-container {
                  font-size: 17px;
                  .points {
                    font-size: 17px;
                  }
                }
                .content-list-points-description {
                  font-size: 17px;
                }
                .content-list-points-header {
                  padding: 10px 5px;
                  span {
                    font-size: 17px;
                  }
                }
              }
            `}
          </style>
        </div>
      </>
    );
  } else {
    return <div></div>;
  }
};
class ContentListPointsToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { ids: [] };
  }
  showParagraph = (id) => {
    this.setState((prevState) => ({
      ids: [...prevState.ids, id],
    }));
  };
  hideParagraph = (id) => {
    const arr = [...this.state.ids];
    const index = arr.indexOf(parseInt(id));
    arr.splice(index, 1);
    this.setState({
      ids: [...arr],
    });
  };
  render() {
    const { H1Header, WhiteBackground, updateGameRectangle } = this.props;

    return (
      <section
        className={`content-list-points-toggle-section  ${
          this.props.cssClassList ? this.props.cssClassList.join(" ") : ""
        }`}
      >
        <div className="container">
          <div className="section-layout">
            <div className="row">
              <div className="topGameWrapper">
                {this.props.header ? (
                  H1Header ? (
                    <h1 className="some-of-Our-Top-Game-header section-header main-header">
                      {this.props.header}
                    </h1>
                  ) : (
                    <h2 className="some-of-Our-Top-Game-header section-header">
                      {this.props.header}
                    </h2>
                  )
                ) : (
                  ""
                )}
                {this.props.descriptionList.map((text, key) => {
                  return (
                    <p key={key} className="description">
                      {text}
                    </p>
                  );
                })}
                <div>
                  {this.props.informationList.map((faq, key) => (
                    <div
                      className={
                        this.props.cssFaqsClassList
                          ? this.props.cssFaqsClassList.join(" ")
                          : "game-reactangle"
                      }
                      key={key}
                    >
                      <div>
                        <div
                          className="showBarItem"
                          onClick={
                            !this.state.ids.includes(key)
                              ? () => this.showParagraph(key)
                              : () => this.hideParagraph(key)
                          }
                        >
                          <div className="wrapperImgHeader">
                            <img src={faq.headerImageurl.png} />
                            <h3 className="content-list-points-header">
                              {faq.header}
                            </h3>
                          </div>
                          {!this.state.ids.includes(key) ? (
                            <div className="plus"></div>
                          ) : (
                            <div className="dash"></div>
                          )}
                        </div>
                      </div>
                      <Pargraph
                        showBlock={this.state.ids.includes(key)}
                        subParagraph={
                          faq.subParagraphList
                            ? faq.subParagraphList
                            : undefined
                        }
                        description={faq.description}
                        headerList={faq.headerList}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>
          {`
            //TO DO :- need to remove all these css
            // .white-backgound{
            //   background-color: #fff;
            // }
            .radius-reactangle {
              border: 1px solid #e6e6e6;
              box-sizing: border-box;
              border-radius: 4px;
              margin: 12px auto;
              padding: 12px;
            }
            .content-list-points-toggle-section {
              background: #f0f0f0;
            }
            .content-list-points-toggle-section.white-backgound {
              background-color: #fff;
            }
            .topGameWrapper {
              width: 100%;
            }
            .description {
              font-size: 12px;
              line-height: 16px;
            }
            .some-of-Our-Top-Game-header {
              color: #222222;
              font-weight: bold;
              font-size: 14px;
              line-height: 18px;
              // margin-bottom: 24px;
              text-transform: none;
              &.main-header {
                font-size: 16px;
                line-height: 20px;
                text-transform: capitalize;
              }
            }
            .game-reactangle {
              margin: 12px auto;
              border-radius: 4px;
              background-color: #ffffff;
              padding: 12px;
            }
            .dash {
              width: 0;
              height: 0;
              border-bottom: 5px solid #4a4a4a;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: none;
              cursor: pointer;
            }
            .plus {
              width: 0;
              height: 0;
              border-top: 5px solid #4a4a4a;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-bottom: none;
              cursor: pointer;
            }
            .game-img {
              border-radius: 4px;
              height: 32px;
              width: 32px;
            }
            .showBarItem {
              justify-content: space-between;
              display: flex;
              align-items: center;
              cursor: pointer;
            }
            .wrapperImgHeader {
              display: flex;
              align-items: center;
              margin-right: 20px;
              img {
                margin: 0 12px 0 0;
              }
            }
            .content-list-points-header {
              font-size: 12px;
              line-height: 16px;
              text-align: left;
              margin: 0;
              color: #4a4a4a;
              font-weight: 500;
            }
            @media screen and (min-width: 768px) {
              .content-list-points-toggle-section {
                background-color: #fff;
              }
              .radius-reactangle,
              .game-reactangle {
                border-radius: 8px;
                border: 1px solid #e6e6e6;
              }
            }
            @media screen and (min-width: 1224px) {
              .topGameWrapper {
                width: 80%;
              }
              .some-of-Our-Top-Game-header {
                font-size: 36px;
                &.main-header {
                  font-size: 36px;
                }
              }
              .radius-reactangle,
              .game-reactangle {
                padding: 20px;
              }
              .content-list-points-header {
                font-size: 20px;
                line-height: 28px;
                margin: 8px 0;
                color: #4a4a4a;
              }
              .description {
                font-size: 18px;
              }
            }
          `}
        </style>
      </section>
    );
  }
}

export default ContentListPointsToggle;
