import styles from './PetCounter.module.css'
import type { Pet } from './types'

interface PetCounterProps {
  pet: Pet
  onActualizarStat: (id: number, stat: 'comida' | 'agua' | 'juego' | 'sueño', valor: number) => void
}

export default function PetCounter({ pet, onActualizarStat }: PetCounterProps) {
  const calcularSalud = () => {
    const { comida, agua, juego, sueño } = pet.stats
    const total = (comida + agua + juego + sueño) / 4
    return Math.min(100, Math.round((total / 4) * 100))
  }

  const obtenerEstadoEmoji = () => {
    const salud = calcularSalud()
    if (salud === 0) return '😢'
    if (salud < 25) return '😟'
    if (salud < 50) return '😐'
    if (salud < 75) return '😊'
    return '😄'
  }

  const obtenerColorSalud = (valor: number) => {
    if (valor === 0) return styles.critico
    if (valor <= 1) return styles.bajo
    if (valor === 2) return styles.normal
    if (valor <= 4) return styles.optimo
    return styles.exceso
  }

  const salud = calcularSalud()
  const estadoEmoji = obtenerEstadoEmoji()

  return (
    <div className={styles.petCard}>
      <div className={styles.header}>
        <div className={styles.emojiGrande}>{pet.emoji}</div>
        <div className={styles.infoHeader}>
          <h2 className={styles.nombre}>{pet.nombre}</h2>
          <div className={styles.estadoEmoji}>{estadoEmoji}</div>
        </div>
      </div>

      <div className={styles.barraProgreso}>
        <div className={styles.barra} style={{ width: `${salud}%`, backgroundColor: getSaludColor(salud) }}></div>
      </div>
      <p className={styles.saludTexto}>Salud: {salud}%</p>

      <div className={styles.stats}>
        <div className={`${styles.stat} ${obtenerColorSalud(pet.stats.comida)}`}>
          <span className={styles.etiqueta}>🍖 Comida</span>
          <div className={styles.controles}>
            <button onClick={() => onActualizarStat(pet.id, 'comida', -1)} className={styles.btnMenos}>−</button>
            <span className={styles.valor}>{pet.stats.comida}</span>
            <button onClick={() => onActualizarStat(pet.id, 'comida', 1)} className={styles.btnMas}>+</button>
          </div>
        </div>

        <div className={`${styles.stat} ${obtenerColorSalud(pet.stats.agua)}`}>
          <span className={styles.etiqueta}>💧 Agua</span>
          <div className={styles.controles}>
            <button onClick={() => onActualizarStat(pet.id, 'agua', -1)} className={styles.btnMenos}>−</button>
            <span className={styles.valor}>{pet.stats.agua}</span>
            <button onClick={() => onActualizarStat(pet.id, 'agua', 1)} className={styles.btnMas}>+</button>
          </div>
        </div>

        <div className={`${styles.stat} ${obtenerColorSalud(pet.stats.juego)}`}>
          <span className={styles.etiqueta}>🎮 Juego</span>
          <div className={styles.controles}>
            <button onClick={() => onActualizarStat(pet.id, 'juego', -1)} className={styles.btnMenos}>−</button>
            <span className={styles.valor}>{pet.stats.juego}</span>
            <button onClick={() => onActualizarStat(pet.id, 'juego', 1)} className={styles.btnMas}>+</button>
          </div>
        </div>

        <div className={`${styles.stat} ${obtenerColorSalud(pet.stats.sueño)}`}>
          <span className={styles.etiqueta}>😴 Sueño</span>
          <div className={styles.controles}>
            <button onClick={() => onActualizarStat(pet.id, 'sueño', -1)} className={styles.btnMenos}>−</button>
            <span className={styles.valor}>{pet.stats.sueño}</span>
            <button onClick={() => onActualizarStat(pet.id, 'sueño', 1)} className={styles.btnMas}>+</button>
          </div>
        </div>
      </div>

      <div className={styles.puntosDiarios}>
        <span>⭐ Puntos hoy: {pet.puntosHoy}</span>
      </div>
    </div>
  )
}

function getSaludColor(salud: number) {
  if (salud < 25) return '#ff6b6b'
  if (salud < 50) return '#868e96'
  if (salud < 75) return '#51cf66'
  return '#40c057'
}
