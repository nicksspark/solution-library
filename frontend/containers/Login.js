import React, {Component} from 'react';
import actions from '../actions/index';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';
import axios from 'axios';
import TextField from 'material-ui/TextField';

import RaisedButton from 'material-ui/RaisedButton';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      register: false
    };
    this.usernameChange = this.usernameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }
  // componentDidMount() {
  //     if (this.props.isStreamLoaded) {
  //         this.props.streamLoaded();
  //     }
  // }
  usernameChange(e) {
    e.preventDefault();
    this.setState({
      username: e.target.value
    });
  }
  passwordChange(e) {
    e.preventDefault();
    this.setState({
      password: e.target.value
    });
  }
  onLogin(e) {
    e.preventDefault();
    axios.post('http://localhost:3000/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then((res) => {
      if (res.data.success) {
    //   if (this.props.isStreamLoaded) {
    //       this.props.streamLoaded();
    //   }
      this.props.login(res.data.user, res.data.token);
      }
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
  }
  onRegister(e) {
    e.preventDefault();
    this.setState({
      register: true
    });
  }

  render() {
    if (this.props.token) {
      return <Redirect to='/students' />;
    }
    if (this.state.register) {
      return <Redirect to='/register' />;
    }
    return (
      <div style={CSSstyles.container}>
          <h2> Login </h2>
          <div>
              <form onSubmit={(e) => {this.onLogin(e)}}>
                  <TextField
                      hintText=""
                      floatingLabelText="Username"
                      value={this.state.username}
                      onChange={(e) => {this.usernameChange(e)}}
                  /><br />
                  <TextField
                      hintText=""
                      floatingLabelText="Password"
                      type="password"
                      value={this.state.password}
                      onChange={(e) => {this.passwordChange(e)}}
                  /><br />
                  <RaisedButton type='submit' label="Login" primary={true} style={JSstyles.submit} />
                  <RaisedButton label="Register" secondary={true} style={JSstyles.submit} onClick={(e) => {this.onRegister(e)}} />
              </form>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.reducer.token,
    // isStreamLoaded: state.loader.streamLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user, token) => {
            dispatch(actions.login(user, token))
        },
        // streamLoaded: () => {
        //     dispatch(actions.steamLoaded())
        // }
    };
};

Login = connect(mapStateToProps, mapDispatchToProps)(Login);

export default Login;

const JSstyles = {
  submit: {
    margin: 12,
  }
};

const CSSstyles = {
    container: {
      height: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 100
    }
};
