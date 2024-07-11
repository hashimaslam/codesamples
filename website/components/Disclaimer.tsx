import * as txt from "../configs/footer_data";
import {getHTML} from "../configs/util";
const DisclaimerFooter = (props) => (
  <div className="footer-disclaimer">
    <div className="container">
      <div className="footer-disclaimer-layout section-layout">
        <div className="row">
          <div className="footer-disclaimer__detail">
            <h3 className="disclaimer-header">{props.header}</h3>
            {props.disclaimerText.map((txt, index) => (
              <p className="disclaimer-paragraph" key={index}>
                {getHTML(txt)}
              </p>
            ))}
            {
            props.readMore &&
            <p className="disclaimer-header">
            <a href={props.readMore.link}>{props.readMore.text}</a>
            </p>
            }
          </div>
        </div>
      </div>
    </div>
    <style jsx global>
      {`
        .footer-disclaimer a {
          all: inherit;
          display: inline;
          cursor: pointer;
          font-weight:500;
        }
      `}
    </style>
    <style jsx>{`
      .footer-disclaimer {
        background-color: #4a4a4a;
      }

      .footer-disclaimer a {
        all: inherit;
        display: inline;
        cursor: pointer;
        font-weight:500;
      }
      
      .footer-disclaimer-layout {
        &.section-layout {
          padding-bottom: 140px;
        }
        .footer-disclaimer__detail {
          text-align: left;
        }
        .disclaimer-header {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          text-align: center;
        }
        .disclaimer-paragraph {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
          font-weight: normal;
        }
      }


      @media screen and (min-width: 768px) {
        .footer-disclaimer-layout {
          &.section-layout {
            padding-bottom: 24px;
          }
          .disclaimer-header {
            font-size: 16px;
          }
          .disclaimer-paragraph {
            font-size: 14px;
          }
        }
      }
    `}</style>
  </div>
);
export default DisclaimerFooter;
