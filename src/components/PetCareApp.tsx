import { useState, useEffect } from 'react'
import PetCounter from '../pets/PetCounter'
import styles from './PetCareApp.module.css'
import type { Pet, PetStats } from '../pets/types'

export default function PetCareApp() {
  const [pets, setPets] = useState<Pet[]>([
    { id: 1, nombre: 'Gato', emoji: '🐱', stats: { comida: 0, agua: 0, juego: 0, sueño: 0 }, puntosHoy: 0 },
    { id: 2, nombre: 'Perro', emoji: '🐶', stats: { comida: 0, agua: 0, juego: 0, sueño: 0 }, puntosHoy: 0 },
    { id: 3, nombre: 'Conejo', emoji: '🐰', stats: { comida: 0, agua: 0, juego: 0, sueño: 0 }, puntosHoy: 0 },
    { id: 4, nombre: 'Hamster', emoji: '🐹', stats: { comida: 0, agua: 0, juego: 0, sueño: 0 }, puntosHoy: 0 },
    { id: 5, nombre: 'Unicornio', emoji: '🦄', stats: { comida: 0, agua: 0, juego: 0, sueño: 0 }, puntosHoy: 0 },
  ])

  const [ultimoReset, setUltimoReset] = useState<string>(new Date().toDateString())
  const [puntosGlobales, setPuntosGlobales] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date()
      if (ahora.getHours() === 0 && ahora.getMinutes() === 0) {
        handleResetDiario()
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const datosGuardados = localStorage.getItem('petCareData')
    if (datosGuardados) {
      const datos = JSON.parse(datosGuardados)
      setPets(datos.pets)
      setPuntosGlobales(datos.puntos)
      setUltimoReset(datos.ultimoReset)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('petCareData', JSON.stringify({
      pets,
      puntos: puntosGlobales,
      ultimoReset,
    }))
  }, [pets, puntosGlobales, ultimoReset])

  const calcularPuntos = (stats: PetStats) => {
    let puntos = 0
    const evaluar = (valor: number, objetivo: number) => {
      if (valor === 0) return 0
      if (valor >= objetivo && valor <= objetivo + 2) return 25
      if (valor < objetivo) return 10
      if (valor > objetivo + 2) return 5
      return 0
    }
    puntos += evaluar(stats.comida, 2)
    puntos += evaluar(stats.agua, 2)
    puntos += evaluar(stats.juego, 2)
    puntos += evaluar(stats.sueño, 2)
    return puntos
  }

  const handleResetDiario = () => {
    const hoy = new Date().toDateString()
    if (ultimoReset !== hoy) {
      setPets(pets.map(pet => ({
        ...pet,
        stats: { comida: 0, agua: 0, juego: 0, sueño: 0 },
        puntosHoy: 0,
      })))
      setUltimoReset(hoy)
    }
  }

  const actualizarStat = (id: number, stat: 'comida' | 'agua' | 'juego' | 'sueño', valor: number) => {
    setPets(pets.map(pet => {
      if (pet.id === id) {
        const newStats = { ...pet.stats, [stat]: Math.max(0, pet.stats[stat] + valor) }
        const newPuntos = calcularPuntos(newStats)
        const puntosGanados = newPuntos - pet.puntosHoy
        setPuntosGlobales(puntosGlobales + puntosGanados)
        return { ...pet, stats: newStats, puntosHoy: newPuntos }
      }
      return pet
    }))
  }

  const handleResetManual = () => {
    handleResetDiario()
    alert('¡Nuevo día! Los contadores se han reiniciado.')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🐾 Pet Care</h1>
        <p className={styles.subtitle}>Cuida a tus mascotas y aliméntalas todos los días</p>

        <div className={styles.statsGlobales}>
          <div className={styles.puntos}>
            <span className={styles.icono}>⭐</span>
            <span className={styles.valor}>Puntos Globales: {puntosGlobales}</span>
          </div>
          <button onClick={handleResetManual} className={styles.btnReset}>
            🔄 Reset Manual
          </button>
        </div>

        <div className={styles.infoReset}>
          <p>⏰ <strong>Reset automático a medianoche</strong> - Los contadores se reinician cada día para un nuevo desafío</p>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendGroup}>
            <h3>Estados de Salud</h3>
            <div className={styles.legendItem}>
              <span className={styles.redDot}></span>
              <span>Crítico (0-1) - Necesita atención urgente</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.grayDot}></span>
              <span>Normal (2) - Estado saludable</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.greenDot}></span>
              <span>Óptimo (3-4) - Muy bien cuidado</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.orangeDot}></span>
              <span>En exceso (5+) - Demasiado</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.petsGrid}>
        {pets.map(pet => (
          <PetCounter
            key={pet.id}
            pet={pet}
            onActualizarStat={actualizarStat}
          />
        ))}
      </div>
    </div>
  )
}
