import CardDeck from "@/services/CardDeck";
import Player from "@/services/enum/Player";
import Weather from "@/services/enum/Weather";
import { CardDeckPersistence, Round, Token } from "@/store";

export default function (params?: MockRoundParams) : Round {
  return {
    round: params?.round ?? 1,
    cardDeck: params?.cardDeck ?? CardDeck.new().toPersistence(),
    tokens: params?.tokens ?? [],
    citationUnlock: params?.citationUnlock,
    claimInitiative: params?.claimInitiative
  }
}

export interface MockRoundParams {
  round? : number
  cardDeck? : CardDeckPersistence
  tokens?: Token[]
  citationUnlock?: Weather[]
  claimInitiative?: Player
}
