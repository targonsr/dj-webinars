import { Driver } from "./drivers.model";

export const mockDrivers: Driver[] = [
  { id: 'DR001', name: 'Michał Kowalski', status: 'Active', currentLocation: 'Mazowieckie', rating: 4.8, deliveries: 145 },
  { id: 'DR002', name: 'Anna Nowak', status: 'Active', currentLocation: 'Małopolskie', rating: 4.9, deliveries: 203 },
  { id: 'DR003', name: 'Piotr Wiśniewski', status: 'Off Duty', currentLocation: 'Wielkopolskie', rating: 4.7, deliveries: 98 },
  { id: 'DR004', name: 'Magdalena Dąbrowska', status: 'Active', currentLocation: 'Dolnośląskie', rating: 4.6, deliveries: 156 },
  { id: 'DR005', name: 'Jakub Lewandowski', status: 'Off Duty', currentLocation: 'Śląskie', rating: 4.9, deliveries: 267 },
  { id: 'DR006', name: 'Katarzyna Zielińska', status: 'Active', currentLocation: 'Pomorskie', rating: 4.8, deliveries: 189 },
  { id: 'DR007', name: 'Tomasz Szymański', status: 'Active', currentLocation: 'Łódzkie', rating: 4.5, deliveries: 123 },
  { id: 'DR008', name: 'Monika Woźniak', status: 'Active', currentLocation: 'Lubelskie', rating: 4.7, deliveries: 178 },
  { id: 'DR009', name: 'Marcin Kozłowski', status: 'Off Duty', currentLocation: 'Kujawsko-pomorskie', rating: 4.6, deliveries: 134 },
  { id: 'DR010', name: 'Agnieszka Jankowska', status: 'Active', currentLocation: 'Zachodniopomorskie', rating: 4.8, deliveries: 198 },
  { id: 'DR011', name: 'Paweł Mazur', status: 'Active', currentLocation: 'Warmińsko-mazurskie', rating: 4.9, deliveries: 245 },
  { id: 'DR012', name: 'Beata Krawczyk', status: 'Off Duty', currentLocation: 'Podlaskie', rating: 4.7, deliveries: 167 },
];
