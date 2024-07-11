import {getHTML} from "../configs/util";
export const MiddleHeading = (props) => (
  <section
    className={`middle-heading-section ${
      props.backGroundColorGrey ? "section-background__grey" : ""
    }`}
  >
    <div className="container">
      <div className="section-layout">
        <div className="row">
          <div className="middle-heading__title">
            <h2 className="section-header section-header--large">
              {props.header}
            </h2>
          </div>
        </div>
      </div>
    </div>
    <style jsx global>
      {`
        .middle-heading-section a {
          all: inherit;
          display: inline;
          color: #ff0000;
          font-weight:500;
        }
      `}
    </style>
    <style jsx>{`
      .middle-heading-section {
        .section-header {
          margin-bottom: 0;
        }
      }

      .middle-heading-section a {
        all: inherit;
        display: inline;
        color: #ff0000;
        font-weight:500;
      }
      .heading-colored {
        background-color: #f0f0f0;
      }

      @media screen and (min-width: 768px) {
        .heading-colored {
          background-color: #fff;
        }
      }

      @media screen and (min-width: 1224px) {
        .middle-heading-section {
          .section-layout {
            padding-bottom: 0;
          }
        }
      }
    `}</style>
  </section>
);
