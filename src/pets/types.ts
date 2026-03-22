export interface PetStats {
  comida: number
  agua: number
  juego: number
  sueño: number
}

export interface Pet {
  id: number
  nombre: string
  emoji: string
  stats: PetStats
  puntosHoy: number
}
