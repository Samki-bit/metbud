
import Metronome from './routes/Metronome';
import NavBar from './components/navBar';
import { Routes, Route } from 'react-router-dom';
import Tuner from './routes/Tuner';
function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path={'/'} element={<Metronome />} />
        <Route path='/tuner' element={<Tuner />} />
      </Routes>
    </>



  );
}

export default App;
