export const WinnerSlider = (props) => {
    return (
      <>
      <div className="outer__block">
      <div className="winner--cards--container scrollable-section">
        {props.imageList && (<>
            {props.imageList.map((card,key)=> (<a key={key} className="winner--card">
                        <img
                             src={card.imageurl.png}
                             alt={card.imageurl.alt}
                             className="winner__image"
                        />
                        <h3 className="winner__name">{card.cardContent.name}</h3>
                        <h3 className="winner__tour">{card.cardContent.tournament_name}</h3>
                        <h3 className="winner__won">{card.cardContent.won}</h3>
                       
            </a>))}
        </>)}
        </div>
      </div>
        <style jsx>
          {`
            h3{
                margin:0;
            }
            .outer__block{
                margin:0 8px;
                background:#fff;
                margin-bottom: -1px ;
            }
            .winner--cards--container {
                display: flex;
                flex-wrap: wrap;
                padding: 24px 0px;
                margin: 0 8px;
                justify-content: center;
                &.scrollable-section{
                    flex-wrap:nowrap;
                    overflow-x:scroll;
                    justify-content: unset;
                    scroll-behavior: smooth;
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  
                    padding-top:16px;
                    padding-bottom:0;
                }
                &.scrollable-section::-webkit-scrollbar{
                    display: none;
                }
            }
            .winner__image{
                width: 155px;
                height: 155px;
                margin:auto;
                padding: 0 46.5px ;
            }
            .winner--card{
                background: #FDE7EE;
                border-radius: 8px;
                margin:8px;
                padding:24px 0;
                min-width: 248px;
            }
            .winner__name{
                font-weight: 500;
                font-size: 16px;
                line-height: 24px;
                text-align: center;
                color: #222222;
                margin-top:8px;

            }
            .winner__tour{
                font-weight: normal;
                font-size: 14px;
                line-height: 20px;
                text-align: center;
                color: rgba(25, 10, 40, 0.6);
            }
            .winner__won{
                font-weight: 900;
                font-size: 28px;
                line-height: 33px;
                text-align: center;
                text-transform: uppercase;
                color:FF007A;
                margin-top:8px;
                background: linear-gradient(#ff007a,#ff3d00);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;

            }
            @media screen and (min-width: 800px) {
               .winner--cards--container {
                    &.scrollable-section{
                        justify-content: center;
                    }
                }
            }

            
          `}
        </style>
      </>
    );
  };
  