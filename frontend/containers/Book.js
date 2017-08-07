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
            book: null
        };
    }

    componentWillMount() {
        const id = this.props.path.split('/')[2];
        axios.get('/api/book/' + id, {
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        })
        .then((res) => {
            if (res.data.success) {
                this.setState({
                    book: res.data.book
                });
            }
            this.props.loaded();
        })
        .catch((err) => {
            console.log('ERR', err);
        })
    }

    printChap() {
        const book = this.state.book;
        const ch = this.state.chapter;
            if (book && ch) {
                const chapterArr =  book.chapters[ch];
                const links = chapterArr.map((link) => (
                    <a href={link} target='_blank' style={styles.block}>Link to Chapter 1</a>
                ))
                return links;
            }
    }

    handleToggle() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        if (!this.props.token) {
            return <Redirect to='/login'/>
        }
        return this.props.isLoaded && (
            <div>
                <div style={styles.links}>
                    <RaisedButton
                        label="Toggle Contents"
                        onClick={() => {this.handleToggle()}}
                    />
                </div>
                <div style={styles.links}>
                    <div>
                        <a href='https://en.wikipedia.org/wiki/Probability' target="_blank">Top-voted notes</a>
                    </div>
                    <div>
                        <a href='https://en.wikipedia.org/wiki/Probability' target="_blank">More notes</a>
                    </div>
                    <div>
                        <a href='https://en.wikipedia.org/wiki/Probability' target="_blank">More notes</a>
                    </div>
                    <div>
                        <a href='https://en.wikipedia.org/wiki/Probability' target="_blank">More notes</a>
                    </div>
                    <div>
                        <a href='https://en.wikipedia.org/wiki/Probability' target="_blank">More notes</a>
                    </div>
                    {this.printChap()}
                </div>
                <Drawer open={this.state.open}>
                    <div>
                        <MenuItem
                            primaryText="1. Introduction"
                            menuItems={[
                                <div>
                                    <MenuItem primaryText="1.1 Equally Likely Outcomes"/>
                                    <MenuItem primaryText="1.2 Interpretations"/>
                                    <MenuItem primaryText="1.3 Distributions"/>
                                    <MenuItem primaryText="1.4 Conditional Probability and Independence"/>
                                    <MenuItem primaryText="1.5 Bayes' Rule"/>
                                    <MenuItem primaryText="1.6 Sequences of Events"/>
                                </div>
                            ]}
                            onClick={() => {this.setState({chapter: 1})}}
                        />
                        <MenuItem
                            primaryText="2. Repeated Trials and Sampling"
                            menuItems={[
                                <div>
                                    <MenuItem primaryText="2.1 Binomial Distribution"/>
                                    <MenuItem primaryText="2.2 Normal Approximation: Method"/>
                                    <MenuItem primaryText="2.3 Normal Approximation: Derivation"/>
                                    <MenuItem primaryText="2.4 Poisson Approximation"/>
                                    <MenuItem primaryText="2.5 Random Sampling"/>
                                </div>
                            ]}
                            onClick={() => {this.setState({chapter: 2})}}
                        />
                        <MenuItem
                            primaryText="3. Random Variables"
                            menuItems={[
                                <div>
                                    <MenuItem primaryText="3.1 Introduction"/>
                                    <MenuItem primaryText="3.2 Expectation"/>
                                    <MenuItem primaryText="3.3 SD and Normal Approximation"/>
                                    <MenuItem primaryText="3.4 Discrete Distributions"/>
                                    <MenuItem primaryText="3.5 The Poisson Distribution"/>
                                    <MenuItem primaryText="3.6 Symmetry"/>
                                </div>
                            ]}
                            onClick={() => {this.setState({chapter: 3})}}
                        />
                    </div>
                </Drawer>
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
