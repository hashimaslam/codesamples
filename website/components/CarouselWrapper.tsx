import React from "react";

import BannerCarousel from "./BannerCarousel";
export function CarouselWrapper(props) {
  const {
    render,
    compProps,
    renderPromotionStrip,
    renderRewardsSliding,
    items,
    autoPlay,
    Component,
    showCarousel,
  } = props;
  return (
    <BannerCarousel
      render={render}
      showCarousel={showCarousel}
      compProps={compProps}
      Component={Component}
      renderPromotionStrip={renderPromotionStrip}
      renderRewardsSliding={renderRewardsSliding}
      items={items}
      autoPlay={autoPlay}
    />
  );
}
