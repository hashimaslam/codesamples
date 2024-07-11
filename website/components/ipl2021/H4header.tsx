export const H4header = (props)=>(
    <>
   {props.header.trim() &&
    <section className={props.backgroundCss}>
        <div className="container"> 
            <h4 className={`${props.cssClassList ? props.cssClassList.join(" ") : "" } `} style={props.styles}>{props.header}</h4>
        </div>
        <style jsx>{`
                .add--overflow{
                    overflow: auto;
                } 
                .disclaimer{
                    background: rgba(25, 10, 40, 0.05);
                }

                @media screen and (min-width: 1224px) {
                    
                    .disclaimer{
                        margin-top:160px;
                    }
                }
        `}</style>
    </section>
            }
     </>
            
)