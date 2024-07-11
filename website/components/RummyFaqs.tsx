import React, { Component } from "react";
import { getHTML,getHTMLParagraph } from "../configs/util";

const Pargraph = ({ subParagraph, showBlock, cssClassList }) => {
  if (showBlock) {
    return (
      <div
        className={`para-expand ${cssClassList ? cssClassList.join(" ") : ""}`}
        style={{ display: "block" }}
      >
        {subParagraph &&
          subParagraph.map((item, index) =>
            item.includes("}") ? (
              <p className="fantasy-games-paragrah" key={index}>
                <b>{getHTML(item.substring(0, item.indexOf("}")))}</b>
                {getHTML(item.substring(item.indexOf("}") + 1))}
              </p>
            ) : (
              <p className="fantasy-games-paragrah" key={index}>
                {getHTMLParagraph(item)}
              </p>
            )
          )}

        <style jsx global>
          {`
            .fantasy-games-paragrah a {
              all: inherit;
              display: inline;
              cursor: pointer;
              color: #ff1e46;
              -webkit-text-fill-color: rgba(255, 30, 70, 1);
              text-decoration: underline;
            }
          `}
        </style>
        <style jsx>
          {`
            .fantasy-games-para-header {
              font-size: 12px;
              font-weight: 500;
              font-stretch: normal;
              letter-spacing: normal;
              color: #4a4a4a;
              margin-top: 16px;
              line-height: 16px;
              margin-bottom: 8px;
            }

            .fantasy-games-paragrah {
              font-size: 12px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 16px;
              letter-spacing: normal;
              color: #828282;
              margin-top: 10px;
              font-size: 14px;
              line-height: 22px;
            }

            .para-expand {
              margin: 0 auto;
              text-align: left;
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

            .esports-leauge-rules-faq {
              .fantasy-games-header {
                font-size: 14px;
                line-height: 20px;
              }
            }

           
            @media screen and (min-width: 1224px) {
              .fantasy-games-paragrah {
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
class RummyFaqs extends Component {
  constructor() {
    super();
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
      // <section className={ `rummy-faqs ${props.cssClassList ? props.cssClassList.join(" ") : " "`}"}>
      <section
        className={`rummy-faqs  ${
          this.props.cssClassList ? this.props.cssClassList.join(" ") : ""
        } ${this.props.page}`}
      >
        <div className="container">
          <div className="section-layout">
            <div className="row">
              <div className="topGameWrapper">
                {this.props.header ? (
                  H1Header ? (
                    <h1 className="some-of-Our-Top-Game-header section-header main-header">
                      {getHTML(this.props.header)}
                    </h1>
                  ) : (
                    <h2 className="some-of-Our-Top-Game-header section-header">
                      {getHTML(this.props.header)}
                    </h2>
                  )
                ) : (
                  ""
                )}
                <div>
                  {this.props.faqsList.map((faq, key) => (
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
                      <Pargraph
                        showBlock={this.state.ids.includes(key)}
                        subParagraph={
                          faq.subParagraphes ? faq.subParagraphes : undefined
                        }
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
            .rummy-faqs {
              background: #f0f0f0;
            }
            .rummy-faqs.white-backgound {
              background-color: #fff;
              .game-reactangle {
                border: 1px solid #E6E6E6;
              }
            }
            .topGameWrapper {
              width: 100%;
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
            .rummy-faqs.esports-leauge-rules-faq {
              background: #fff;
              .game-reactangle {
                border: 1px solid #e6e6e6;
              }
            }
            
            @media screen and (min-width: 768px) {
              .rummy-faqs {
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
            }
          `}
        </style>
        <style jsx global>
         {
           `
          
           
           `
         }
        </style>
      </section>
    );
  }
}

export default RummyFaqs;
