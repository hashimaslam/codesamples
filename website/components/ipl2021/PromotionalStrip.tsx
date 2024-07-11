export const PromotionalStrip = (props) => (
  <div>
    <section className="container">
      <div className={`${props.cssClasses}`}>
        <img
          className="background--img"
          src={
            props.device === "desktop"
              ? props.backgroundDesktopImgUrl?.png
              : props.backgroundImgUrl?.png
          }
          alt={props.backgroundImgUrl?.alt}
        />
        <div className="text--section">
          <div className="left--section">
            <div>
              <p className="main--text">{props.leftContent?.mainText}</p>
              <p className="sub--text">{props.leftContent?.subText}</p>
            </div>
          </div>
          <div className="right--section">
            <div>
              <p className="main--text">{props.rightContent?.mainText}</p>
              <p className="sub--text">{props.rightContent?.subText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <style jsx>
      {`
        p {
          margin: 0;
        }
        .container {
          margin: 0;
          position: relative;
          height: 90px;
          max-width: 100%;
        }
        .text--section {
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 90px;
        }

        .background--img {
          position: absolute;
          left: 0;
          right: 0;
          z-index: -1;
          width: 100%;
          height: 100%;
        }

        .main--text {
          font-weight: bold;
          font-size: 28px;
          line-height: 34px;
          text-transform: capitalize;
          color: #ffffff;
        }
        .sub--text {
          font-size: 16px;
          line-height: 22px;
          color: #ffffff;
        }

        @media screen and (max-width: 359px) {
          .text--section {
            padding: 12px;
          }
        }

        @media screen and (min-width: 768px) {
          .text--section {
            height: 122px;
          }
          .container {
            height: 122px;
          }

          .main--text {
            font-size: 36px;
            line-height: 34px;
          }
          .sub--text {
            font-size: 32px;
            line-height: 40px;
          }
          .left--section {
            width: 50%;
            padding-right: 114px;
            display: flex;
            justify-content: flex-end;
          }
          .right--section {
            padding-left: 114px;
            width: 50%;
            display: flex;
            justify-content: flex-start;
          }
        }
      `}
    </style>
  </div>
);
