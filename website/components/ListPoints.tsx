import { getHTML,getHTMLParagraph } from "../configs/util";
export const ListPoints = (props) => (
  <section
    className={`list-section ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    }  ${props.device} ${props.page}`}
  >
    <div className="container">
      <div className="section-layout">
        <div className="row">
          {props.header ? (
            <h2 className="section-header section-header--medium">
              {props.header}
            </h2>
          ) : (
            ""
          )}
        </div>
        {props.h3Title ? (
          <h3
            className={`start--title  ${
              props.reduceMarginH3 ? props.reduceMarginH3 : ""
            }  ${props.h3LeftAlign ? "h3__left-align" : ""}`}
            style={{}}
          >
            {props.h3Title}
          </h3>
        ) : (
          ""
        )}
      
        <div className="row list-row-aligned">
          {props.description
            ? props.description.map((des, key) => (
                <p className="list-description" key={key}>
                  {/* {getHTML(des)} */}
                  {props.ishtmlContent ? getHTMLParagraph(des) : getHTML(des)}
                </p>
              ))
            : ""}
        </div>
        {props.paragraph &&
          <p className="paragraph">{getHTMLParagraph(props.paragraph)}</p>
        }
        <div className="row list-layout">
          {props.declareGameList
            ? props.declareGameList.map((item, key) => (
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
                  {(item.includes(":") && item.indexOf('www') == -1 )? (
                    <p className="list-description">
                      
                      <b>{getHTML(item.substring(0, item.indexOf(":")))}</b>
                      {props.ishtmlContent ? getHTMLParagraph(item.substring(item.indexOf(":"))) : getHTML(item.substring(item.indexOf(":")))}
                    
                    </p>
                  ) : (
                    <p className="list-description"> {props.ishtmlContent ? getHTMLParagraph(item) : getHTML(item)}</p>
                  )}
                </div>
              ))
            : ""}
        </div>

        {props.summaryList
          ? props.summaryList.map((info, key) => (
              <div className="row list-row-aligned" key={key}>
                <p className="list-description">
                  {props.ishtmlContent ? getHTMLParagraph(info) : getHTML(info)}
                </p>
              </div>
            ))
          : ""}
        {props.pageLink ? (
          <div className="row list-row-aligned">
            <p className="list-description">
              <span className="know-more">
                <a href={props.pageLink}>Click here </a>{" "}
               
                {props.ishtmlContent ? getHTMLParagraph(props.pageLinkContent) : getHTML(props.pageLinkContent)}
              </span>
            </p>
          </div>
        ) : (
          ""
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
          -webkit-text-fill-color: #ff1e46;
        }
      `}
    </style>

    <style jsx>
      {`
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
            text-align:left;
            width: 100%;
            margin-left: 8px;
          }
          .list-icon {
            display: none;
          }
        }

        .paragraph{
          color:#000;
        }

        @media screen and (min-width: 768px) {
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
          .list-section.esports-points-distribution {
            .section-header--medium {
              text-align: center;
              font-weight:bold;
              font-size: 28px;
            }
          }
        }
      `}
    </style>
  </section>
);
