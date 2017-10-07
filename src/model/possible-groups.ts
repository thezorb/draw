import { range, initial, last } from 'lodash'
import { GSTeam as Team } from './team'

export function allPossibleGroups(
  pots: Team[][],
  groups: Team[][],
  teamPicked: Team,
  currentPotIndex: number,
) {
  if (groups.every(group => group.length === 0)) {
    return range(groups.length)
  }
  return filterGroupsBasic(groups, teamPicked, currentPotIndex).filter(groupNum => {
    const newGroups = groups.slice()
    const oldGroup = newGroups[groupNum]
    newGroups[groupNum] = [...oldGroup, teamPicked]
    return groupIsPossible(pots, newGroups, currentPotIndex)
  })
}

export function firstPossibleGroup(
  pots: Team[][],
  groups: Team[][],
  teamPicked: Team,
  currentPotIndex: number,
) {
  if (groups.every(group => group.length === 0)) {
    return 0
  }
  return filterGroupsBasic(groups, teamPicked, currentPotIndex).find(groupNum => {
    const newGroups = groups.slice()
    const oldGroup = newGroups[groupNum]
    newGroups[groupNum] = [...oldGroup, teamPicked]
    return groupIsPossible(pots, newGroups, currentPotIndex)
  }) as number
}

function groupIsPossible(
  pots: Team[][],
  groups: Team[][],
  currentPotIndex: number,
): boolean {
  if (pots[currentPotIndex].length === 0 && ++currentPotIndex === pots.length) {
    return true
  }
  const newPots = pots.slice()
  const oldPot = newPots[currentPotIndex]
  newPots[currentPotIndex] = initial(oldPot)
  const team = last(oldPot) as Team
  return filterGroupsBasic(groups, team, currentPotIndex).some(groupNum => {
    const newGroups = groups.slice()
    const oldGroup = newGroups[groupNum]
    newGroups[groupNum] = [...oldGroup, team]
    return groupIsPossible(newPots, newGroups, currentPotIndex)
  })
}

function filterGroupsBasic(
  groups: Team[][],
  teamPicked: Team,
  currentPotIndex: number,
): number[] {
  const halfNumGroups = groups.length >> 1
  const bottom = filterSomeGroups(groups, teamPicked, currentPotIndex, 0, halfNumGroups)
  const top = filterSomeGroups(groups, teamPicked, currentPotIndex, halfNumGroups, groups.length)
  return bottom.length === 0 ? top : top.length === 0 ? bottom : bottom.concat(top)
}

const extraConstraints = (teamPicked: Team) =>
  teamPicked.country === 'ru' ?
    ((otherTeam: Team) => otherTeam.country === 'ua') : teamPicked.country === 'ua' ?
    ((otherTeam: Team) => otherTeam.country === 'ru') : (otherTeam: Team) => false

function filterSomeGroups(
  groups: Team[][],
  teamPicked: Team,
  currentPotIndex: number,
  start: number,
  end: number,
): number[] {
  const possibles: number[] = []
  const extraCondition = extraConstraints(teamPicked)

  for (let i = start; i < end; ++i) {
    const group = groups[i]
    let canDraw = true
    for (const team of group) {
      if (team.country === teamPicked.country || extraCondition(team)) {
        canDraw = false
        if (team.pairing === teamPicked) {
          return []
        }
        break
      }
    }
    if (canDraw && group.length <= currentPotIndex) {
      possibles.push(i)
    }
  }
  return possibles
}
