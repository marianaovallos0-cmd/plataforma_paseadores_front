import { WalkersRanking } from "@/core/types/analytics.types"
import { useEffect, useState } from "react"
import analyticsApi from "@/core/infrastructure/api/analytics.api"
import { ApiError } from "@/core/types/api.types"

export const useWalkers = () => {
  const [walkers, setWalkers] = useState<WalkersRanking[]>([])
  const [loadWalkers, setLoadWalkers] = useState(false)
  const [errorInWalkers, setErrorInWalkers] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchWalkers = async () => {
      try {
        setLoadWalkers(true)

        const data =
          await analyticsApi.getWalkersRanking()

        setWalkers(data)
      } catch (error) {
        const errorCustom = error as ApiError;
        setErrorInWalkers(errorCustom.error.message);
      } finally {
        setLoadWalkers(false)
      }
    }

    fetchWalkers()
  }, [])

  return {
    walkers,
    loadWalkers,
    errorInWalkers
  }
}