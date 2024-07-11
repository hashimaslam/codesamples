export const PageInfoParagraphGrey = ({ pageInfoSection,heading,content, headingStyle }) => (
         <section className="paragraph-grey-section">
           <div className="container">
             <div className="section-layout">
               <div className="row paragraph-row">
                 {pageInfoSection && pageInfoSection.heading ? (
                   headingStyle ? (
                     <h1 className="section-header section-header--medium main-header">
                       {heading}
                     </h1>
                   ) : (
                     <h2 className="section-header section-header--medium">
                       {heading}
                     </h2>
                   )
                 ) : (
                   ""
                 )}

                 {content &&
                   content.map((para, key) => (
                     <p key={key} className="page-info-description">
                       {para}
                     </p>
                   ))}
                 {pageInfoSection.pageLink ? (
                   <p className="page-info-description">
                     <span className="know-more">
                       <a href={pageInfoSection.pageLink}>Click here </a>to read
                       more FAQS about Rummy.
                     </span>
                   </p>
                 ) : (
                   ""
                 )}
               </div>
             </div>
           </div>

           <style jsx>{`
             section.paragraph-grey-section {
               background: #f0f0f0;
               .main-header {
                 font-size: 16px;
                 line-height: 20px;
                 text-transform: capitalize;
               }
             }

             .paragraph-row {
               .sub-header {
                 font-size: 28px;
               }
               .page-info-description {
                 font-size: 12px;
                 line-height: 16px;
                 text-align: left;
               }

               .know-more a {
                 color: red;
               }
             }

             @media screen and (min-width: 768px) {
               section.paragraph-grey-section {
                 background: #ffffff;
                 .main-header {
                   font-size: 20px;
                 }
               }

               .paragraph-row {
                 .sub-header {
                   font-size: 28px;
                 }
                 .page-info-description {
                   font-size: 14px;
                   line-height: 19px;
                   text-align: center;
                 }
               }
             }

             @media screen and (min-width: 1224px) {
               section.paragraph-grey-section {
                 .main-header {
                   font-size: 28px;
                 }
               }
               .paragraph-row {
                 .page-info-description {
                   font-size: 20px;
                   line-height: 28px;
                 }
               }
             }
           `}</style>
         </section>
       );
