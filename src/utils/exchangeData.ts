// src/utils/exchangeData.ts
import { ExchangeMarker } from '@/types/exchange';

export const exchangeMarkers: ExchangeMarker[] = [
  {
    id: 'binance-us-east',
    name: 'Binance',
    latitude: 40.7128,
    longitude: -74.0060,
    cloudProvider: 'AWS',
    region: 'us-east-1',
    status: 'active'
  },
  {
    id: 'okx-asia-singapore',
    name: 'OKX',
    latitude: 1.3521,
    longitude: 103.8198,
    cloudProvider: 'GCP',
    region: 'asia-southeast1',
    status: 'active'
  },
  {
    id: 'bybit-eu-ireland',
    name: 'Bybit',
    latitude: 53.3498,
    longitude: -6.2603,
    cloudProvider: 'Azure',
    region: 'europe-west1',
    status: 'active'
  },
  {
    id: 'deribit-eu-netherlands',
    name: 'Deribit',
    latitude: 52.3676,
    longitude: 4.9041,
    cloudProvider: 'AWS',
    region: 'eu-west-1',
    status: 'active'
  }
];
