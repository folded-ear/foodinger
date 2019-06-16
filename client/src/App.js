import React, {Component} from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import Dispatcher from './data/dispatcher';
import {Container} from "flux/utils";
import AppHeader from './views/common/AppHeader';
import Login from './views/user/Login';
import NotFound from './views/common/NotFound';
import LoadingIndicator from './views/common/LoadingIndicator';
import PrivateRoute from './views/common/PrivateRoute';
import {Layout} from "antd";
import UserActions from "./data/UserActions";
import UserStore from "./data/UserStore";
import routes from './routes'

import './App.scss';

class App extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    
    handleLogout() {
        Dispatcher.dispatch({
            type: UserActions.LOGOUT,
        });
    }
    
    render() {
        const {authenticated, userLO} = this.props;
        const {Content} = Layout;
        
        if (!userLO.isDone()) {
            return <LoadingIndicator/>
        }
        const currentUser = authenticated
            ? userLO.getValueEnforcing()
            : null;
        
        return (
            <div>
                <AppHeader authenticated={authenticated} onLogout={this.handleLogout}/>
                
                <Content className="content">
                    <Switch>
                        {routes.public.map(route => {
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    render={ props => <route.component {...props} />}
                                    exact={route.exact}
                                />
                            )
                        })}

                        {routes.private.map(route => {
                            return (
                                <PrivateRoute
                                    key={route.path}
                                    path={route.path}
                                    component={route.component}
                                    currentUser={currentUser}
                                    authenticated={authenticated}
                                />
                            )
                        })}

                        <Route path="/login" render={(props) => <Login authenticated={authenticated} {...props} />}/>
                        <Route component={NotFound}/>
                    </Switch>
                
                </Content>
            </div>
        );
    }
}

export default Container.createFunctional(
    props => <App {...props} />,
    () => [
        UserStore,
    ],
    () => ({
        authenticated: UserStore.isAuthenticated(),
        userLO: UserStore.getProfileLO(),
    }),
);
