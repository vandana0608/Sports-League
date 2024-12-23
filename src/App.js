import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Schedule from './components/Schedule';
import Leaderboard from './components/Leaderboard';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Schedule} />
          <Route exact path="/schedule" component={Schedule} />
          <Route exact path="/leaderboard" component={Leaderboard} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;