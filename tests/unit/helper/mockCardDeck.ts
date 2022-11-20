import CardDeck from "@/services/CardDeck";

export default function (params?: MockCardDeckParams) : CardDeck {  
  return CardDeck.fromPersistence({
    deck: params?.deck ?? [],
    current: params?.current,
    discard: params?.discard ?? [],
  })
}

export interface MockCardDeckParams {
  deck?: number[]
  current?: number
  discard?: number[]
}
