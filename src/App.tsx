import React, { useState } from 'react';
import './App.css';
import { CreateUser } from './components/CreateUser';
import { UserList } from '../src/components/UserList/UserList';

function App() {
  const [showUserList, setShowUserList] = useState(false)

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button style={{ backgroundColor: showUserList ? '#3c425c' : 'white' }} className="TabButton" onClick={() => setShowUserList(false)}>Skapa uppdrag</button>
          <button style={{ backgroundColor: showUserList ? 'white' : '#3c425c' }}  className="TabButton" onClick={() => setShowUserList(true)}>Lista uppdrag</button>
          {showUserList ? <UserList /> : <CreateUser />}
        </div>
      </header>
    </div>
  );
}

export default App;
