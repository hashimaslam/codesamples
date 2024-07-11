import React from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "emotion-theming";
import { theme, globalStyles } from "./stylesConfig";
import { Global } from "@emotion/core";
import { Box, Heading } from "@react-yuki/ui";

const Slider = dynamic(() => import("./Slider"));

const App = () => (
  <ThemeProvider theme={theme}>
    <>
      <Global styles={globalStyles} />
      <Box p={4}>
        <Box>
          <Heading
            as="h1"
            color="orange.4"
            fontSize={13}
            m={0}
            my={4}
            fontWeight={1}
            textAlign="center"
          >
            Centered Slides - Exavple
          </Heading>
        </Box>
        <Box>
          <Slider
            params={{
              slidesPerView: 3,
              spaceBetween: 30,
              centeredSlides: true,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
              },
            }}
          />
        </Box>
      </Box>
    </>
  </ThemeProvider>
);

export default App;
