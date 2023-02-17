import * as React from 'react';
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import {Switch} from 'react-router-dom';

import Home from './pages/Home.tsx';
import AddEdit from './pages/AddEdit.tsx';
import View from './pages/View.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/addContact" component={AddEdit} />
        <Route path="/update/:id" component={AddEdit} />
        <Route path="/view/:id" component={View} />
      </Switch>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
