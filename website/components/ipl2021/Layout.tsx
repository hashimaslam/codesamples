import { CustomImage } from "./CustomImage";
import { Text } from "./Text";

export const Layout = (props) => {
  return (
    <>
      <props.type
        className={`${props.cssClasses ? props.cssClasses : ""} `}
      >
        <CustomImage {...props.customImageComponent} />
        <div
          className={`${
            props.textArraycssClasses
              ? props.textArraycssClasses
              : ""
          } `}
        >
          {props.TextComponent &&
            props.TextComponent.map((text, i) => {
              return <Text {...text} key={i} />;
            })}
        </div>
      </props.type>
    </>
  );
};
