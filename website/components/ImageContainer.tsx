export const ImageContainer = (props) => {
  let imageUrl = "";
  if (props.deviceSpecificImage)
    imageUrl =
      props.device !== "desktop" ? props.mobileImageurl : props.desktopImageurl;
  else imageUrl = props.device !== "desktop" ? props.imageurl : props.imageurl;

  return (
    <>
      <section className={`image-container ${props.page} ${props.device} `}>
        <div className="container">
          <div className="section-layout page-info-layout">
            <div className="row">
              {props.navigateTo ? (
                <a href={props.navigateTo} target="_blank">
                  <picture>
                    <source srcSet={imageUrl.webp} type="image/webp" />
                    <source srcSet={imageUrl.png} type="image/png" />
                    <img
                      src={imageUrl.png}
                      alt={"vpl Fantasy Sticker"}
                      className="image-ratings"
                    />
                  </picture>
                </a>
              ) : (
                <picture>
                  <source srcSet={imageUrl.webp} type="image/webp" />
                  <source srcSet={imageUrl.png} type="image/png" />
                  <img
                    src={imageUrl.png}
                    alt={"vpl Fantasy Sticker"}
                    className="image-ratings"
                  />
                </picture>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>
        {`
          .image-container {
            .section-layout {
              padding-bottom: 0;
            }
          }

          .image-container.esports-cpl {
            .section-layout {
              padding-top: 0;
              padding-bottom: 48px;
            }
          }
        `}
      </style>
    </>
  );
};
