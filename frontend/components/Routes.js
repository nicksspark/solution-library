import React, { Component } from 'react';
import { Switch, Router, Redirect, Route } from 'react-router';
// import AppContainer from '../containers/AppContainer';
import App from './App';
import Login from '../containers/Login';
import Writers from './Writers';
import Students from '../containers/Students';
import Register from '../containers/Register';
import Book from '../containers/Book';
import Public from '../containers/Public';

class Routes extends Component {
    render() {
        return (
            <App>
                <Switch>
                    <Route exact path='/' component={Public}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/students' component={Students}/>
                    <Route path='/register' component={Register}/>
                    <Route path='/writers' component={Writers}/>
                    <Route path='/textbook' component={Book}/>
                </Switch>
            </App>
        )
    }
}

export default Routes;
