import ChallengeCard from '@/services/enum/ChallengeCard';
import { Round, State } from '@/store';

export default function (params?: MockStateParams) : State {  
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
