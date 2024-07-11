import React from "react";
import Carousel from "react-multi-carousel";
import "../styles/bannerCarousel.scss";
import "react-multi-carousel/lib/styles.css";

class BannerCarousel extends React.Component {
  constructor(props) {
    super(props);
  }
  responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  render() {
    const { render, items, autoPlay, Component, compProps, showCarousel } =
      this.props;

    return (
      <div
        className="custom_react_carousel"
        style={{
          display: showCarousel !== true ? "none" : "block",
        }}
      >
        <Carousel
          showDots={true}
          responsive={this.responsive}
          ssr={true}
          containerClass="carousel-container"
          partialVisible={false}
          infinite={true}
          renderDotsOutside={true}
          slidesToSlide={1}
          dotListClass="custom_dot_list"
          autoPlay={autoPlay}
          autoPlaySpeed={3000}
          arrows={this.props.autoPlay ? false : true}
        >
          {render}
        </Carousel>
        {this.props.renderPromotionStrip && this.props.renderPromotionStrip}
        {this.props.renderRewardsSliding && this.props.renderRewardsSliding}
        {/* <Dots slides={items} activeSlide={1} /> */}
        {/* <style jsx>
        </style> */}
      </div>
    );
  }
}

export default BannerCarousel;
