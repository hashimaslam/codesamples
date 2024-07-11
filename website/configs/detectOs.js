export default osType;

function osType() {
  var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return (
        navigator.userAgent.match(/iPhone|iPad|iPod/i)
      );
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  if (isMobile.Android()) {
    return "android";
    // this.setState({
    //   landingSrc: imgRef.LANDING_ANDROID,
    //   showSteps: true
    // });
  } else if (isMobile.iOS()) {
    return "ios";
    // this.setState({
    //   landingSrc: imgRef.LANDING_IOS
    // });
  } else if (isMobile.Windows()) {
    return "windows";
  } else {
    return "desktop";
    // this.setState({
    //   landingSrc: imgRef.LANDING_DESKTOP
    // });
  }
}
