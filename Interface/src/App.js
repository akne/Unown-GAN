import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Home from "./pages/home";
import Generate from "./pages/generate";
import Interpolate from "./pages/interpolate";
import Bulk from "./pages/bulk";
import Unavailable from "./pages/unavailable";

import './App.css';

/**
 * 
 * @returns 
 */
function Header() {
  return (
    <div id="nav-wrap">
      <nav>
        <a href="/">Unown-GAN</a>
        <a href="/generate">Generate</a>
        <a href="/interpolate">Interpolate</a>
        <a href="/bulk">Bulk</a>
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
          <Route exact path="/generate" component={Generate}/>
          <Route exact path="/interpolate" component={Interpolate}/>
          <Route exact path="/bulk" component={Bulk}/>
          <Route path="/unavailable" component={Unavailable}/>
          <Redirect to="/unavailable"/>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
