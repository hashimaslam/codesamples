import {getHTML,getHTMLParagraph} from "../configs/util";
export const PageInfoParagraph = (props) => (

  <section
    className={`page-info-paragraph-section  ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    } ${props.device} ${props.page}` } 
  >
    <div className="container">
      <div className="section-layout">
        {props.header ? (
          <div className="row">
            {props.header ? (
              props.H1Header ? (
                <h1 className="section-header section-header--medium main-header">
                  {props.header}
                </h1>
              ) : (
                <h2 className="section-header section-header--medium">
                  {props.header}
                </h2>
              )
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        { props.h3Title ? <h3 className={`start--title  ${props.reduceMarginH3 ? props.reduceMarginH3 : ""}`}>{props.h3Title}</h3>:""}
        {props.paragraph && <p className="paragraph">{getHTMLParagraph
        (props.paragraph)}</p>}
        {props.contentList &&
          props.contentList.map((para, key) => (
            <div className="row page-info-row" key={key}>
              <p
                className={`page-info-description  ${
                  props.cssContentClassList
                    ? props.cssContentClassList.join(" ")
                    : ""
                }`}
              >
                {props.ishtmlContent ? getHTMLParagraph(para) : getHTML(para)}
              </p>
            </div>
          ))}
        {props.importantPointsList
          ? props.importantPointsList.map((para, key) => (
              <div className="row page-info-row" key={key}>
                <p className="page-info-description bold-points">
                {props.ishtmlContent ? getHTMLParagraph(para) : getHTML(para)}
                </p>
              </div>
            ))
          : ""}
        {props.pageLink ? (
          <div className="row page-info-row">
            <p className="page-info-description">
              <span className="know-more">
                <a href={props.pageLink}>Click here </a>{" "}
                {/* {getHTML(props.pageLinkContent)} */}
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
        .page-info-paragraph-section a {
          all: inherit;
          display: inline;
          cursor: pointer;
          color: #FF1e46;
          -webkit-text-fill-color: rgba(255, 30, 70, 1);
          text-decoration: underline;
        }
        .page-info-paragraph-section .html-content
         ul
         {
           padding-left:40px;
           list-style:unset;
         li {
          text-align:left;
          text-transform: unset;
          font-size:13px;
        }

      }
       .paragraph{
        font-size: 12px;
        line-height: 16px;
       }

        @media screen and (min-width: 1224px) {
          .page-info-paragraph-section .html-content ul li {
            font-size:18px;
          }
        }
        

      `}
    </style>
    <style jsx>
      {`
        .page-info-paragraph-section {
          .center-align {
            text-align: center !important;
          }
          .page-info-paragraph-section a {
            all: inherit;
            display: inline;
            cursor: pointer;
            color: #ff0000;
            font-weight:normal;
          }
        
          .main-header {
            font-size: 16px;
            line-height: 20px;
            text-transform: capitalize;
          }
          &.how-to-play-info {
            background: #f0f0f0;
            .page-info-description {
              font-size: 14px;
              line-height: 18px;
            }
            &.description-format {
              .page-info-description {
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
         
          .page-info-row {
            justify-content: flex-start;
          }
          .start--title{
            color: #4A4A4A;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            justify-content: flex-start;
            text-align:left;
          }
          .reduceMargin{
            margin-top:-24px;
          }
          .page-info-description,
          .know-more a {
            font-size: 12px;
            line-height: 16px;
            text-align: left;
          }
          .know-more a {
            color: #ff0000;
          }
          .bold-points {
            font-weight: bold;
          }
         
        }

        @media screen and (min-width: 768px) {
          .page-info-paragraph-section {
            .main-header {
              font-size: 20px;
            }
            &.how-to-play-info {
              background: #fff;
              .page-info-description {
                font-size: 14px;
                line-height: 19px;
                text-align: center;
              }
              &.description-format {
                .page-info-description {
                  font-size: 14px;
                  line-height: 19px;
                }
              }
            }
            .start--title{
              justify-content: center;
              font-size: 14px;
              line-height: 19px;
              text-align:center;
            }
            .page-info-row {
              justify-content: center;
            }
            .page-info-description,
            .know-more a {
              font-size: 14px;
              line-height: 19px;
              text-align: center;
            }
          }
        }

        @media screen and (min-width: 1224px) {
         
          .page-info-paragraph-section {
            .main-header {
              font-size: 36px;
              line-height: 44px;
            }
            &.how-to-play-info {
              .page-info-description {
                font-size: 20px;
                line-height: 28px;
              }
              &.description-format {
                .page-info-description {
                  font-size: 20px;
                  line-height: 28px;
                }
              }
            }
            .reduceMargin{
              margin-top:-120px;
            }
            .start--title{
              font-size: 20px;
              line-height: 28px;
            }
            .page-info-description,
            .know-more a {
              font-size: 20px;
              line-height: 28px;
            }
          }
        }

        .page-info-paragraph-section 
        .page-info-description{
          text-align:left;
        }
      `}
    </style>
  </section>
);
