import {
  LANDING_PAGE_RUMMY,
  LANDING_PAGE_FOOTBALL_FANTASY,
  LANDING_PAGE_CHECKER,
  LANDING_PAGE_LUDO,
  LANDING_PAGE_FOOTBALL,
  LANDING_PAGE_CRICKET,
  LANDING_PAGE_CHESS,
  LANDING_PAGE_POKER,
  LANDING_PAGE_PUGB,
  LANDING_PAGE_FREE_FIRE
} from '../configs/images';

export const LIST_TOP_GAMES = [
  // {
  //   txt: "Hero Adda",
  //   link: "/heroadda",
  //   ext: false
  // },



  {
    header: 'PUBG MOBILE',
    text: 'The PUBG game is now on vpl. Download this action-packed game along with the vpl app, join tournaments and get set to win cash everyday. So start participating in PUBG MOBILE tournaments now.',
    imgLink: LANDING_PAGE_PUGB,
    pageLink: '/pubg',
    altImg: "Pubg"
  },
  {
    header: 'Free Fire',
    text: 'One of the biggest survival shooter games is now live on vpl. Register for Free Fire tournaments on the vpl app and win big money everyday.',
    imgLink: LANDING_PAGE_FREE_FIRE,
    pageLink: '/free-fire',
    altImg: "Free Fire"
  },
  {
    header: 'Fantasy Games',
    text: 'Fantasy games have become a huge hit in India, and vpl offers you the ultimate fantasy gaming experience. Playing Fantasy Games online is one thing and playing Fantasy Games with vpl is another. vpl offers you the opportunity to win real cash for every Fantasy game that you play. We cover Fantasy Cricket, Fantasy Football, Fantasy Kabaddi, Fantasy Stocks & Fantasy BasketBall. So, when you have all the Fantasy games in one place, why go anywhere else?',
    imgLink: LANDING_PAGE_CRICKET,
    altImg: "Fantasy games",
    pageLink: '/fantasy',
    subParagraphes: [
      {
        header: 'How to play Fantasy Games online',
        text: 'All you need to do is download the vpl app and register yourself to start playing! Once you register, select the Fantasy Game you wish to play. Select the match you want to compete in and then pick your Fantasy team. Yes! It’s that sivple. Download the app and play now! You also get a bonus of Rs. 50 for every successful referral you make. So download the vpl app, start playing and win real cash!'
      },
      // {
      //     header:FANTASY_GAMES_WHAT_vpl_OFFERS_HEADER,
      //     text:FANTASY_GAMES_WHAT_vpl_OFFERS_PARAGRAPH
      // }
    ],
  },
  {
    header: 'vpl Fantasy Cricket',
    text: 'The vpl Fantasy Cricket app provides you a platform to showcase your cricket knowledge & skills. You can play fantasy cricket online and win real cash. In the vpl Fantasy cricket app, the players in your customised team score points on the basis of their performance in the match. We\'ve got you covered for every type of match that takes place in the world of cricket - International ODIs, Tests, T20s and even state-level matches. So download the vpl game app and start playing fantasy cricket now.',
    imgLink: LANDING_PAGE_CRICKET,
    pageLink: '/fantasy-cricket',
    altImg: "Fantasy cricket"
  },
  //  {
  //   header:'Poker',
  //   text:'The objective of Poker is to earn money by winning the pot which contains the amount placed by players during the hand. Playing Poker on vpl is absolutely safe and secure, and you could win attractive cash prizes too!',
  //   imgLink:LANDING_PAGE_POKER,
  //   pageLink:'/poker',
  //   altImg:"Poker"
  //  },
  // {
  //  header:FANTASY_FOOTBALL_HEADER,
  //  text:FANTASY_FOOTBALL_PARAGRAPH,
  //  imgLink:LANDING_PAGE_FOOTBALL_FANTASY,
  //  altImg:"Fantasy football"
  // },
  {
    header: 'vpl Rummy',
    text: 'Rummy online by vpl is one of the most popular card games and has gained an immense following over the years. vpl offers a highly interactive online version, which is enjoyable, easy and secure!',
    imgLink: LANDING_PAGE_RUMMY,
    pageLink: '/rummy',
    altImg: "Fantasy rummy"
  },
  {
    header: 'Ludo',
    text: 'Ludo is among the most popular board games that people love to play in their leisure time. This game can be played by 2 to 4 players. The objective of Ludo is to get your tokens to the finishing point before the other players by rolling a dice. Ludo is believed to be similar to Pachisi, a game which originated in India around the 6th century.',
    imgLink: LANDING_PAGE_LUDO,
    pageLink: '/ludo',
    altImg: "Fantasy ludo"
  },
  {
    header: 'vpl Speed Chess',
    text: 'Chess is believed to have originated approximately 1500 years ago in India. The game gradually spread across the Asian continent, and eventually reached Europe.  In the vpl Chess game, there are 6 distinct types of Chess pieces. Play Chess online with vpl, checkmate your opponents and earn cash online.',
    imgLink: LANDING_PAGE_CHESS,
    pageLink: '/chess',
    altImg: "Fantasy speed chess"
  }
];

