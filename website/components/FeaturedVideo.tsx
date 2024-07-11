import * as imgRef from "../configs/images";
import SendSMSStatic from "./SendSMSStatic";
import moment from "moment";
const FeaturedVideo = (props) => (
  <div className="video-feature" id="landing">
    <div className="head">
      <div>
        <img src={imgRef.vpl_CREST} alt="vpl Logo" />
      </div>
      <div className="mobile">
        <h2>{props.lang.HEADING11}</h2>
        <h2>{props.lang.HEADING12}</h2>
      </div>
    </div>
    <div className="desktop ">
      <div className=" video-section">
        <div>
          <h2>{props.lang.HEADING11}</h2>
          <h2>{props.lang.HEADING12}</h2>
        </div>
        <SendSMSStatic />
      </div>
    </div>

    <div className="landing-section">
      <div className="featured video-sec">
        <div class="heading">
          <div>
            <div>
              <img
                className="avatar"
                src={
                  props.videoDetails.avatarUrl
                    ? props.videoDetails.avatarUrl
                    : imgRef.DEFAULT_AVATAR
                }
                alt="User Image"
              />
            </div>
            <div className="user-details">
              <div>{props.videoDetails.title}</div>
              <div>{props.videoDetails.profileName}</div>
            </div>
          </div>
        </div>
        {props.videoDetails.videoType !== "CDN" ? (
          <div className="resp-container">
            <iframe
              className="resp-iframe"
              // src={
              //   props.videoDetails.videoType === "YOUTUBE"
              //     ? `https://www.youtube.com/embed/${
              //         props.videoDetails.videoId
              //       }`
              //     : `https://www.facebook.com/plugins/video.php?href=${
              //         props.videoDetails.iframeSource
              //       }`
              // }
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video width="100%" controls>
            <source src={props.videoDetails.sourceUrl} />
          </video>
        )}

        {/* <img src={imgRef.IMG_LANDING} alt="vpl App Screen" /> */}
        <div className="video-details">
          <div>{props.videoDetails.description}</div>
          <div>
            {moment(props.videoDetails.uploadedOn).format("DD MMM' YY")}
          </div>
        </div>
        <div className="video-stat">
          {/* <div>
            <span>VIEWS</span>
            <span>{props.videoDetails.views}</span>
          </div> */}
          <div>
            <span>LIKES</span>
            <span>{props.videoDetails.likes}</span>
          </div>
          <div>
            <span>
              <img src={imgRef.WHATSAPP_SVG} alt="Whats App" />
            </span>
            <span>{props.videoDetails.whatsAppShare}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default FeaturedVideo;
