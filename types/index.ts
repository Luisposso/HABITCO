export interface User {
  uid: string;
  nombreCompleto: string;
  email: string;
  carrera: string;
  fotoPerfil?: string;
  calificacionPromedio: number;
  totalCalificaciones: number;
  fechaRegistro: Date;
  productosPublicados: number;
  telefono?: string;
}

export interface Product {
  id: string;
  userId: string;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  estado: 'nuevo' | 'usado';
  imagenes: string[];
  fechaPublicacion: Date;
  disponible: boolean;
  interesados: number;
}

export interface Chat {
  id: string;
  participantes: string[];
  productoId?: string;
  ultimoMensaje: string;
  ultimaActualizacion: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  imagen?: string;
  tipo: 'texto' | 'imagen' | 'comprobante';
  fecha: Date;
  leido: boolean;
}