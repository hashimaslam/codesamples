import React, { Component } from "react";

const Pargraph = ({ subParagraph, showBlock, esportsShow, cssClassList }) => {
  if (showBlock || esportsShow) {
    return (
      <div
        className={`para-expand ${cssClassList ? cssClassList.join(" ") : ""}`}
        style={{ display: "block" }}
      >
        {subParagraph &&
          subParagraph.map((item, index) =>
            item.value.includes("}") ? (
              // <span className="list-points-toggle-paragrah" key={index}><b>{item.substring(0,item.indexOf('}'))}</b>{item.substring(item.indexOf('}')+1)}</span>
              <span></span>
            ) : (
              <div
                className={`para-container ${index % 2 === 0 ? "even" : "odd"}`}
                key={index}
              >
                <span className="list-points-toggle-paragrah rank">
                  {item.key}
                </span>
                <span className="list-points-toggle-paragrah points">
                  {item.value}
                </span>
              </div>
            )
          )}

        <style jsx>
          {`
            // .fantasy-games-para-header{
            //     font-size: 12px;
            //     font-weight: 500;
            //     font-stretch: normal;
            //     letter-spacing: normal;
            //     color: #4A4A4A;
            //     margin-top: 16px;
            //     line-height: 16px;
            //     margin-bottom: 8px;
            // }

            .list-points-toggle-paragrah {
              font-size: 14px;
              line-height: 18px;
            }

            .list-points-toggle-paragrah {
              font-size: 12px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 16px;
              letter-spacing: normal;
              color: #828282;
              margin-top: 10px;
              &.rank {
                width: 80%;
                word-break: break-all;
              }
              &.points {
                width: 20%;
                word-break: break-all;
              }
            }

            .para-expand {
              margin: 0 auto;
              text-align: left;
              .para-container {
                display: flex;
                justify-content: space-between;
                padding: 16px 8px;
                &.odd {
                  background-color: #f0f0f0;
                }
              }
            }
            .know-more-reactangle {
              display: flex;
              justify-content: flex-end;
              cursor: pointer;
              padding-top: 12px;
            }
            .know-more-reactangle > .know-more-text {
              font-size: 12px;
              font-weight: 500;
              font-stretch: normal;
              line-height: normal;
              letter-spacing: normal;
              color: #ff1e46;
              text-decoration: none;
              padding: 8px 12px;
              border: 1px solid #ff1e46;
              border-radius: 2px;
              line-height: 16px;
              text-decoration: none;
            }

            .esports-points-distribution {
              .para-container {
                padding: 8px 16px;
                justify-content: space-around;
                &.odd{
                  background-color:#FAFAFA;
                }
              }
              .list-points-toggle-paragrah {
                &.rank {
                  font-size: 14px;
                  line-height: 18px;
                  color: #828282;
                  margin: 0;
                  width: 75%;
                }
                &.points {
                  font-size: 14px;
                  line-height: 18px;
                  color: #4a4a4a;
                  margin: 0;
                  width: 25%;
                  text-align:right;
                }
              }
            }

            @media screen and (min-width: 1224px) {
              .list-points-toggle-paragrah {
                font-size: 17px;
                line-height: 20px;
                margin: 5px 0;
              }
            }
          `}
        </style>
      </div>
    );
  } else {
    return <div></div>;
  }
};
class ListPointsToggle extends Component {
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
    // if(!faqsBlock)
    //     return "";
    return (
      // <section className={ `list-points-toggle ${props.cssClassList ? props.cssClassList.join(" ") : " "`}"}>
      <section
        className={`list-points-toggle-section  ${
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
                            <h3 className="fantasy-games-header">
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
                      {faq.columnHeader && (
                        <div className="column-header">
                          <span>{faq.columnHeader.first}</span>{" "}
                          <span>{faq.columnHeader.second}</span>
                        </div>
                      )}
                      <Pargraph
                        showBlock={this.state.ids.includes(key)}
                        subParagraph={
                          faq.subParagraphes ? faq.subParagraphes : undefined
                        }
                        esportsShow={this.props.esportsShow}
                        cssClassList={this.props.cssClassList}
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
            .list-points-toggle-section {
              background: #f0f0f0;
            }
            .list-points-toggle-section.white-backgound {
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
            }
            .fantasy-games-header {
              font-size: 12px;
              line-height: 16px;
              text-align: left;
              margin: 0;
            }

            .esports-points-distribution {
              .some-of-Our-Top-Game-header,
              .description {
                text-align: left;
                font-weight: 500;
                font-size: 16px;
                line-height: 24px;
              }
              .description {
                color:rgba(25, 10, 40, 0.6);
                font-size: 14px;
                line-height: 20px;
              }

              &.list-points-toggle-section {
                background-color: #fff;
                .dash {
                  border: none;
                }
                .plus {
                  border: none;
                }

                .column-header {
                  background: #f0f0f0;
                  font-size: 10px;
                  line-height: 14px;
                  color: #b4b4b4;
                  height: 24px;
                  font-weight: bold;
                  display: flex;
                  justify-content: space-between;
                  padding: 5px 16px;
                  align-items: center;
                }
                .game-reactangle {
                  border: 1px solid #f0f0f0;
                  padding: 0;
                }
              }
            }
            @media screen and (min-width: 768px) {
              .list-points-toggle-section {
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
                width: 68%;
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
              .fantasy-games-header {
                font-size: 20px;
                line-height: 28px;
                margin: 8px 0;
                color: #4a4a4a;
              }

              .description {
                font-size: 17px;
                line-height: 20px;
              }

              .esports-points-distribution.list-points-toggle-section .column-header{
                font-size:14px;
              }
            }
          `}
        </style>
      </section>
    );
  }
}

export default ListPointsToggle;
