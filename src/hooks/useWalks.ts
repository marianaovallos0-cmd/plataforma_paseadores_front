import paseoApi, { PaseoResponse } from "@/core/infrastructure/api/paseo.api"
import { ApiError } from "@/core/types/api.types"
import { useEffect, useState } from "react"

export const useWalksByWalker = (walkerId: number) => {
  const [walks, setWalks] = useState<PaseoResponse[]>([])
  const [loadWalks, setLoadWalks] = useState(false)
  const [errorWalks, setErrorWalks] = useState<string | undefined>(undefined)

  const fetchWalksByWalker = async () => {
    try {
      setLoadWalks(true)
      const data = await paseoApi.getWalksByWalker(walkerId)
      setWalks(data)
    } catch (error) {
      const customError = error as ApiError
      setErrorWalks(customError.error.message)
    } finally {
      setLoadWalks(false)
    }
  }

  const endWalk = async (walkId: number) => {
    try {
      setLoadWalks(true)
      await paseoApi.endWalk(walkerId, walkId)
      await fetchWalksByWalker()
    } catch (error) {
      const customError = error as ApiError
      setErrorWalks(customError.error.message)
    } finally {
      setLoadWalks(false)
    }
  }

  useEffect(() => {
    fetchWalksByWalker()
  }, [walkerId])

  const inRouteWalks = walks.filter(w => w.estado === 'EN_CURSO')
  const finalizedWalks = walks.filter(w => w.estado === 'FINALIZADO')

  return {
    inRouteWalks,
    finalizedWalks,
    walks,
    loadWalks,
    errorWalks,
    endWalk
  }
}