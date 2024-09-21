import { AuthProvider } from "./context/AuthContext"
import AppRoutes from "./routes/AppRoutes"

function App() {
  return (
    <div>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  )
}

export default App
