import solicitudApi, { SolicitudResponse } from "@/core/infrastructure/api/solicitud.api"
import { ApiError } from "@/core/types/api.types"
import { useEffect, useState } from "react"

export const useRequestByOwner = (ownerId: number) => {
  const [requests, setRequests] = useState<SolicitudResponse[]>([])
  const [loadRequests, setLoadRequests] = useState(false)
  const [errorInRequests, setErrorInRequests] = useState<string | undefined>(undefined)

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


  useEffect(() => {
    fetchRequestsByOwner()
  }, [ownerId])

  return {
    requests,
    loadRequests,
    errorInRequests,
    refetchRequests:
      fetchRequestsByOwner
  }
}

export const useRequestByWalker = (walkerId: number) => {
  const [requests, setRequests] = useState<SolicitudResponse[]>([])
  const [loadRequests, setLoadRequests] = useState(false)
  const [errorInRequests, setErrorInRequests] = useState<string | undefined>(undefined)

  const fetchRequestsByWalker = async () => {
    try {
      setLoadRequests(true)
      const data = await solicitudApi.getByWalkerId(walkerId)
      setRequests(data)
    } catch (error) {
      const customError = error as ApiError
      setErrorInRequests(customError.error.message)
    } finally {
      setLoadRequests(false)
    }
  }

  const acceptRequest = async (requestId: number) => {
    try {
      setLoadRequests(true)
      await solicitudApi.acceptRequest(walkerId, requestId)
      await fetchRequestsByWalker()
    } catch (error) {
      const customError = error as ApiError
      setErrorInRequests(customError.error.message)
    } finally {
      setLoadRequests(false)
    }
  }

  const rejectRequest = async (requestId: number) => {
    try {
      setLoadRequests(true)
      await solicitudApi.rejectRequest(walkerId, requestId)
      await fetchRequestsByWalker()
    } catch (error) {
      const customError = error as ApiError
      setErrorInRequests(customError.error.message)
    } finally {
      setLoadRequests(false)
    }
  }

  useEffect(() => {
    fetchRequestsByWalker()
  }, [walkerId])

  const pendingRequests = requests.filter(rq => rq.estado === 'PENDIENTE')

  return {
    requests,
    pendingRequests,
    loadRequests,
    errorInRequests,
    refetchRequests:
      fetchRequestsByWalker,
    acceptRequest,
    rejectRequest
  }
}