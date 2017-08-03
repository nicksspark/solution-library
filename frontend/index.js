import React from 'react';
import { render } from 'react-dom';
import * as configureStore from './store/configureStore.dev';
import Root from './containers/Root.dev';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './assets/stylesheets/base.scss';

const store = configureStore.configureStore();

const App = () => (
    <MuiThemeProvider>
        <Root store={store} history={configureStore.history} />
    </MuiThemeProvider>
)
render(
    <App/>,
    document.getElementById('root')
);
