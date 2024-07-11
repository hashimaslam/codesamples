import { getHTML } from "../configs/util";
export const PageInfo = (props) => {
  return (
    <section className={`page-info-section ${props.page} ${props.device} `}>
      <div className="container">
        <div className="section-layout page-info-layout">
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
            {props.subHeader ? (
              <h2 className="section-header section-header--medium">
                {props.subHeader}
              </h2>
            ) : (
              ""
            )}

            {props.contentList &&
              props.contentList.map((para, i) => {
                return (
                  <p key={i} className="page-info-description">
                    {getHTML(para)}
                  </p>
                );
              })}
          </div>
        </div>
      </div>
      <style jsx global>
        {`
          .page-info-section a {
            all: inherit;
            display: inline;
            cursor: pointer;
            color: #ff0000;
            font-weight: 500;
          }
        `}
      </style>
      <style jsx>
        {`
          .page-info-section {
            background: #ffffff;
            &.vpl-stories.desktop {
              display: none;
            }
            .page-info-description {
              font-size: 12px;
              line-height: 16px;
            }
          }
          .page-info-section a {
            all: inherit;
            display: inline;
            cursor: pointer;
            color: #ff0000;
            font-weight: 500;
          }
          @media screen and (min-width: 768px) {
            .page-info-section {
              .page-info-layout {
                margin-bottom: -20px;
              }
              .page-info-description {
                font-size: 14px;
                line-height: 19px;
              }
            }
          }

          @media screen and (min-width: 1224px) {
            .page-info-section {
              .page-info-description {
                font-size: 20px;
                line-height: 28px;
              }
            }
          }
        `}
      </style>
    </section>
  );
};
