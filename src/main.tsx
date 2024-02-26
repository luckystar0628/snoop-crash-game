import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SVGs from './components/svg.tsx'
import StoreProvider from './store/store.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <SVGs />
    <App />
  </StoreProvider>,
)
