import React, { Component } from "react";
import "../styles/style.scss";

export default class extends Component {
  componentDidMount() {}
  render() {
    return (
      <React.Fragment>
        <section>
          <div className="container secondary">
            <h1>GAMES OF SKILL</h1>
            <h3>WHAT KIND OF GAMES ARE ON vpl?</h3>
            {/* <h4>Mobile Premier League</h4> */}
            <p className="MsoNormal">
              <span>
                1.
                <span>  </span>
              </span>
              <span>
                Users must note that all games available on the vpl platform are
                ‘Games of Skill’, under Indian law, and that vpl does not
                support, endorse or offer to Users ‘games of chance’ for money.
                While ‘Games of Skill’ do not have a comprehensive definition,
                they are those games where the impact of a player’s effort and
                skill on the outcome of a game is higher than the impact of luck
                and chance.
              </span>
            </p>

            <p className="MsoNormal">
              <span>
                2. The games hosted on the vpl platform have clearly defined
                rules and Users are encouraged to read, understand and follow
                these rules to be successful in these games.
              </span>
            </p>

            <p className="MsoNormal">
              <span>
                3. The games hosted on the vpl platform are ‘Games of Skills’,
                such that the outcome / success in the games is directly
                dependent on the User’s effort, performance and skill. By
                choosing how to play, the actions of Users shall have direct
                impact on the game.
              </span>
            </p>

            <p className="MsoNormal">
              <span>
                4.
                <span>  </span>
                Every game will have some elements of chance, but in the form of
                challenges / obstacles that a User would be able to overcome
                using his/her skills and knowledge of the game. Elements of luck
                are present in every game to add thrill and excitement, but no
                two attempts at a game are identical so Users must use their
                skills in order to be successful
              </span>
            </p>

            <p className="MsoNormal">
              <span>
                5. Since the games available on the vpl platform can be won
                through Users’ skills and such skills may be enhanced with
                practice and experience, the performance of a User may improve
                with time and practice.
              </span>
            </p>

            <p className="MsoNormal">
              <span>
                6. Different games will reward different skills, but each game
                will reward certain skills, such as knowledge of the game,
                familiarity with rules, experience, reflexes, experience,
                practice, hand-eye coordination etc.
              </span>
            </p>

            <p className="MsoNormal">
              <span>
                7. Certain games may have pre-determined outcomes (Sudoku,
                Crosswords, Brick Breaker), and these outcomes are achievable by
                Users using their skills.
              </span>
            </p>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
