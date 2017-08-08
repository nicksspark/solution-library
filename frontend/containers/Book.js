import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import axios from 'axios';
import actions from '../actions/index';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import Menu from 'material-ui/Menu';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            chapter: 1,
            uploads: [],
            title: '',
            author: '',
            chapters: [],
            home: false
        };
    }

    componentDidMount() {
        const id = this.props.path.split('/')[2];
        axios.get('/api/book/' + id, {
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        })
        .then((res) => {
            if (res.data.success) {
                this.setState({
                    uploads: res.data.uploads,
                    title: res.data.title,
                    author: res.data.author,
                    chapters: res.data.chapters,
                });
            }
            this.props.loaded();
        })
        .catch((err) => {
            console.log('ERR', err);
        })
    }

    printChap() {
        const uploads = this.state.uploads;
        const ch = this.state.chapter;
        console.log('uploads', uploads)
        console.log('links', uploads[ch - 1])
            if (uploads && ch) {
                const links = uploads[ch - 1];
                return links.map((link) => (
                    <a href={link} target='_blank' style={styles.block}>link: {link}</a>
                ))
            }
    }

    handleToggle() {
        this.setState({
            open: !this.state.open
        });
    }

    onHome(e) {
        e.preventDefault();
        this.props.search('');
        this.props.loaded();
        this.setState({
            home: true
        });
    }
    contents() {
        const chapters = this.state.chapters;
        return (
            <Drawer open={this.state.open}>
                <div>
                    {chapters.map(ch => (
                        <MenuItem
                            primaryText={ch}
                            onClick={() => {this.setState({chapter: chapters.indexOf(ch) + 1})}}
                        />
                    ))}
                </div>
            </Drawer>
        )
    }

    render() {
        if (!this.props.token) {
            return <Redirect to='/login'/>
        }
        if (this.state.home) {
            return <Redirect to='/students'/>
        }
        return this.props.isLoaded && (
            <div>
                <div style={styles.links}>
                    <RaisedButton
                        label="Toggle Contents"
                        onClick={() => {this.handleToggle()}}
                    />
                </div>
                <h1 styles={styles.center}>
                    {this.state.title}
                </h1>
                <div style={styles.links}>
                    <div>
                        <a href='https://en.wikipedia.org/wiki/Probability' target="_blank">Top-voted notes</a>
                    </div>
                    {this.printChap()}
                </div>
                <div style={styles.links}>
                    <a href='#' onClick={(e) => {this.onHome(e)}}>Home</a>
                </div>
                <div>
                    {this.contents()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        path: state.router.location.pathname,
        token: state.reducer.token,
        isLoaded: state.loader.loaded
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        loaded: () => {
            dispatch(actions.loaded());
        },
        search: (val) => {
            dispatch(actions.search(val))
        }
    };
};

Book = connect(mapStateToProps, mapDispatchToProps)(Book);

export default Book;

const styles = {
    menu: {
        display: 'inline-block',
        height: '100%',
    },
    container: {
        display: 'flex',
        alignItems: 'stretch',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
    },
    links: {
        paddingLeft: '275px',
        paddingBottom: '10px',
        paddingTop: '10px',
    },
    block: {
        display: 'block',
    },
};
