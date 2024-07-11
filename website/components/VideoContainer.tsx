export const VideoContainer = (props) => {
  return (
    <>
      <section
        className={`video-container ${
          props.cssClassList ? props.cssClassList.join(" ") : ""
        }`}
      >
        <div className="container">
          <div className="section-layout page-info-layout">
            <div className="row">
              <h2 className="section-header section-header--medium">
                {props.header}
              </h2>
            </div>
            <div className="row">
              <iframe
                frameBorder="0"
                allowFullScreen="1"
                src={props.videoURL}
                className="video-iframe"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <style jsx>
        {`
          .video-container {
            .section-layout {
              padding-bottom: 0;
            }
            h2 {
              color: #ffffff;
              font-weight: bold;
              font-size: 16px;
              line-height: 24px;
              margin: 8px 0 16px 0;
            }
          }
          .highlight-background {
            background: #190a28;
          }
          .video-iframe {
            width: 100%;
            height: 178px;
          }
          @media screen and (min-width: 1224px) {
            .video-iframe {
              width: 852px;
              height: 479.25px;
            }
            .video-container {
            h2 {
              font-size: 36px;
              line-height: 48px;
              font-weight: bold;
              margin-bottom:56px;
            }
          }
          }
        `}
      </style>
    </>
  );
};
