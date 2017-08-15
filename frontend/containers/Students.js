import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import actions from '../actions/index';
import { Redirect } from 'react-router';
//material ui
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import SearchBar from '../containers/SearchBar';
import { logout } from '../actions/index';
import axios from 'axios';

class Students extends Component {
    constructor() {
        super();
        this.state = {
            bookId: "",
            register: false,
            writer: false,
            books: []
        };
    }
    componentDidMount() {
        axios.get('/api/searchbar', {
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        })
        .then((res) => {
            if (res.data.success) {
                const mathData = [];
                const econData = [];
                const poliData = [];
                res.data.books.forEach(book => {
                    if (book.genre === 'Mathematics') {
                        mathData.push(book);
                    }
                    if (book.genre === 'Economics') {
                        econData.push(book);
                    }
                    if (book.genre === 'Political Science') {
                        poliData.push(book);
                    }
                })
                this.setState({
                    mathData: mathData,
                    econData: econData,
                    poliData: poliData,
                });
                this.props.streamLoaded();
                console.log('loaded');
            }
        })
        .catch((err) => {
            console.log('err', err);
        })
    }
    onLogout(e) {
        e.preventDefault();
        this.props.streamLoaded();
        this.props.logout();
    }
    textbook(e, key) {
        e.preventDefault();
        this.props.streamLoaded();
        this.setState({
            bookId: key
      });
    }
    onWriter(e) {
        e.preventDefault();
        this.props.streamLoaded();
        this.setState({
            writer: true
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
                    {this.state.mathData.map((book) => (
                    <GridTile
                        key={book.key}
                        title={book.title}
                        subtitle={book.author}
                        onClick={(e) => {this.textbook(e, book.key)}}
                    >
                        <img src={book.image}/>
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
                    {this.state.econData.map((tile) => (
                    <GridTile
                        // key={tile.img}
                        key={tile.key}
                        title={tile.title}
                        subtitle={tile.author}
                        onClick={(e) => {this.textbook(e, tile.key)}}
                    >
                        <img src={tile.image} />
                    </GridTile>
                  ))}
                </GridList>
            </div>
        );
    }
    poli() {
        return (
            <div style={styles.root}>
                <h2 style={styles.subHeader}>
                    Political Science
                </h2>
                <GridList
                    cellHeight={240}
                    cols={4}
                    style={styles.gridList}
                >
                    {this.state.poliData.map((book) => (
                    <GridTile
                        key={book.key}
                        title={book.title}
                        subtitle={book.author}
                        onClick={(e) => {this.textbook(e, book.key)}}
                    >
                        <img src={book.image}/>
                    </GridTile>
                  ))}
                </GridList>
            </div>
        );
    }
    render() {
        if (!this.props.token) {
            return <Redirect to='/' />
        }
        if (this.state.bookId) {
            return <Redirect to={"/textbook/" + this.state.bookId}/>
        }
        if (this.props.value) {
          return <Redirect to={"/textbook/" + this.props.value}/>
        }
        if (this.state.writer) {
            return <Redirect to="/writers"/>
        }
        return this.props.isLoaded && (
            <div>
                <span style={styles.title}>
                    <div style={styles.left}>
                        <a style={styles.link} href='#' onClick={(e) => {this.onWriter(e)}}>Become a contributor</a>
                    </div>
                    <div style={styles.logo}>
                        <img src="./visuals/Cramberry.png"></img>
                    </div>
                    <div style={styles.right}>
                        <a style={styles.link} href='#' onClick={(e) => {this.onLogout(e)}}>Logout</a>
                    </div>
                </span>
                <div style={styles.searchbar}>
                <SearchBar/>
            </div>
                {this.math()}
                {this.econ()}
                {this.poli()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.reducer.token,
        value: state.search.value,
        isLoaded: state.loader.streamLoaded,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(actions.logout());
        },
        streamLoaded: () => {
            dispatch(actions.streamLoaded());
        }
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
    },
    searchbar: {
        padding: '20px'
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
