/**
 * Abbildung der Demo-Typen (src/demo/types.ts) auf das Datenbankschema (src/model/schema.ts).
 * Die Demo behält ihr flaches Card-Modell (praktisch für die UI); diese Funktionen zeigen,
 * wie daraus später Customer / NfcCard / CardStatsDaily werden.
 *
 *   Card.id            -> NfcCard.id
 *   Card.cardNumber    -> NfcCard.cardCode
 *   Card.slug          -> NfcCard.redirectSlug
 *   Card.status        -> NfcCard.active ('active' === true)
 *   Card.businessName  -> Customer.businessName
 *   Card.targetUrl     -> Customer.googleReviewUrl
 *   DailyPoint         -> CardStatsDaily (nfc -> nfcCount, qr -> qrCount)
 */
import type { Customer, NfcCard, CardStatsDaily } from '../model/schema'
import type { Card, DailyPoint } from './types'

/** In der Demo gehört jede Karte zu genau einem Kunden. */
export const customerIdFor = (card: Card) => `cust-${card.id}`

export function toCustomer(card: Card, createdAt: string): Customer {
  return { id: customerIdFor(card), businessName: card.businessName, googleReviewUrl: card.targetUrl, createdAt }
}

export function toNfcCard(card: Card, createdAt: string): NfcCard {
  return {
    id: card.id,
    cardCode: card.cardNumber,
    customerId: customerIdFor(card),
    redirectSlug: card.slug,
    active: card.status === 'active',
    createdAt,
  }
}

export function toCardStatsDaily(card: Card, series: DailyPoint[]): CardStatsDaily[] {
  return series.map((p) => ({ cardId: card.id, date: p.date, nfcCount: p.nfc, qrCount: p.qr }))
}
