import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Students from './Students';

const AppContainer = () => {
    return (
        <div>
            <Students />
        </div>
    );
};

AppContainer.propTypes = {
    name: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        name: state.name
    };
};

const mapDispatchToProps = (/* dispatch */) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppContainer);
