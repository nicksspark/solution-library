import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import axios from 'axios';
import actions from '../actions/index';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import Menu from 'material-ui/Menu';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chapter: 1,
            uploads: [],
            title: '',
            author: '',
            chapters: [],
            home: false
        };
    }

    componentDidMount() {
        console.log('mounting')
        const id = this.props.path.split('/')[2];
        axios.get('/api/book/' + id, {
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        })
        .then((res) => {
            if (res.data.success) {
                console.log('got response')
                this.setState({
                    uploads: res.data.uploads,
                    title: res.data.title,
                    author: res.data.author,
                    chapters: res.data.chapters,
                });
                console.log('state set', this.state.uploads)
            }
            this.props.loaded();
        })
        .catch((err) => {
            console.log('ERR', err);
        })
    }
    like(e, index) {
        e.preventDefault();
        const uploadArray = this.state.uploads[this.state.chapter-1];
        const uploadObj = uploadArray[index]
        const upvotes = uploadObj.upvotes + 1;
        axios.post('/api/like', {
            upvotes: upvotes,
            uploadId: uploadObj._id
        }, {
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        })
        .then((res) => {
            if (res.data.success) {
                const updatedUploadArray = uploadArray.map((upload, i) => {
                    if (i === index ) {
                        return res.data.updatedUpload;
                    }
                    return upload;
                });
                const updatedUploads = this.state.uploads.map((uploadArray, i) => {
                    if (i === this.state.chapter-1) {
                        return updatedUploadArray;
                    }
                    return uploadArray;
                })
                this.setState({
                    uploads: updatedUploads
                });
            }
        })
        .catch((err) => {
            console.log('ERR', err);
        })
    }

    printChap() {
        const uploads = this.state.uploads;
        const ch = this.state.chapter;
            if (uploads && ch) {
                const links = uploads[ch - 1];
                links.sort(function(a, b){
                    return parseFloat(b.upvotes) - parseFloat(a.upvotes);
                });
                return (
                    <div style={styles.root}>
                        <GridList
                            cellHeight={180}
                            style={styles.gridList}
                        >
                            {links.map((linkObj, index) => {
                                return (
                                    <GridTile
                                        key={linkObj._id}
                                        title={linkObj.title}
                                        subtitle={<span><b>{linkObj.upvotes}</b></span>}
                                        actionIcon={
                                            <div onClick={(e) => {this.like(e, index)}}>
                                                <IconButton>
                                                    <StarBorder color="white" />
                                                </IconButton>
                                            </div>}>
                                        <a href={linkObj.link} target='_blank' style={styles.block}>Download</a>
                                        <img src= "./visuals/note-2.png"/>

                                    </GridTile>
                                )
                            })}
                        </GridList>
                    </div>
                )
            }
    }


    onHome(e) {
        e.preventDefault();
        this.props.search('');
        this.props.loaded();
        this.setState({
            home: true
        });
    }

    render() {
        if (!this.props.token) {
            return <Redirect to='/login'/>
        }
        if (this.state.home) {
            return <Redirect to='/students'/>
        }
        var t = this.props.isLoaded && (
            <div>
                <div style={styles.links}>
                    <Drawer width="30%" open={true}>
                        <div>
                            {this.state.chapters.map(ch => {
                                return (
                                    <MenuItem
                                        primaryText={ch}
                                        onClick={() => {this.setState({chapter: this.state.chapters.indexOf(ch) + 1})}}
                                    />
                                )}
                            )}
                        </div>
                    </Drawer>
                </div>
                <div style={styles.center}>
                    <h1>
                        {this.state.title}
                    </h1>
                </div>
                <div style={styles.home}>
                    <a href='#' onClick={(e) => {this.onHome(e)}}>Home</a>
                </div>
                <div style={styles.links}>
                    {this.printChap()}
                </div>
            </div>
        )
        console.log(t)
        return t;
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
        paddingLeft: '400px',
        paddingBottom: '10px',
        paddingTop: '10px',
    },
    block: {
        display: 'block',
    },
    drawer: {
        minWidth: '400px'
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: 500,
        height: 450,
        overflowY: 'auto',
    },
    home: {
        float: 'right'
    }
};
