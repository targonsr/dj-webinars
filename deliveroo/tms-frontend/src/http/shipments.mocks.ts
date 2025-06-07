import { Shipment } from "./shipments.model";

export const mockShipments: Shipment[] = [
  { id: 'SH001', origin: 'Warsaw', destination: 'Krakow', status: 'In Transit', driver: 'Michał Kowalski', eta: '2024-06-08' },
  { id: 'SH002', origin: 'Gdansk', destination: 'Wroclaw', status: 'Delivered', driver: 'Anna Nowak', eta: '2024-06-06' },
  { id: 'SH003', origin: 'Poznan', destination: 'Katowice', status: 'Loading', driver: 'Piotr Wiśniewski', eta: '2024-06-09' },
  { id: 'SH004', origin: 'Lodz', destination: 'Szczecin', status: 'In Transit', driver: 'Magdalena Dąbrowska', eta: '2024-06-07' },
  { id: 'SH005', origin: 'Prague', destination: 'Bratislava', status: 'Loading', driver: 'Jakub Lewandowski', eta: '2024-06-10' },
  { id: 'SH006', origin: 'Budapest', destination: 'Vienna', status: 'In Transit', driver: 'Katarzyna Zielińska', eta: '2024-06-08' },
  { id: 'SH007', origin: 'Lublin', destination: 'Bydgoszcz', status: 'Delivered', driver: 'Tomasz Szymański', eta: '2024-06-05' },
  { id: 'SH008', origin: 'Rzeszow', destination: 'Torun', status: 'In Transit', driver: 'Monika Woźniak', eta: '2024-06-09' },
  { id: 'SH009', origin: 'Opole', destination: 'Olsztyn', status: 'Loading', driver: 'Marcin Kozłowski', eta: '2024-06-11' },
  { id: 'SH010', origin: 'Kielce', destination: 'Zabrze', status: 'In Transit', driver: 'Agnieszka Jankowska', eta: '2024-06-08' },
  { id: 'SH011', origin: 'Radom', destination: 'Gliwice', status: 'Delivered', driver: 'Paweł Mazur', eta: '2024-06-06' },
  { id: 'SH012', origin: 'Białystok', destination: 'Częstochowa', status: 'Loading', driver: 'Beata Krawczyk', eta: '2024-06-12' },
];
