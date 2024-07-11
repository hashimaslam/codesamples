import React, { Component } from "react";
import { getHTMLwithSpan } from "../configs/util";
export const H1Header = (props) => (
  <>
    <h1 className="section-header--large ">{props.data.header}</h1>
  </>
);
export const H2Header = (props) => (
  <div>
    <h2
      className={`section-header--medium ${
        props.data.cssClassList ? props.data.cssClassList.join(" ") : ""
      }`}
    >
      {props.data.header}
    </h2>
    <style jsx>{`
      .margin--bottom {
        margin-bottom: 16px !important;
      }
      @media screen and (min-width: 768px) {
        .margin--bottom {
          margin-bottom: 24px !important;
        }
      }
      @media screen and (min-width: 1224px) {
        .margin--bottom {
          margin-bottom: 56px !important;
        }
      }
    `}</style>
  </div>
);
export const H3Header = (props) => (
  <div>
    <h3 className="section-header--h3">{props.data.header}</h3>
  </div>
);
export const WithOrWithoutIconSubHeading = (props) => (
  <div className="section__wrapper">
    {props.data.iconUrl && (
      <img
        className="icon__img--css lazy-image"
        data-src={props.data.iconUrl}
        alt={props.data.header}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
      />
    )}
    <h3 className="section-header--h3 margin--none">{props.data.header}</h3>
    <style jsx>{`
      .margin--none {
        margin: 0 !important;
      }
      .icon__img--css {
        margin-right: 16px;
      }
      .section__wrapper {
        display: flex;
        align-items: center;
      }
      @media screen and (min-width: 768px) {
        .faqs__box__text--description {
          text-align: center;
        }
        .section__wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    `}</style>
  </div>
);
export const Note = (props) => (
  <div className="box__para__top-margin">
    {props.data.map((row, key) => (
      <p className="box__note--text" key={key}>
        {row}
      </p>
    ))}
    <style jsx>
      {`
        .box__para__top-margin {
          margin-top: 24px;
          text-align: left;
        }
      `}
    </style>
  </div>
);
export const Description = (props) => (
  <div
    className={`box__para__top-margin ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    }`}
  >
    {props.data.map((row, key) => (
      <p className="faqs__box__text--description" key={key}>
        {getHTMLwithSpan(row)}
      </p>
    ))}
    <style jsx>
      {`
        .box__para__top-margin {
          margin-top: 16px;
        }
        .margin--none {
          margin: 0 !important;
        }
      `}
    </style>
  </div>
);

export const OutSideDescription = (props) => (
  <div
    className={`box__para__top-margin ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    }`}
  >
    {props.data.map((row, key) => (
      <p className="faqs__box__text--description" key={key}>
        {getHTMLwithSpan(row)}
      </p>
    ))}
    <style jsx>
      {`
        .box__para__top-margin {
          margin-top: 16px;
        }
        .margin--none {
          margin: 0 !important;
        }
        .reduce__margin {
          margin-top: -44px;
        }
        @media screen and (min-width: 768px) {
          .faqs__box__text--description {
            text-align: center;
          }
        }
        @media screen and (min-width: 1224px) {
          .reduce__margin {
            margin-top: -88px;
          }
        }
      `}
    </style>
  </div>
);

export const CardImage = (props) => (
  <div
    className={`${
      props.data.cssClassList ? props.data.cssClassList.join(" ") : ""
    }`}
  >
    <img
      data-src={props.data.imgUrl}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
      className="lazy-image"
    />
    <style jsx>{`
      .tips_top__image {
        margin-top: 24px;
      }
      @media screen and (min-width: 768px) {
        .tips_top__image {
          margin-top: 36px;
        }
      }
      @media screen and (min-width: 1224px) {
        .tips_top__image {
          margin-top: 56px;
        }
      }
    `}</style>
  </div>
);

export const CardNumberWithTypeLogo = (props) => (
  <p
    className={`content_align_left ${
      props.data.cssClassList ? props.data.cssClassList.join(" ") : ""
    }`}
  >
    <span className="left--space">
      {props.data.text ? props.data.text : ""}
    </span>
    {props.data.NumberLogoLine.map((val, key) => (
      <span key={key} className="left--space">
        <span>{val[0]}</span>
        <span className={val[2]}>{val[1]}</span>
      </span>
    ))}

    <style jsx>{`
      .left--space {
        margin-right: 5px;
      }
      .red--color {
        color: red;
      }
      .black--color {
        color: black;
      }
      .content_align_left {
        text-align: left;
        display: flex;
        flex-wrap: wrap;
      }
      .reduce__margin {
        margin: 0;
        margin-top: -10px;
      }
      @media screen and (min-width: 768px) {
        .not__faqs {
          text-align: center;
          justify-content: center;
        }
        .reduce__margin {
          margin-top: -16px;
        }
      }
    `}</style>
  </p>
);

export const WithoutShapeListRows = (props) => (
  <div>
    {props.data.map((row, key) => (
      <p className="faqs__box__text box__row__margin--left" key={key}>
        {getHTMLwithSpan(row)}
      </p>
    ))}
    <style jsx>
      {`
        .list {
          display: flex;
          align-items: stretch;
        }
        .box__row__margin--left {
          margin-left: 32px;
        }
      `}
    </style>
  </div>
);
export const WithoutShapeListRowsCenterAlign = (props) => (
  <div>
    {props.data.map((row, key) => (
      <p
        className="faqs__box__text box__row__margin--left align--center"
        key={key}
      >
        {getHTMLwithSpan(row)}
      </p>
    ))}
    <style jsx>
      {`
        .list {
          display: flex;
          align-items: stretch;
        }
        .align--center {
          text-align: center !important;
        }
        .faqs__box__text {
          margin-left: 0px !important;
        }
        .heading_text {
          font-weight: 500 !important;
          color: #190a28 !important;
        }
        @media screen and (min-width: 768px) {
          .box__row__margin--left {
            margin-left: 32px !important;
          }
        }
      `}
    </style>
  </div>
);

export const WithShapeListRows = (props) => (
  <div
    className={`box__para__top-margin ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    }`}
  >
    {props.data.map((list, key) => (
      <div className="faqs__box__list" key={key}>
        <span>
          <svg
            className="box__list-icon"
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
        <p className="faqs__box__text">{getHTMLwithSpan(list)}</p>
      </div>
    ))}
    <style jsx>
      {`
        .box__para__top-margin {
          margin-top: 24px;
        }
        .box__para__bottom-margin {
          margin-bottom: 24px !important;
        }
      `}
    </style>
  </div>
);
export const Content = (props) => {
  if (!props.showBlock) return <div />;
  return (
    <div>{props.content.map((data, key) => componentLookUp(data, key))}</div>
  );
};

export const FaqsBox = (props) => (
  <div className="box">
    <div
      className="showBarItem"
      onClick={
        !props.ids.includes(props.id)
          ? () => props.showParagraph(props.id)
          : () => props.hideParagraph(props.id)
      }
    >
      <h3 className="section-header--small box__color">{props.header}</h3>
      {!props.ids.includes(props.id) ? (
        <div className="dash--plus plus"></div>
      ) : (
        <div className="dash--plus dash"></div>
      )}
    </div>
    <Content content={props.content} showBlock={props.ids.includes(props.id)} />
    <style jsx>{`
      .showBarItem {
        justify-content: space-between;
        display: flex;
        align-items: center;
        cursor: pointer;
        text-align: left;
      }
      .box__color {
        color: #4a4a4a;
        margin: 0px;
      }
      .dash--plus {
        width: 0;
        height: 0;
        cursor: pointer;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
      }
      .dash {
        border-bottom: 5px solid #4a4a4a;
        border-top: none;
      }
      .plus {
        border-top: 5px solid #4a4a4a;
        border-bottom: none;
      }
      .box {
        border: 1px solid #e6e6e6;
        box-sizing: border-box;
        border-radius: 4px;
        padding: 16px 12px;
        margin: 12px 0px;
      }
      @media screen and (min-width: 1224px) {
        .box {
          border-radius: 8px;
          padding: 20px;
        }
      }
    `}</style>
  </div>
);
class FaqsComponent extends Component {
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
    return (
      <div>
        {this.props.data.map((faq, key) => (
          <FaqsBox
            ids={this.state.ids}
            showParagraph={this.showParagraph}
            hideParagraph={this.hideParagraph}
            key={key}
            id={key}
            {...faq}
          />
        ))}
      </div>
    );
  }
}
export const TabularDataComponent = (props) => {
  //console.log(props.data.map(row=>row));
  const cells = props.data[0].length;
  const cellWidth = 100 / cells + "%";
  return (
    <div className="table">
      {props.data &&
        props.data.map((row, key) => (
          <div
            key={key}
            className={key % 2 === 0 ? "point-row-white" : "point-row-grey"}
          >
            {row.map((cell, key) => (
              <div style={{ flex: cellWidth }} key={key}>
                <p>{getHTMLwithSpan(cell)}</p>
              </div>
            ))}
          </div>
        ))}

      <style jsx>{`
        .point-row-white {
          display: flex;
          flex-direction: row;
          padding: 16px 8px;
          justify-content: space-between;
        }
        .point-row-grey {
          display: flex;
          flex-direction: row;
          padding: 16px 8px;
          background: #f0f0f0;
          justify-content: space-between;
        }
        .color--red {
          color: #ff1e46 !important;
        }
      `}</style>
    </div>
  );
};

export const TabularDataRummyComponent = (props) => {
  //console.log(props.data.map(row=>row));
  const cells = props.data[0].length;
  const cellWidth = 95 / cells + "%";
  return (
    <div className="box__dekstop">
      <div className="table">
        {props.data &&
          props.data.map((row, key) => (
            <div
              key={key}
              className={key % 2 === 0 ? "point-row-white" : "point-row-grey"}
            >
              {row.map((cell, key) => (
                <div style={{ flex: cellWidth }} key={key}>
                  <p className={key % 2 == 0 ? "left__algin" : "right__align"}>
                    {getHTMLwithSpan(cell)}
                  </p>
                </div>
              ))}
            </div>
          ))}
      </div>
      <style jsx>{`
        .point-row-white {
          display: flex;
          flex-direction: row;
          padding: 16px 8px;
          justify-content: space-between;
        }
        .point-row-grey {
          display: flex;
          flex-direction: row;
          padding: 16px 8px;
          background: #f0f0f0;
          justify-content: space-between;
        }
        .left__algin {
          text-align: left;
        }
        .right__algin {
          text-align: right;
        }
        p {
          margin: 0;
        }

        @media screen and (min-width: 768px) {
          .point-row-grey {
            background: #ffffff;
          }
          .table {
            border: ${props.border ? props.border : "1px solid #e6e6e6"};
            box-sizing: border-box;
            border-radius: 4px;
            padding: 16px 12px;
            margin: 12px 0px;
          }
        }
        @media screen and (min-width: 1224px) {
          .box__dekstop {
            width: ${props.width ? props.width : "68%"};
            margin: auto;
          }
        }
      `}</style>
    </div>
  );
};

export const factoryComponets = {
  H1Header: H1Header,
  H2Header: H2Header,
  Note: Note,
  Description: Description,
  WithShapeListRows: WithShapeListRows,
  WithoutShapeListRows: WithoutShapeListRows,
  Content: Content,
  FaqsComponent: FaqsComponent,
  TabularDataComponent: TabularDataComponent,
  CardNumberWithTypeLogo: CardNumberWithTypeLogo,
  CardImage: CardImage,
  OutSideDescription: OutSideDescription,
  TabularDataRummyComponent: TabularDataRummyComponent,
  WithoutShapeListRowsCenterAlign: WithoutShapeListRowsCenterAlign,
  H3Header: H3Header,
  WithOrWithoutIconSubHeading: WithOrWithoutIconSubHeading,
};

const componentLookUp = (data, key) => {
  const Component = factoryComponets[data.name];
  return <Component {...data} key={key} />;
};
const Faqs = (props) => (
  <section
    className={`section ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    }`}
  >
    <div className="container">
      <div className={"section-layout section__width"}>
        {props.content.map((data, key) => componentLookUp(data, key))}
      </div>
    </div>
    <style jsx>
      {`
        .grey__background {
          background: #f0f0f0 !important;
        }
        .section__container {
          padding: 32px 24px;
        }
        .remove__top__padding {
          margin-top: -48px !important;
        }
        @media screen and (min-width: 768px) {
          .grey__background {
            background: #ffffff !important;
          }
          .remove__top__padding {
            margin-top: -88px !important;
          }
        }
        @media screen and (min-width: 1224px) {
          .section__width {
            width: 68%;
            margin: auto;
          }
          .not__faqs {
            .section__width {
              width: 100%;
            }
          }
          .remove__top__padding {
            margin-top: -176px !important;
          }
        }
      `}
    </style>
    <style jsx global>
      {`
        .faqs__box__text {
          font-size: 12px;
          line-height: 16px;
          color: #828282;
          text-align: left;
          margin-left: 16px;
        }
        .faqs__box__text--description {
          font-size: 12px;
          line-height: 16px;
          color: #828282;
          text-align: left;
        }
        .faqs__box__text--description a {
          display: inline;
          cursor: pointer;
          color: #ff1e46;
          -webkit-text-fill-color: #ff1e46;
          -webkit-text-decoration: underline;
          text-decoration: underline;
        }
        @media screen and (min-width: 1224px) {
          .faqs__box__text--description a {
            font-size: 20px;
            line-height: 28px;
          }
        }

        .box__note--text {
          font-size: 10px;
          line-height: 12px;
          color: #828282;
        }
        .faqs__box__list {
          display: flex;
          align-items: center;
        }
        .box__list-icon {
          width: 12px;
          height: 16px;
        }
        .heading_text {
          font-weight: 500 !important;
          color: #190a28 !important;
        }
        .color--red {
          color: #ff1e46 !important;
        }
        .rules-of-rummy {
          .section__width {
            .box .showBarItem {
              // display:none;
            }
            .dash,
            .plus {
              //display:none;
            }
          }
        }
        .section-header--h3 {
          font-weight: 500;
          font-size: 12px;
          line-height: 16px;
          color: #4a4a4a;
          margin: 0;
          margin-bottom: -24px;
          text-align: left;
        }
        @media screen and (min-width: 768px) {
          .faqs__box__text--description,
          .faqs__box__text {
            font-size: 14px;
            line-height: 18px;
          }
          .grey__background {
            background: #ffffff !important;
          }
          .section-header--h3 {
            font-size: 14px;
            line-height: 18px;
            text-align: center;
          }
        }
        @media screen and (min-width: 1224px) {
          .faqs__box__text--description,
          .faqs__box__text {
            font-size: 20px;
            line-height: 28px;
          }
          .box__note--text {
            font-size: 12px;
            line-height: 16px;
          }

          .box__list-icon {
            width: 14px;
            height: 18px;
          }
          .section-header--h3 {
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
            text-align: center;
            color: #828282;
            margin-bottom: -20px;
          }
        }
      `}
    </style>
  </section>
);

export default Faqs;
