import React, { Component } from "react";
import Head from "next/head";

export default class extends Component {
  constructor(props) {
    super(props);

}
  
  // componentDidMount() {
  //   (function(d, s, id) {
  //     var js,
  //       fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) return;
  //     js = d.createElement(s);
  //     js.id = id;
  //     js.src = "https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v3.1";
  //     fjs.parentNode.insertBefore(js, fjs);
  //   })(document, "script", "facebook-jssdk");
  // }
  render() {
    return (
      <div>
         <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div id="fb-root" />
        <div
          className="fb-video"
          data-href="https://www.facebook.com/maihupapakipari/videos/140573050236141/"
          data-width="500"
          data-show-text="false"
        />
        
      </div>
    );
  }
}
