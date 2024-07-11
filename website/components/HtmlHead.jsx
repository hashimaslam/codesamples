import Head from "next/head";

export const HtmlHead = (props) => (
  <Head>
    <title>{props.head.title}</title>
    <link rel="icon" type="image/x-icon" href={props.head.faviconImageUrl} />
    <link rel="canonical" href={props.head.canonical} />
    <link rel="alternate" href="https://www.vpl.live" hreflang="x-default" />
    {props.hreflang && (
      <>
        <link rel="alternate" href="https://www.vpl.live" hreflang="en-IN" />
        <link rel="alternate" href="https://id.vpl.live/" hreflang="id-ID" />
        <link rel="alternate" href="https://www.vpl.us/" hreflang="en-US" />
      </>
    )}
    {props.head.noindex && <meta name="robots" content="noindex, nofollow" />}
    {props.schema && (
      <script
        defer
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: props.schema }}
      />
    )}
    {props.head.metaTags &&
      props.head.metaTags.map(
        (data, index) =>
          (data.property && (
            <meta
              property={data.property}
              content={data.content}
              key={index}
            ></meta>
          )) ||
          (data.name && (
            <meta name={data.name} content={data.content} key={index}></meta>
          ))
      )}
    <link rel="preconnect" href="https://akedge.vpl.live" />
    {props.device == "desktop" ? (
      <link
        rel="preload"
        as="image"
        href={props.desktopWebp}
        type="image/webp"
      />
    ) : (
      <link
        rel="preload"
        as="image"
        href={props.mobileWebp}
        type="image/webp"
      />
    )}
  </Head>
);
