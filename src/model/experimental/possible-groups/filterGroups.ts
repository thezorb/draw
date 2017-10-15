import { range } from 'lodash'

import Predicate from '../PredicateFunc'

export default <T>(
  pots: T[][],
  groups: T[][],
  teamPicked: T,
  currentPotIndex: number,
  predicate: Predicate<T>,
) => range(0, groups.length)
  .filter(i => predicate(teamPicked, i, currentPotIndex, groups))
