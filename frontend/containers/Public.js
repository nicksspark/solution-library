import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import actions from '../actions/index';
import { Redirect } from 'react-router';

//material ui
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';

class Students extends Component {
    constructor() {
      super();
      this.state = {
        register: false,
        login: false
      }
    }
    // componentDidMount() {
    //     if (this.props.isStreamLoaded) {
    //         this.props.streamLoaded();
    //     }
    // }
    onRegister(e) {
        e.preventDefault();
        this.setState({
            register: true
        });
    }
    onLogin(e) {
        e.preventDefault();
        this.setState({
            login: true
        });
    }
    math() {
        return (
            <div style={styles.root}>
                <h2 style={styles.subHeader}>
                    Mathematics
                </h2>
                <GridList
                    cellHeight={240}
                    cols={4}
                    style={styles.gridList}
                >
                    {mathData.map((tile) => (
                    <GridTile
                        // key={tile.img}
                        key={tile.key}
                        title={tile.title}
                        subtitle={tile.author}
                        // actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                    >
                        <img src={tile.img}/>
                    </GridTile>
                  ))}
                </GridList>
            </div>
        );
    }
    econ() {
        return (
            <div style={styles.root}>
                <h2 style={styles.subHeader}>
                    Economics
                </h2>
                <GridList
                    cellHeight={240}
                    cols={4}
                    style={styles.gridList}
                >
                    {econData.map((tile) => (
                    <GridTile
                        // key={tile.img}
                        key={tile.key}
                        title={tile.title}
                        subtitle={tile.author}
                    >
                        <img src={tile.img} />
                    </GridTile>
                  ))}
                </GridList>
            </div>
        );
    }
    render() {
        if (this.state.login) {
            return <Redirect to="/login"/>
        }
        if (this.state.register) {
            return <Redirect to="/register"/>
        }
        return (
            <div>
                <span style={styles.title}>
                    <div style={styles.left}>
                        <a style={styles.link} href='#' onClick={(e) => {this.onRegister(e)}}>Register</a>
                    </div>
                    <div style={styles.logo}>
                        <img src="./visuals/Cramberry.png"></img>
                    </div>
                    <div style={styles.right}>
                        <a style={styles.link} href='#' onClick={(e) => {this.onLogin(e)}}>Login</a>
                    </div>
                </span>
                {this.math()}
                {this.econ()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.reducer.token,
        // isStreamLoaded: state.loader.streamLoaded,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(actions.logout());
        },
        // streamLoaded: () => {
        //     dispatch(actions.streamLoaded());
        // }
    }
}

Students = connect(mapStateToProps, mapDispatchToProps)(Students);

export default Students;

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingBottom: '40px',
    },
    gridList: {
        width: 900,
        height: 500,
        overflowY: 'auto',
        fontFamily: 'helvetica',
        borderWidth: '1px solid grey',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
    },
    subHeader: {
        color: 'grey',
    },
    title: {
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        color: 'grey',
    },
    right: {
        textAlign: 'right',
        paddingLeft: '195px',
        paddingTop: '20px',
        paddingRight: '36px',
    },
    link: {
        display: 'block',
        marginTop: '10px',
        marginBottom: '10px',
    },
    left: {
        paddingTop: '20px',
        paddingLeft: '36px'
    }
};

const mathData = [
    {
        img: 'https://images-na.ssl-images-amazon.com/images/I/41a28A84XhL._SX422_BO1,204,203,200_.jpg',
        title: 'Early Transcendentals',
        author: 'Stewart',
        key: '596fea7c734d1d6202a70d1f',
    },
    {
        img: 'https://images-na.ssl-images-amazon.com/images/I/51bY4%2B%2BNbQL._SX258_BO1,204,203,200_.jpg',
        title: 'Early Transcendentals',
        author: 'Anton',
        key: 2,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 3,
    },
    {
        img: 'https://images-na.ssl-images-amazon.com/images/I/51M%2BQwL-KYL._SX436_BO1,204,203,200_.jpg',
        title: 'Probability',
        author: 'Pitman',
        key: 4,
    },
    {
        img: 'https://images-na.ssl-images-amazon.com/images/I/41a28A84XhL._SX422_BO1,204,203,200_.jpg',
        title: 'Early Transcendentals',
        author: 'Stewart',
        key: 5,
    },
    {
        img: 'https://images-na.ssl-images-amazon.com/images/I/51bY4%2B%2BNbQL._SX258_BO1,204,203,200_.jpg',
        title: 'Early Transcendentals',
        author: 'Anton',
        key: 6,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 7,
    },
    {
        img: 'https://images-na.ssl-images-amazon.com/images/I/51M%2BQwL-KYL._SX436_BO1,204,203,200_.jpg',
        title: 'Probability',
        author: 'Pitman',
        key: 8,
    },
    {
        img: 'https://images-na.ssl-images-amazon.com/images/I/41a28A84XhL._SX422_BO1,204,203,200_.jpg',
        title: 'Early Transcendentals',
        author: 'Stewart',
        key: 9,
    },
    {
        img: 'https://images-na.ssl-images-amazon.com/images/I/51bY4%2B%2BNbQL._SX258_BO1,204,203,200_.jpg',
        title: 'Early Transcendentals',
        author: 'Anton',
        key: 10,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 11,
    },
    {
        img: 'https://images-na.ssl-images-amazon.com/images/I/51M%2BQwL-KYL._SX436_BO1,204,203,200_.jpg',
        title: 'Probability',
        author: 'Pitman',
        key: 12,
    },
];
const econData = [
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 1,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 2,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 3,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 4,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 5,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 6,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 7,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 8,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 9,
    },
    {
        img: 'http://www1.udel.edu/udaily/2012/may/images/FrankMEA_200px%5b1%5d.jpg',
        title: 'Principles of Economics',
        author: 'Frank',
        key: 10,
    },
]
