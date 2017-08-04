import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Dropzone from 'react-dropzone';

class Writers extends Component {
    constructor() {
        super()
        this.state = {
            home: false,
            files: [],
        }
    }
    onDrop(files) {
        this.setState({
            files: [...this.state.files, ...files]
        });
    }
    showFiles() {
        return this.state.files.map((f) => (<p>{f.name}</p>));
    }
    onHome(e) {
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
