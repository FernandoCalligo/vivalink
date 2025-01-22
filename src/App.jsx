import Ranking from './components/Ranking';
import MatchHistory from './components/MatchHistory';
import RegisterMatch from './components/RegisterMatch';
import { useState } from 'react';
function App() {
  const [show, setShow] = useState(false)
  console.log(show)
  return (
    <>
      <button onClick={() => setShow(!show)}>Agregar Partido</button>
      {
        show ? <div><RegisterMatch/> </div> : <></>
      }
      <Ranking></Ranking>
      <br />
      <MatchHistory></MatchHistory>
    </>
  );
};

export default App;
