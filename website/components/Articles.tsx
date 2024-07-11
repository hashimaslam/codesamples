import React from "react";

function Articles(props) {
  return (
    <section className="articles">
      <div className="header">Related Articles</div>

      {props?.content?.map((item) => {
        return (
          <a href={item.href}>
            <div className="articles_item">
              <div className="articles_item-img">
                {props.osType === "desktop" ? (
                  <img src={item.desktopImg} />
                ) : (
                  <img src={item.mobileImg} />
                )}
              </div>
              <div className="articles_item-data">
                <div className="title">{item.title}</div>
                <div className="description">{item.description}</div>
              </div>
            </div>
          </a>
        );
      })}

      <style jsx>
        {`
          .articles {
            margin: 64px 0px;
            .header {
              margin-bottom: 30px;
              font-weight: normal;
              font-size: 24px;
              line-height: 32px;
              color: rgba(25, 10, 40, 0.6);
            }
            &_item {
              display: flex;
              margin-bottom: 30px;
              &-img {
                img {
                  width: 240px;
                  height: 180px;
                  border-radius: 10px;
                }
              }
              &-data {
                margin-left: 20px;
                width: 65%;
                .title {
                  font-size: 32px;
                  line-height: 40px;
                  color: #230046;
                  font-weight: 600;
                  margin-bottom: 10px;
                }
                .description {
                  font-weight: normal;
                  font-size: 20px;
                  line-height: 24px;
                  color: rgba(25, 10, 40, 0.6);
                }
              }
            }
          }
          @media screen and (max-width: 1224px) {
            .articles {
              margin-right: 16px;
              margin-left: 16px;
              .header {
                font-size: 24px;
                line-height: 32px;
                color: #230046;
                text-align: center;
                font-weight: 600;
              }
              &_item {
                display: flex;
                margin-bottom: 30px;
                &-img {
                  img {
                    width: 140px;
                    height: 120px;
                    border-radius: 10px;
                  }
                }
                &-data {
                  margin-left: 20px;
                  width: 65%;
                  .title {
                    font-size: 16px;
                    line-height: 22px;
                  }
                  .description {
                    font-size: 12px;
                    line-height: 18px;
                  }
                }
              }
            }
          }
        `}
      </style>
    </section>
  );
}

export default Articles;
