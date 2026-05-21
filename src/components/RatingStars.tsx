import { memo } from "react"
import { BiStar } from "react-icons/bi"
import { BsStarHalf } from "react-icons/bs"

interface RatingStarsProps {
  rating: number
  maxStars?: number
  size?: number
}

export const RatingStars = memo(({
  rating,
  maxStars = 5,
  size = 18
}: RatingStarsProps) => {

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars =
    maxStars - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      {
        Array.from({ length: fullStars }).map((_, i) => (
          <BiStar
            key={`full-${i}`}
            size={size}
            fill="currentColor"
          />
        ))
      }

      {
        hasHalfStar && (
          <BsStarHalf
            size={size}
            fill="currentColor"
          />
        )
      }

      {
        Array.from({ length: emptyStars }).map((_, i) => (
          <BiStar
            key={`empty-${i}`}
            size={size}
            opacity={0.3}
          />
        ))
      }
    </div>
  )
})