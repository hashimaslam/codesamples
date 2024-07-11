export const ImageComponent = (props) => (
    <section className="section-layout">
      <div className="container">
            { !props.noHeading ? (props.H1Header && props.header ? (
                    <h1 className="section-header section-header--large">
                     {props.header}
                   </h1>
                 ) : (
                  <h2 className="section-header section-header--medium">
                      {props.header}
                    </h2>
            )):''} 
            <picture>
                <source srcSet={props.imageUrl.webp} type="image/webp" />
                <source srcSet={props.imageUrl.png} type="image/png" />

                <img
                    src={props.imageUrl.png}
                    alt={props.imageUrl.alt}
                    style={{width:props.width,height:props.height}}
                />
            </picture>
      </div>
      <style jsx>
        {`

          @media screen and (min-width: 768px) {
           
         }
          @media screen and (min-width: 1224px) {
          
          }
        `}
      </style>
    </section>
  );