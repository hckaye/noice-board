import { Provider } from 'jotai'
import type { ReactNode } from 'react'

export function AppProvider({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>
}