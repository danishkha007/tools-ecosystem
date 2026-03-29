export interface Tool {
  id: string;
  name: string;
  description: string;
  route: string;
  icon?: string;
  iconAlt?: string;
  category: string;
  longDescription?: string;
  buttonText?: string;
}
