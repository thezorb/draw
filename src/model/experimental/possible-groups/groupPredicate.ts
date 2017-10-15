import { initial, last } from 'lodash'

import Predicate from '../PredicateFunc'
import filterGroups from './filterGroups'

export default function groupPredicate<T>(
  pots: T[][],
  groups: T[][],
  teamPicked: T,
  groupNum: number,
  currentPotIndex: number,
  predicate: Predicate<T>,
): boolean {
  if (pots[currentPotIndex].length === 0 && ++currentPotIndex === pots.length) {
    return true
  }

  const newGroups = groups.slice()
  const oldGroup = newGroups[groupNum]
  newGroups[groupNum] = [...oldGroup, teamPicked]

  const newPots = pots.slice()
  const oldPot = newPots[currentPotIndex]
  newPots[currentPotIndex] = initial(oldPot)
  const team = last(oldPot) as T

  return filterGroups(pots, newGroups, team, currentPotIndex, predicate)
    .some(gn => groupPredicate(newPots, newGroups, team, gn, currentPotIndex, predicate))
}
