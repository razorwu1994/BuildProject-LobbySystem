import React from 'react'
import ReactDOM from 'react-dom/client'
import Game from './Events/TicTacToe/Game.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Lobby from './Lobby/index.jsx'

const router = createBrowserRouter([
  { path: '/:sessionId', element: <Game /> },
  { path: '/', element: <Lobby /> },
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
