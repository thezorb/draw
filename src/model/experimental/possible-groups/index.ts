import Predicate from '../PredicateFunc'
import filterGroups from './filterGroups'

import * as GroupPredicateWorker from './GroupPredicateWorker'

async function asyncFind<T>(arr: T[], promisePredicate: (el: T) => Promise<boolean>) {
  const promises = arr.map(promisePredicate)
  for (let i = 0; i < arr.length; ++i) {
    const isPossible = await promises[i]
    if (isPossible) {
      return arr[i]
    }
  }
}

const getWorkerPromise = o => new Promise<boolean>(resolve => {
  const worker = new (GroupPredicateWorker as any)()
  worker.onmessage = e => {
    resolve(e.data)
    worker.terminate()
  }
  worker.postMessage(o)
})

export async function allPossibleGroups<T>(
  pots: T[][],
  groups: T[][],
  teamPicked: T,
  currentPotIndex: number,
  predicate: Predicate<T>,
) {
  const filtered = filterGroups(pots, groups, teamPicked, currentPotIndex, predicate)
  const promises = filtered.map(groupNum => getWorkerPromise({
    pots,
    groups,
    teamPicked,
    groupNum,
    currentPotIndex,
  }))
  const isPossibles = await Promise.all(promises)
  return filtered.filter((gn, i) => isPossibles[i])
}

export async function firstPossibleGroup<T>(
  pots: T[][],
  groups: T[][],
  teamPicked: T,
  currentPotIndex: number,
  predicate: Predicate<T>,
) {
  const filtered = filterGroups(pots, groups, teamPicked, currentPotIndex, predicate)
  const found = await asyncFind(filtered, groupNum => getWorkerPromise({
    pots,
    groups,
    teamPicked,
    groupNum,
    currentPotIndex,
  }))
  if (found === undefined) {
    throw new Error('no possible group found for some reason')
  }
  return found
}
