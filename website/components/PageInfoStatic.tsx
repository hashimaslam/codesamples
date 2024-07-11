export const PageInfo = (props) => {
    return (
      <section className="page-info-section">
        <div className="container">
          <div className="section-layout page-info-layout">
            <div className="row">
              {props.header ? (
                props.headingStyle ? (
                  <h1 className="section-header section-header--medium main-header main-header-static">
                    {props.header}
                  </h1>
                ) : (
                  <h2 className="section-header section-header--medium main-header-static">
                    {props.header}
                  </h2>
                )
              ) : (
                ""
              )}
              {props.subHeader ? (
                <h2 className="section-header section-header--medium main-header-static">
                  {props.subHeader}
                </h2>
              ) : (
                ""
              )}
  
              {props.paragraphes &&
                props.paragraphes.map((para, i) => {
                  return (
                    <p key={i} className="page-info-description">
                      {para}
                    </p>
                  );
                })}
            </div>
          </div>
        </div>
        <style jsx>
          {`
            
            .page-info-section {
              background: #ffffff;
              .main-header-static {
                  width:100%;
              }
              .page-info-description {
                font-size: 12px;
                line-height: 16px;
              }
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
  