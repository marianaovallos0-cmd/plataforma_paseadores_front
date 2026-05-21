import solicitudApi, { SolicitudResponse } from "@/core/infrastructure/api/solicitud.api"
import { ApiError } from "@/core/types/api.types"
import { useEffect, useState } from "react"

export const useRequestByOwner = (ownerId: number) => {
  const [requests, setRequests] = useState<SolicitudResponse[]>([])
  const [loadRequests, setLoadRequests] = useState(false)
  const [errorInRequests, setErrorInRequests] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchRequestsByOwner = async () => {
      try {
        setLoadRequests(true)
        const data = await solicitudApi.getByOwnerId(ownerId)
        setRequests(data)
      } catch (error) {
        const customError = error as ApiError
        setErrorInRequests(customError.error.message)
      } finally {
        setLoadRequests(false)
      }
    }

    fetchRequestsByOwner()
  }, [])

  return {
    requests,
    loadRequests,
    errorInRequests
  }
}