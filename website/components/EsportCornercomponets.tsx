export const TopCorner = () =>(
    <div className="top__corner">

        <style jsx>{`

            .top__corner{
                background:#fff;
                margin: 0px 8px;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                margin-bottom: -1px;
                height: 4px;
            }
            @media screen and (min-width: 768px) {
                .top__corner{
                    margin: 16px 16px;
                    margin-bottom: -1px;
                    padding-bottom:24px;
                    height: 0px;
                }
            }
            @media screen and (min-width: 1224px) {
                .top__corner{
                    margin: 16px 32px;
                    margin-bottom: -1px;
                    padding-bottom:56px;
                }
            }
        `}</style>
    </div>
)

export const BottomCorner = () =>(
    <div className="bottom__corner">

        <style jsx>{`

            .bottom__corner{
                background:#fff;
                margin: 0px 8px;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                margin-bottom: -1px;
                height: 4px;
            }
            @media screen and (min-width: 768px) {
                .bottom__corner{
                    margin: 0px 16px;
                    height: 0px;
                }
            }
            @media screen and (min-width: 1224px) {
                .bottom__corner{
                    margin: 0px 32px;
                }
            }
        `}</style>
    </div>
)