import './App.less';
import './styles/login.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import AdminDashboardComponent from './components/AdminDashboardComponent';
import LoginComponent from './components/LoginComponent';
import ManagerDashboardComponent from './components/manager/ManagerDashboardComponent';
import CreatePostModalComponent from './components/posts/CreatePostModalComponent';
import NotFound404Component from './components/notFound/NotFound404Component';
function App() {

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={AdminDashboardComponent} title="Admin Dashboard"></Route>
        <Route path="/admin" render={() => {
          return localStorage.getItem("accessToken") ? <AdminDashboardComponent /> : <Redirect to="/login" />
        }}></Route>
        <Route path="/manage" exact component={ManagerDashboardComponent} title="Manage Dashboard"></Route>
        <Route path="/manage/cars" exact component={AdminDashboardComponent}></Route>
        <Route path="/manage/feedback" exact component={AdminDashboardComponent}></Route>
        <Route path="/manage/accounts" exact component={AdminDashboardComponent}></Route>
        <Route path="/manage/accessories" exact component={AdminDashboardComponent}></Route>
        <Route path="/profile" exact component={AdminDashboardComponent}></Route>
        <Route path="/login" exact component={LoginComponent}></Route>
        <Route path="/manage/posts" exact component={AdminDashboardComponent}></Route>
        <Route path="/create/post" exact component={AdminDashboardComponent}></Route>
        <Route path="/manager" exact component={ManagerDashboardComponent}></Route>
        <Route path="*" exact component={NotFound404Component}></Route>
      </Switch>
    </Router>
  );
}

export default App;
