import type { ComponentChild } from "@/core/types/basic.type";


export default function PublicLayout({ children }: ComponentChild) {
  return (
    <main>
      {children}
    </main>
  )
}
