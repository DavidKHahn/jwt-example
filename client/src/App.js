import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Authenticated from './components/Authenticated';
import Home from './components/Home';
import Login from './components/Login';
import Protected from './components/Protected';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/' exact component={Home} />
          <Authenticated>
            <Route path="/protected" component={Protected} />
          </Authenticated>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

