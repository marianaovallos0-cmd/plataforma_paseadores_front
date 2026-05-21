import { ESTADOS_SOLICITUD } from "@/constants"
import { useMemo } from "react"
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa"

const STATUS_CONFIG = {
  [ESTADOS_SOLICITUD.PENDIENTE]: {
    texto: 'Esperando confirmación...',
    clase: 'badge-pendiente',
    icono: <FaSpinner className="icono-girando" />
  },

  [ESTADOS_SOLICITUD.ACEPTADA]: {
    texto: 'Paseo aceptado',
    clase: 'badge-aceptada',
    icono: <FaCheckCircle />
  },

  [ESTADOS_SOLICITUD.RECHAZADA]: {
    texto: 'Rechazada',
    clase: 'badge-rechazada',
    icono: <FaTimesCircle />
  },

  [ESTADOS_SOLICITUD.FINALIZADA]: {
    texto: 'Finalizada',
    clase: 'badge-finalizada',
    icono: <FaCheckCircle />
  },

  [ESTADOS_SOLICITUD.CANCELADA]: {
    texto: 'Cancelada',
    clase: 'badge-rechazada',
    icono: <FaTimesCircle />
  }
}

export const getStatusBadge = (status: string) => {
  return STATUS_CONFIG[status] || {
    texto: status,
    clase: '',
    icono: null
  }
}