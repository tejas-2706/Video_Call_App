import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Lobby } from './pages/Lobby'
import Room from './pages/Room'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Lobby/>}></Route>
      <Route path='/room/:roomId' element={<Room/>}></Route>
    </Routes>
    </>
  )
}

export default App
