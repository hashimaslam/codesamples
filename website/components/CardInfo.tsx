import { getHTML } from "../configs/util";
export const CardInfo = (props) => {
  return (
    <div
      className={`card-info  ${
        props.cssClassList ? props.cssClassList.join(" ") : ""
      } ${props.device} ${props.page}`}
    >
      <div className="container">
        <div className="section-layout page-info-layout">
          <div className="row">
            <picture>
              <source srcSet={props.bannerImageUrl.webp} type="image/webp" />
              <source srcSet={props.bannerImageUrl.png} type="image/png" />
              <img
                src={props.bannerImageUrl.png}
                alt={"vpl Fantasy Sticker"}
                className="image-ratings"
              />
            </picture>

            <p className="content">{getHTML(props.content)}</p>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .icon-image-url {
            height: auto;
            margin-top: 10px;
          }

          .rules-of-rummy {
            .content {
              white-space: pre-line;
              text-align: left;
              font-size: 12px;
            }
          }
          @media screen and (min-width: 768px) {
            .rules-of-rummy {
              .content {
                font-size: 14px;
              }
            }
          }
          @media screen and (min-width: 1224px) {
            .icon-image-url {
              width: 65%;
              margin: 16px 0 16px 0;
            }
            p {
              font-size: 20px;
              line-height: 28px;
            }
            .rules-of-rummy {
              .content {
                white-space: pre-line;
                text-align: left;
                width: 790px;
                font-size: 20px;
              }
            }
          }
        `}
      </style>
    </div>
  );
};
