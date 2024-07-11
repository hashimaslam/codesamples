import { getHTML } from "../configs/util";
export const StepsBoxImg = (props) => (
  <section
    className={`steps-box-section  ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    } ${props.device} ${props.page}`}
  >
    <div className="container">
      <div
        className={
          props.reduceMarginClass
            ? "section-layout reduce-margin"
            : "section-layout"
        }
      >
        <div
          className={
            props.alignContentToLeft
              ? "row steps-box-align-left"
              : "row steps-box-row"
          }
        >
          {!props.noHeading ? (
            props.stepList && props.H1Header && props.header ? (
              <h1 className="section-header section-header--large">
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
          <div className="steps-list">
            {props.stepList
              ? props.stepList.map((step, key) => (
                  <div className="img-text-bar" key={key}>
                    <div className="img-container">
                      <img src={step.imageurl.png} alt={step.title} />
                    </div>
                    <div className="steps-box-tile">
                      <p className="section-header--small steps-box-tile-title">
                        {step.title}
                      </p>
                      <p className="section-header--small steps-box-tile-info">
                        {getHTML(step.description)}
                      </p>
                    </div>
                  </div>
                ))
              : ""}
            {props.endInfo
              ? props.endInfo.map((info, key) => (
                  <div className="row list-row-aligned" key={key}>
                    <p className="list-description">{info}</p>
                  </div>
                ))
              : ""}
          </div>
        </div>
      </div>
    </div>
    <style jsx global>
      {`
        .steps-box-section.redeem-vi-coupon a {
          all: inherit;
          display: inline;
          cursor: pointer;
          color: #ffffff;
          -webkit-text-fill-color: #ffffff;
          font-weight: 500;
        }
      `}
    </style>
    <style jsx>
      {`
        .list-row-aligned {
          justify-content: flex-start;
        }
        .list-description {
          font-size: 12px;
          line-height: 16px;
          text-align: left;
          margin: 0 0 20px 0;
        }
        .reduce-margin {
          margin-top: -48px;
        }
        .steps-box-align-left {
          flex-direction: column;
          align-items: flex-start;
        }
        h1,
        h2 {
          margin-bottom: 28px;
        }
        .steps-box-section {
          background: #ffffff;
        }
        .steps-box-row {
          flex-direction: column;
          align-items: center;
        }

        .img-text-bar {
          display: flex;
          justify-content: center;
           width: 83%;
          margin:auto;
          margin-bottom: 24px;
        }
        .img-container {
          width: 72px;
          height: 72px;
        }
        img {
          border-radius: 2px;
        }
        .steps-box-tile {
          padding-left: 16px;
          text-align: left;
          width: 63%;
        }
        .steps-box-tile-title,
        .steps-box-tile-info {
          font-weight: bold;
          color: #4a4a4a;
          margin: 0px 8px 8px 8px;
          text-transform: uppercase;
        }
        .steps-box-tile-info {
          font-weight: normal;
          text-transform: none;
        }
        @media screen and (min-width: 768px) {
          .list-description {
            font-size: 14px;
            line-height: 19px;
          }
          .list-description {
            tex-align: center;
          }
          .steps-box-align-left {
            flex-direction: column;
            align-items: center;
          }
          .reduce-margin {
            margin-top: -72px;
          }
          .img-text-bar {
            width: 56%;
          }
          .steps-box-tile-title,
          .steps-box-tile-info {
            font-size: 14px;
            color: #828282;
          }
          .steps-box-tile {
            width: 63%;
            padding-left: 24px;
          }
          .img-container {
            width: 80px;
            height: 80px;
          }
        }
        @media screen and (min-width: 1224px) {
          h1 {
            margin-bottom: 56px;
          }
          .list-description {
            font-size: 20px;
            line-height: 28px;
            margin: 0 0 56px 0;
          }
          .reduce-margin {
            margin-top: -160px;
          }

          .img-text-bar {
            width: 56%;
          }
          .steps-box-tile-title,
          .steps-box-tile-info {
            font-size: 20px;
          }

          .img-container {
            width: 156px;
            height: 156px;
          }
        }

        // vodaphone page

        .steps-box-section.redeem-vi-coupon {
          background: #190a28;
          
          .steps-box-tile-info {
            color: #ffffff;
            font-size: 14px;
            line-height: 18px;
          }
          .img-text-bar {
            width: 100%;
            margin: unset;
            margin-bottom: 24px;
          }

          @media screen and (min-width: 1224px) {
            .steps-list {
              width: 1178px;
              flex-wrap: wrap;
              display: flex;
              .img-text-bar {
                width: 50%;
              }
            }

            .section-header {
              font-weight: bold;
              font-size: 36px;
              line-height: 48px;
              text-align: center;
              color: #190a28;
              margin-bottom: 56px;
            }
            .img-container {
              width: 133px;
              height: 133px;
              display: flex;
              justify-content: center;
              align-items: center;
              img{
                width: 133px;
                height: auto;
              }
            }
            .steps-box-tile{
              display: flex;
              justify-content: flex-start;
              align-items: center;
            }
            .steps-box-tile-info {
              font-size: 24px;
              line-height: 32px;
            }
          }
        }

        .steps-box-section.download-steps.redeem-vi-coupon {
          background: #fff;
          .section-layout {
            padding-bottom: 0;
          }
          .section-header {
            font-size: 16px;
            line-height: 20px;
            text-align: center;
            color: #222222;
          }
          .steps-box-tile-info {
            color: #190a28;
          }
          @media screen and (min-width: 1224px) {
            .section-header {
              font-weight: bold;
              font-size: 36px;
              line-height: 48px;
              text-align: center;
              color: #190a28;
              margin-bottom: 56px;
            }
            // .img-container {
            //   width: 133px;
            //   height: 133px;
            //   display: flex;
            //   justify-content: center;
            //   align-items: center;
            //   img{
            //     width: 133px;
            //     height: auto;
            //   }
            // }
            // .steps-box-tile{
            //   display: flex;
            //   justify-content: flex-start;
            //   align-items: center;
            // }
            // .steps-box-tile-info {
            //   font-size: 24px;
            //   line-height: 32px;
            // }
          }
        }
      `}
    </style>
  </section>
);
