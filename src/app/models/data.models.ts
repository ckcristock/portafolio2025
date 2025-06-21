export interface Client {
  id_cliente: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  documento_identidad: string;
}

// Esta interfaz ahora coincide 100% con tu backend
export interface Prescription {
  id_formula: number;
  id_cliente: number;
  folio_doctor: string | null;
  fecha: string;
  od_esfera: number | null;
  od_cilindro: number | null;
  od_eje: number | null;
  av_od: string | null; // Corregido
  oi_esfera: number | null;
  oi_cilindro: number | null;
  oi_eje: number | null;
  av_oi: string | null; // Corregido
  dp: number | null;
  adicion: number | null;
  observaciones: string | null;
  ruta_imagen: string | null; // Corregido
}
