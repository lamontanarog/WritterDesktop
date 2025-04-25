import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from "./store"
import { AppTheme } from './theme/Apptheme'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppTheme>
        <App />
      </AppTheme>
    </Provider>
  </StrictMode>,
)
