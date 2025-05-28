import React from "react"
import './App.css'

// router
import Router from './router/router'

// контексты
import { UserProvider } from './context/UserContext'

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Создаем клиент (вне компонента, чтобы не пересоздавался)
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router />
      </UserProvider>
    </QueryClientProvider>
  )
}

export default App
