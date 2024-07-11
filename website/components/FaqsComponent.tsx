import { getHTML, getHTMLParagraph } from "../configs/util";
// export const FaqsComponent = ({ faqs, headingStyle, backgroundStyle }) => (
export const FaqsComponent = (props) => (
  <section
    className={`faqs-background ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    }`}
  >
    <div className="container">
      <div className="section-layout">
        <div className="row">
          <h2 className="section-header section-header--medium">
            {props.header}
          </h2>
          {props.paragraph && (
            <p className="paragraph">{getHTMLParagraph(props.paragraph)}</p>
          )}
          {props.contentList &&
            props.contentList.map((faq, key) => (
              <div
                key={key}
                className={`para-wrapper ${
                  props.cssContentClassList ? props.cssClassList.join(" ") : ""
                }`}
              >
                <h3>{faq.paraTitle}</h3>
                <p>
                  {props.ishtmlContent
                    ? getHTMLParagraph(faq.text)
                    : getHTML(faq.text)}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
    <style jsx global>
      {`
        .faqs-background a {
          all: inherit;
          display: inline;
          cursor: pointer;
          color: #ff0000;
          font-weight: normal;
          text-decoration: underline;
        }

        p.html-content ul {
          list-style: unset;
          padding-left: 17px;
          li {
            text-transform: unset;
            font-size: 13px;
          }
        }

        .paragraph {
          font-size: 12px;
          line-height: 16px;
          text-align: left;
        }

        @media screen and (min-width: 1244px) {
          p.html-content ul {
            li {
              text-transform: unset;
              font-size: 18px;
            }
          }

          .paragraph {
            font-size: 20px;
            line-height: 28px;
          }
        }
      `}
    </style>

    <style jsx>
      {`
        .faqs-background {
          background: #ffffff;
          &.how-to-play-fantasy-cricket {
            background: #f0f0f0;

            h2 {
              margin: 0 0 -28px 0;
            }
          }
          .section-layout {
            padding: 32px 24px;
          }
          .faqs-background a {
            all: inherit;
            display: inline;
            cursor: pointer;
            color: #ff0000;
            font-weight: 500;
          }
          .para-wrapper {
            width: 100%;
            &.how-to-play-fantasy-cricket-block h3 {
              font-weight: 500;
              font-size: 12px;
              line-height: 16px;
              color: #4a4a4a;
            }
            > h3 {
              font-weight: 500;
              font-size: 12px;
              line-height: 16px;
              color: #4a4a4a;
              align-self: center;
              text-align: left;
              padding: 0;
              margin: 40px 0 4px 0;
            }
            > p {
              font-weight: normal;
              font-size: 12px;
              line-height: 16px;
              color: #828282;
              align-self: center;
              text-align: left;
              white-space: pre-line;
              margin: 0;
              padding: 0;
            }
          }

          h2 {
            margin: 0 0 -12px 0;
          }
        }

        .rules-of-rummy.faqs-background {
          .para-wrapper :last-child p {
            background-color: #e8faeb;
          }
        }

        @media screen and (min-width: 768px) {
          .faqs-background {
            &.how-to-play-fantasy-cricket {
              background: #fff;
            }
            .para-wrapper {
              > h3,
              > p {
                text-align: left;
              }
            }
          }
        }

        @media screen and (min-width: 1244px) {
          .faqs-background {
            &.how-to-play-fantasy-cricket {
              h2 {
                margin: 0;
              }
            }
            .section-layout {
              padding: 88px 24px;
            }
            .para-wrapper {
              &.how-to-play-fantasy-cricket-block h3 {
                font-weight: 500;
                font-size: 20px;
                line-height: 28px;
              }

              > h3 {
                font-size: 20px;
                line-height: 28px;
                color: #828282;
                margin: 56px 0 8px 0;
                font-weight: bold;
                text-align: center;
              }

              > p {
                font-weight: normal;
                font-size: 20px;
                line-height: 28px;
                color: #828282;
                // margin:0 0 8px 0;
                text-align: center;
                white-space: pre-wrap;
              }
            }
          }
          .faqs-background .para-wrapper > p {
            text-align: left;
          }
        }
      `}
    </style>
  </section>
);
