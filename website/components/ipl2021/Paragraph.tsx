import "../../styles/trim_global.scss";

export const Paragraph = (props) => (
  <>
    {props.text.trim() && (
      <p
        className={`${props.cssClassList ? props.cssClassList : ""} `}
        style={props.styles}
      >
        {props.text}
      </p>
    )}
    <style jsx>
      {`
        .description {
          font-size: 12px;
          line-height: 18px;
          text-align: center;
        }
        @media screen and (min-width: 1224px) {
          .description {
            font-size: 20px;
            line-height: 24px;
          }
        }
      `}
    </style>
  </>
);
