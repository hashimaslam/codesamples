const InfoWithImage = (props) => {
  
  return (
    <section className="info-image-section">
      <div className="container">
        <div className="section-layout">
          {props.header ? (
            <>
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
              <div className="row">
                {props.infoImageList.map((info,key) => {
                  return (
                    <div className="info-container" key={key}>
                      <img src={info.imageurl.png} />
                      <p>{info.description}</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <style jsx global>
          {`
            .info-image-section {
              background-color: #fff9e1;
              .section-layout {
                margin: 0;
              }
              .section-header--medium {
                font-size: 16px;
                line-height: 20px;
              }
            }
            .info-container {
              width: 100%;
              display: flex;
              justify-content: center;
              img {
                width: 72px;
                height: 72px;
                margin: 0 24px 24px 0;
              }
              p {
                font-weight: normal;
                line-height: 32px;
                color: #190a28;
                text-align: left;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                line-height: 18px;
              }
            }
            @media screen and (min-width: 1224px) {
              .info-image-section {
                background-color: #fff9e1;
                .section-layout {
                  margin: 0 47px;
                }
                .section-header--medium {
                  font-size: 36px;
                  line-height: 44px;
                }
              }
              .info-container {
                width: 50%;

                img {
                  width: 156px;
                  height: 156px;
                  margin: 0 24px 0 0;
                }
                p {
                  font-style: normal;
                  font-weight: normal;
                  font-size: 24px;
                  line-height: 32px;
                  color: #190a28;
                  text-align: left;
                }
              }
            }
          `}
        </style>
      </div>
    </section>
  );
};

export default InfoWithImage;
