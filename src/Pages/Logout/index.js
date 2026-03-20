import React from 'react';
import { connect } from 'react-redux';
import { LogoutUser } from '../../Services/Actions';

class Logout extends React.Component {
    state = {};

    componentDidMount() {
        this.props.LogoutUser();
    }

    render() {
        return <></>;
    }
}
  
export default connect(null, { LogoutUser } )(Logout);