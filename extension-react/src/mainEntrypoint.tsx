import React from 'react'
// import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
// import reportWebVitals from './reportWebVitals'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider
} from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import StyleExamples from './components/examples/StyleExamples'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Main from "./main";

const cache = createCache({
  key: 'css',
  prepend: true
})

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')
// const root = ReactDOM.createRoot(document.getElementById('root'))

// const theme = createTheme({
//   components: {
//     MuiPopover: {
//       defaultProps: {
//         container: rootElement
//       }
//     },
//     MuiPopper: {
//       defaultProps: {
//         container: rootElement
//       }
//     }
//   }
// })

const MainEntryPoint = () => {
  return (
      <>
        {/*<StyledEngineProvider injectFirst
        >*/}
        <CacheProvider value={cache}>
            <QueryClientProvider client={queryClient}>
              <CssBaseline/>
              {/*<RouterProvider router={router} />*/}
              <Main />
            </QueryClientProvider>
        </CacheProvider>
        {/*</StyledEngineProvider>*/}
      </>
  )
}

export default MainEntryPoint

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
