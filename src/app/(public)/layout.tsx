import { ReactNode } from "react"

const PublicLayout = ({children}: {children: ReactNode}) => {
  return (
    <main className="h-full dark:bg-[#1f1f1f]">
      {children}
    </main>
  )
}
export default PublicLayout