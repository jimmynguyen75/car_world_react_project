import './App.less';
import './styles/login.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import AdminDashboardComponent from './components/AdminDashboardComponent';
import LoginComponent from './components/LoginComponent';
import ManagerDashboardComponent from './components/manager/ManagerDashboardComponent';
import NotFound404Component from './components/notFound/NotFound404Component';
import Test from './components/Test'
function App() {

  return (
    <Router>
      <Switch>
        {/* Admin */}
        <Route path="/" exact component={AdminDashboardComponent} title="Admin Dashboard"></Route>
        <Route path="/admin" render={() => { return localStorage.getItem("accessToken") ? <AdminDashboardComponent /> : <Redirect to="/login" /> }}></Route>
        <Route path="/manage" exact component={ManagerDashboardComponent} title="Manage Dashboard"></Route>
        <Route path="/manage/cars" exact component={AdminDashboardComponent}></Route>
        <Route path="/manage/accounts" exact component={AdminDashboardComponent}></Route>
        <Route path="/manage/accessories" exact component={AdminDashboardComponent}></Route>
        <Route path="/profile" exact component={AdminDashboardComponent}></Route>
        <Route path="/login" exact component={LoginComponent}></Route>
        <Route path="/create/post" exact component={AdminDashboardComponent}></Route>
        <Route path="/test" exact component={Test}></Route>

        {/* Manager */}
        <Route path="/quan-ly" render={() => { return localStorage.getItem("accessToken") ? <ManagerDashboardComponent /> : <Redirect to="/login" /> }}></Route>
        <Route path="/quan-ly/phan-hoi" component={ManagerDashboardComponent}></Route>
        <Route path="/quan-ly/bai-dang" component={ManagerDashboardComponent}></Route>
        <Route path="/quan-ly/su-kien" component={ManagerDashboardComponent}></Route>
        <Route path="/quan-ly/cuoc-thi" component={ManagerDashboardComponent}></Route>

        {/* Not Found - Must End */}
        <Route path="*" exact component={NotFound404Component}></Route>
      </Switch>
    </Router>
  );
}

export default App;
