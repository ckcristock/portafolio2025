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
  folio_doctor: string; // <-- Cambiado de string | null a solo string
  fecha: string;
  od_esfera: number | null;
  od_cilindro: number | null;
  od_eje: number | null;
  av_od: string | null;
  oi_esfera: number | null;
  oi_cilindro: number | null;
  oi_eje: number | null;
  av_oi: string | null;
  dp: number | null;
  adicion: number | null;
  observaciones: string | null;
  ruta_imagen: string | null;
}
