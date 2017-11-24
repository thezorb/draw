import * as React from 'react'
import { difference, range } from 'lodash'

import Team from 'model/team'
import Table from 'components/table/Table'
import Header from 'components/table/Header'
import Body from 'components/table/Body'
import Row from 'components/table/Row'
import Cell from './GroupCell'

interface Props {
  maxTeams: number,
  groupLetter: string,
  teams: Team[],
  potNum: number,
  possible: boolean,
  airborneTeams: Team[],
}

const Group: React.SFC<Props> = ({
  maxTeams,
  groupLetter,
  teams,
  potNum,
  possible,
  airborneTeams,
}) => {
  const nonAirborneTeams = difference(teams, airborneTeams)
  return (
    <Table>
      <thead>
        <Header>
          Group {groupLetter}
        </Header>
      </thead>
      <Body>
        {nonAirborneTeams.map((team, i) => (
          <Row>
            <Cell
              country={team.country}
              picked
            >
              {team.shortName || team.name}
            </Cell>
          </Row>
        ))}
        {range(nonAirborneTeams.length, maxTeams).map(i => (
          <Row>
            <Cell
              possible={i === potNum && possible}
              data-cellid={`${groupLetter}${i}`}
            />
          </Row>
        ))}
      </Body>
    </Table>
  )
}

export default Group
