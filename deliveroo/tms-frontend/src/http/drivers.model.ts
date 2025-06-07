export interface Driver {
  id: string;
  name: string;
  status: 'Active' | 'Off Duty';
  currentLocation: string;
  rating: number;
  deliveries: number;
}
