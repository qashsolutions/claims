import { createContext, useContext, type ReactNode } from 'react'
import { useAgenticFlow } from '@/hooks/useAgenticFlow'

type FlowContextType = ReturnType<typeof useAgenticFlow>

const FlowContext = createContext<FlowContextType | null>(null)

export function FlowProvider({ children }: { children: ReactNode }) {
  const flow = useAgenticFlow()

  return <FlowContext.Provider value={flow}>{children}</FlowContext.Provider>
}

export function useFlow() {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider')
  }
  return context
}
