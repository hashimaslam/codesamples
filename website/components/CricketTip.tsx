export const CricketTip = (props) => (
  <section className={`cricket-tip-section  ${
    props.cssClassList ? props.cssClassList.join(" ") : ""
  }`}>
    <div className="container">
      <div className="section-layout">
        <div className="row">
          {props && props.header ? (
            <h2 className="section-header section-header--medium">
              {props.header}
            </h2>
          ) : (
            ""
          )}

          {props.contentList
            ? props.contentList.map((para, key) => (
                <p className="section-header--small" key={key}>
                  {para.text}
                  {para.linkName ? (
                    <span className="know-more">
                      <a href={para.href}>{para.linkName} </a>
                    </span>
                  ) : (
                    ""
                  )}
                  .
                </p>
              ))
            : ""}
        </div>
      </div>
    </div>

    <style jsx>
      {`
       .cricket-tip-section .row{
          flex-direction:column;
       }
        .cricket-tip-colored {
          background-color: #f0f0f0;
        }
     .know-more a {
          color: red;
          font-size:12px;
          font-weight:normal;
        }

        @media screen and (min-width: 768px) {
          .cricket-tip-colored {
            background-color: #fff;
          }

          .know-more a {
           font-size: 20px;
           line-height: 28px;
           }
        }
      `}
    </style>
  </section>
);
