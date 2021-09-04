import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Home from "./pages/home";
import API from "./pages/api";
import Unavailable from "./pages/unavailable";

import './App.css';

/**
 * 
 * @returns 
 */
function Header() {
  // TODO: stylise nav (or remove entirely)
  return (
    <div id="nav-wrap">
      <nav>
        <a href="/">Unown-GAN</a>
        <a href="/api">API</a>
      </nav>
    </div>
  )
}

/**
 * 
 * @returns 
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/api" component={API}/>
          <Route path="/unavailable" component={Unavailable}/>
          <Redirect to="/unavailable"/>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
