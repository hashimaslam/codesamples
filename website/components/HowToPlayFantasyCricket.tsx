export const HowToPlayFantasyCricket = () => (
  <div className="how-to-play-background">
    <div className="how-to-play-fantasy-cricket">
      <h2>How to play Fantasy Cricket?</h2>
      <p>
        Download the vpl app and sign up with your mobile number. Choose Fantasy
        Cricket. Once you do this, you will be shown a list of matches you can
        participate in. Select a match and start making your pro Fantasy Cricket
        team. You will get 100 credits with which you can choose players for
        your team.
      </p>
      <div className="bulletPoints">
        <h3>How to choose players?</h3>
        <p style={{ marginBottom: "12px", marginTop: "0" }}>
          You need 11 players to make a Fantasy Cricket Team:
        </p>
        <div>
          <ul>
            <li>Wicket-Keeper (Minimum- 1, Maximum 4)</li>
            <li>Batsmen (Minimum- 3, Maximum 6)</li>
            <li>All-rounders (Minimum-1, Maximum- 4)</li>
            <li>Bowlers (Minimum-3, Maximum- 6) </li>
          </ul>
        </div>

        <p style={{ marginBottom: "0" }}>
          You can select a maximum of 7 players from one playing side.
        </p>
      </div>
      <div className="bulletPoints">
        <h3>How to manage teams?</h3>
        <p style={{ marginBottom: "12px", marginTop: "0px" }}>
          You can manage your teams for a match from the 'Your Teams' section.
          This section can be found in every match on the vpl Fantasy Cricket
          app.
        </p>
      </div>
      <div className="bulletPoints">
        <h3>How many teams can I create for a single match?</h3>
        <p style={{ marginBottom: "12px", marginTop: "0px" }}>
          The maximum number of teams you can create depends on the contest
          category. For exavple, a user can create a maximum of 40 teams in a
          Rumble Cricket Fantasy contest.
        </p>
      </div>
    </div>
    <style jsx>
      {`
        .how-to-play-background {
          background: #f0f0f0;
          .how-to-play-fantasy-cricket {
            padding: 32px 24px;

            > h2 {
              font-weight: bold;
              font-size: 14px;
              line-height: 18px;
              text-align: center;
              color: #222222;
              align-self: center;
              margin: 0 12px;
            }
            > p {
              font-weight: normal;
              font-size: 12px;
              line-height: 16px;
              color: #828282;
              text-align: left;
              align-self: center;
              margin: 12px 0;
            }
            > .bulletPoints {
              padding: 16px 0;
              font-family: Roboto;
              font-style: normal;
              font-weight: normal;
              font-size: 12px;
              line-height: 16px;
              text-align: left;
              color: #828282;
              > h3 {
                font-weight: 500;
                font-size: 12px;
                line-height: 16px;
                color: #4a4a4a;
                align-self: center;
                margin-bottom: 4px;
                padding: 0;
                margin-top: 0;
              }
              ul {
                padding: 0;
                list-style-position: inside;
                list-style: bullet;
              }
              ul,
              li {
                font-family: Roboto;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                text-align: left;
                color: #828282;
                align-self: center;
                text-transform: none;
              }
            }
          }
        }
        @media screen and (min-width: 768px) {
          .how-to-play-background {
            .how-to-play-fantasy-cricket {
              width: 720px;
              margin: auto;
            }
          }
        }
      `}
    </style>
  </div>
);
