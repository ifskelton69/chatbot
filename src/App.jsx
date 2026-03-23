import { Route, Routes } from "react-router"
import ChatUI from "./chatui"
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChatUI />} />
      </Routes>
    </div>
  )
}

export default App
