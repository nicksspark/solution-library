import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import superagent from 'superagent'

class Writers extends Component {
    constructor() {
        super()
        this.state = {
            home: false,
            files: [],
        }
    }
    onDrop(files) {
        console.log('files', [...this.state.files, ...files]);
        this.setState({
            files: [...this.state.files, ...files]
        });
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
        const self = this;
        // const reader = new FileReader();
        // reader.addEventListener("error", function() {
        //    console.log('file error');
        // });
        // let file;
        // reader.addEventListener("loadend", function() {
        //    // reader.result contains the contents of blob as a typed array
        //     console.log('here');
        //     file = reader.result;
        //     console.log('here again');
        // });
        // reader.readAsArrayBuffer(this.state.files[0])
        superagent.post('/api/upload')
            .set('Authorization', 'Bearer ' + self.props.token)
            .attach('myFile', this.state.files[0])
            .end((err, res) => {
                if (err) console.log(err);
                console.log('uploaded!');
            })
        // axios.post('/api/upload', {
        //     files: this.state.files[0]
        // }, {
        //     headers: {
        //         'Authorization': 'Bearer ' + self.props.token
        //     }
        // })
        // .then((res) => {
        //     if (res.data.success) {
        //         console.log('uploaded!');
        //     }
        // })
        // .catch((err) => {
        //     console.log('ERR', err);
        // })
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
                <div>
                    <h1>
                        Become a CramBerry contributor.
                    </h1>
                </div>
                <div>
                    <h2>
                        Post notes. Earn cash. Contact us at <a
                            href="mailto:cramberry@gmail.com"
                            target="_top">
                            CramBerry@gmail.com
                        </a>.
                    </h2>
                </div>
                <div>
                    <h2>
                        Drag-and-drop or click below to upload.
                    </h2>
                    <div style={styles.drop}>
                        <Dropzone
                            onDrop={this.onDrop.bind(this)}
                            accept=".pdf, .docx, .jpg, .png"
                        />
                    </div>
                    <h2>To be uploaded:</h2>
                    {this.showFiles()}
                    <a href='#' onClick={(e) => this.onUpload(e)}>Upload</a>
                </div>
                <div>
                    <a href='#' onClick={(e) => this.onHome(e)}>Home</a>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        token: state.reducer.token
    };
}

const mapDispatchToProps = (dispatch) => {
    return {};
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
}
