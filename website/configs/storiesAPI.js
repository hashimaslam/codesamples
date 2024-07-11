//const caller = require("grpc-caller");
//let Stories_PROTO = "../proto/StoriesService.proto";


export const starStories =   function(storyClient) {
 let c =  storyClient.getStarStories({});
return c;
}

 export const webTrendingTags =  async function(storyClient) {
 let c = await storyClient.getWebTrendingTags({});
 return c;
 }

export const storiesByTagWeb = async function(storyClient) {
  let c = await storyClient.getStoriesByTagWeb({"tagId":'LB-90sKeGaane2-1597940062000'});
  return c;
}