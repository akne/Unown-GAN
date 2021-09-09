import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import API from "./pages/api";
import Unavailable from "./pages/unavailable";

import './App.css';

/**
 * Function that contains the structure for the site's header.
 * @returns A div containing the header (just a heading currently).
 */
function Header() {
  return (
    <div id="header">
      <h1>Unown-GAN</h1>
    </div>
  )
}

/**
 * Function that establishes the routes to each page.
 * @returns A react router with a path to the API and unavailable pages.
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route exact path="/" component={API}/>
          <Route path="/unavailable" component={Unavailable}/>
          <Redirect to="/unavailable"/>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
