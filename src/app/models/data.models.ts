export interface Client {
  id_cliente: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  documento_identidad: string;
}

export interface Prescription {
  id_formula: number;
  id_cliente: number;
  fecha: string;
  od_esfera: number;
  od_cilindro: number;
  od_eje: number;
  oi_esfera: number;
  oi_cilindro: number;
  oi_eje: number;
  dp: number;
  adicion: number;
  observaciones: string;
  imageUrl?: string; // <-- AÑADIDO: Propiedad para la URL de la imagen (opcional)
}
