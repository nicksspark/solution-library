import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import superagent from 'superagent';
import SearchBar from '../containers/SearchBar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

import Tesseract from 'tesseract.js';
import stopwords from 'stopwords';

import actions from '../actions/index';

class Writers extends Component {
    constructor() {
        super()
        this.state = {
            home: false,
            files: [],
            keyWords: [],
            chapters: [],
            chap: "",
            title: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }
    onDrop(files) {
        const fileType = files[0].type;
        this.setState({
            files: [...this.state.files, ...files],
            fileType: fileType,
        });
        // const sten = stopwords.english;
        // Tesseract.recognize(files[0])
        // .progress(message => console.log(message))
        // .catch(err => console.error(err))
        // .then(result => {
        //     console.log(result);
        //     let tessWords = {};
        //     result.words.forEach(word => {
        //         if (word.confidence > 50 &&
        //             isNaN(word.text) &&
        //             word.text.length > 2 &&
        //             /^[a-zA-Z]+$/.test(word.text)) {
        //             if (sten.indexOf(word.text.toLowerCase()) < 0) {
        //                 if (!tessWords[word.text]) {
        //                     tessWords[word.text] = 1;
        //                 } else {
        //                     tessWords[word.text]++;
        //                 }
        //             }
        //         }
        //     })
        //     const keyWords = [];
        //     for (let key in tessWords) {
        //         if (tessWords[key] > 4) {
        //             keyWords.push(key);
        //         }
        //     }
        //     console.log('array of words', keyWords);
            // this.setState({
            //     files: [...this.state.files, ...files],
            //     keyWords: keyWords
            // });
        // })
        // .finally(resultOrError => console.log('done'))
    }
    showFiles() {
        return (this.state.files.map((f) => (<p>{f.name}</p>)))
    }
    onHome(e) {
        this.setState({
            home: true
        });
    }
    onUpload(e) {
        e.preventDefault();
        // console.log("USER", this.props.user);
        const self = this;
        const ch = this.state.chap;
        const kw = this.state.keyWords;
        const tit = this.state.title;
        const ft = this.state.fileType;
        const files = this.state.files;
        let req = superagent.post('/api/upload')
            .set('Authorization', 'Bearer ' + self.props.token)
            .field('searchId', self.props.searchId)
            .field('chapter', ch)
            .field('user', self.props.user.id)
            .field('keyWords', kw)
            .field('title', tit)
            .field('fileType', ft);
        files.forEach(file => {
            req = req.attach('myFiles', file)
        })
        req.end((err, res) => {
            if (err) console.log(err);
            console.log('sent to backend');
        })
    }

    handleChange (event, index, value) {
        event.preventDefault();
        this.setState({
            chap: value
        });
    }

    componentWillReceiveProps (nextProps) {
        // console.log('nextprops', nextProps)
        if (!nextProps.isLoaded) {
            axios.post('/api/loadchapters', {
                bookId: nextProps.searchId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + nextProps.token
                }
            })
            .then((res) => {
                if (res.data.success) {
                    this.setState({
                        chapters: res.data.chapters,
                        chap: res.data.chapters[0]
                    });
                    // console.log('updated', res.data)
                    nextProps.loaded();
                }
            })
            .catch((err) => {
                console.log('ERR', err);
            })
        }
    }

    chapter () {
        if (this.state.chapters && this.props.isLoaded) {
            // this.props.loaded(); //have to unload at some point before searching again
            return (
                <div>
                    <h3>Select a chapter: </h3>
                    <DropDownMenu value={this.state.chap} onChange={this.handleChange}>
                        {this.state.chapters.map(chapter =>
                        <MenuItem value={chapter} primaryText={chapter}/>)}
                    </DropDownMenu>
                </div>
            )
        }
    }
    title (e) {
        e.preventDefault;
        this.setState({
            title: e.target.value
        });
        // console.log(this.state.title);
    }

    render() {
        if (!this.props.token) {
            return <Redirect to='/login'/>
        }
        if (this.state.home) {
            return <Redirect to='/students'/>
        }
        return (
            <div>
                <div style={styles.center}>
                    <h1>
                        Post your notes.
                    </h1>
                </div>
                <div style={styles.column}>
                    <h2>
                        Contact us at <a
                            href="mailto:cramberry@gmail.com"
                            target="_top">
                            CramBerry@gmail.com
                        </a>.
                    </h2>
                </div>
                <div style={styles.column}>
                    <h2>
                        Drag-and-drop or click below to upload.
                    </h2>
                    <div style={styles.drop}>
                        <Dropzone
                            onDrop={this.onDrop.bind(this)}
                            accept=".pdf, .png, .jpeg, .jpg"
                        />
                    </div>
                    <h2>To be uploaded:</h2>
                    {this.showFiles()}
                    <TextField onChange={(e) => {this.title(e)}}
                        hintText="Enter a title for your notes..."
                        value={this.state.title}
                    /><br />
                    <h2>Search for a book:</h2>
                    <SearchBar/>
                    {this.chapter()}
                    <br/>
                    <Divider />
                    <br/>
                    <div>
                    <a href='#' onClick={(e) => this.onUpload(e)}>Upload</a>
                    <a href='#' onClick={(e) => this.onHome(e)}>Home</a>
                </div>

            </div>
        </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        token: state.reducer.token,
        searchId: state.search.value,
        isLoaded: state.loader.bookLoaded,
        user: state.reducer.user,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loaded: () => {
            dispatch(actions.bookLoaded())
        }
    };
}

Writers = connect(mapStateToProps, mapDispatchToProps)(Writers);

export default Writers;

const styles = {
    drop: {
        display: 'inline-block',
        borderRadius: '4px',
    },
    block: {
        display: 'block',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
    },
    column: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    }
};
