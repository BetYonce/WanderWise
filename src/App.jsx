import React, { useState } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import MainRoute from './routes/MainRoutes';
import UserContext from './context/UserContext'

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
    <Router>
      <MainRoute />
    </Router>
    </UserContext.Provider>
  );
}

export default App;
