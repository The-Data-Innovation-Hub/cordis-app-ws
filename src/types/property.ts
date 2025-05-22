export interface Property {
  id: string;
  user_id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  year_built: number;
  price: number;
  description: string;
  status: 'Available' | 'Rented' | 'Maintenance' | 'Sold';
  featured: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  search: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}
