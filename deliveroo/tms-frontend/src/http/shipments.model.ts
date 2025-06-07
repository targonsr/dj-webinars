export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Loading';
  driver: string;
  eta: string;
}
