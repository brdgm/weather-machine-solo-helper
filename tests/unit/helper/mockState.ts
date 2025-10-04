import ChallengeCard from '@/services/enum/ChallengeCard'
import { Round, State } from '@/store/state'

export default function mockState(params?: MockStateParams) : State {  
  return {
    language: 'en',
    baseFontSize: 1,
    setup: {
      challengeCards: params?.challengeCards ?? []
    },
    rounds: params?.rounds ?? []
  }
}

export interface MockStateParams {
  challengeCards?: ChallengeCard[]
  rounds?: Round[]
}
