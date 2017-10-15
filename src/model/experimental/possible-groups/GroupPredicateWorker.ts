import groupPredicate from './groupPredicate'
import predicate from '../predicate'

addEventListener('message', e => {
  const {
    pots,
    groups,
    teamPicked,
    groupNum,
    currentPotIndex,
  } = e.data

  const isPossible = groupPredicate(pots, groups, teamPicked, groupNum, currentPotIndex, predicate)

  postMessage(isPossible)
})
