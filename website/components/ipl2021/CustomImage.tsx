export const CustomImage = (props) => (
  <div
    style={{
      display: props.cssClasses.indexOf("ratings") > -1 ? "flex" : "none",
    }}
    className={props.cssClasses}
  >
    <picture>
      <source srcSet={props.imageUrl.webp} type="image/webp" />
      <source srcSet={props.imageUrl.png} type="image/png" />
      <img src={props.imageUrl.png} alt="vpl US banner" style={props.styles} />
    </picture>

    <style jsx>
      {`
        .center-absolute {
          position: absolute;
          bottom: 0;
          bottom: -33px;
          left: 50%;
          transform: translate(-50%, 0);
        }
        .game-title {
          width: 114px;
          height: 64px;
        }
        .ratings {
          padding: 50px 0 0 0;
          display: flex;
          justify-content: center;
          img {
            max-width: 100%;
          }
        }
      `}
    </style>
    <style jsx global>
      {``}
    </style>
  </div>
);
