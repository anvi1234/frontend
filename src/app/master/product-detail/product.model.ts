/* =========================
   COMMON INTERFACES
========================= */

export interface Image {
  url: string;
  public_id: string;
  _id?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

/* =========================
   PRODUCT SECTIONS
========================= */

export interface ProductSection {
  _id: string;
  key: string;
  title: string;
  content: string; // HTML string
  collapsed: boolean;
}

/* =========================
   FEATURE VARIANTS
========================= */

export interface FeatureVariant {
  _id: string;
  attribute: string;       // e.g. "Weight"
  value: string;           // e.g. "2 Ratti"
  price: number;
  discountPercent: number;
  finalPrice: number;
  sku: string;
  inStock: boolean;
}

export interface ProductFeature {
  _id: string;
  label: string;           // Classic / Premium
  variants: FeatureVariant[];
}

/* =========================
   MAIN PRODUCT
========================= */

export interface Product {
  _id: string;

  name: string;
  subtitle: string;
  slug: string;

  price: number;
  currency: string;
  discount: number;
  finalPrice: number;

  category: Category;

  mainImage: Image;
  images: Image[];

  shortDescription: string; // HTML (Quill)
  sections: ProductSection[];
  features: ProductFeature[];

  isActive: boolean;
  inStock: boolean;

  ratingAverage: number;
  ratingCount: number;

  extraBadges: any[];
  reviews: any[];
  seo:any;
  openGraph:any;
  createdAt: string;
  updatedAt: string;
}
