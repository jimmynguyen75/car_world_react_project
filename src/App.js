import './App.less';
import './styles/login.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminDashboardComponent from './components/AdminDashboardComponent';
import LoginComponent from './components/LoginComponent';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={AdminDashboardComponent}></Route>
        <Route path="/manage/cars" exact component={AdminDashboardComponent}></Route>
        <Route path="/manage/Feedback" exact component={AdminDashboardComponent}></Route>
        <Route path="/login" exact component={LoginComponent}></Route>
      </Switch>
    </Router>
  );
}

export default App;
