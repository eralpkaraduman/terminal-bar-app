import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableHighlight, View, Button } from 'react-native';
import * as actions from '../actions';
import * as selectors from '../selectors';

import styles from '/styles';

class DevicesModal extends Component {
  static propTypes = {
    onFetchDevices: PropTypes.func.isRequired,
    selectedDevice: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false
    };
  }

  handleClose = () => this.setState(() => ({open: false}));
  handleOpen = () => {
    this.props.onFetchDevices();
    this.setState(() => ({open: true}));
  };

  getTitle = () => {
    const {selectedDevice} = this.props;
    if (selectedDevice) {
      return `Selected Device: ${selectedDevice.name}`;
    } else {
      return 'Tap here to select a device to play on';
    }
  }

  renderModal() {
    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.open}
        onRequestClose={() => {alert('Modal has been closed.');}}
      >
        <View style={styles.modal}>
          <Button
            title={'Dismiss'}
            onPress={this.handleClose}
          />
          <Text>{JSON.stringify(this.props.devices, null, 4)}</Text>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View>
        <TouchableHighlight
          onPress={this.handleOpen}
          underlayColor={'white'}
          activeOpacity={0.2}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 40
          }}>
            <Text
              style={{flex: 1, textAlign: 'center'}}
            >
              {this.getTitle()}
            </Text>
          </View>
        </TouchableHighlight>
        {this.renderModal()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
   devices: selectors.selectDevices(state),
   loading: selectors.selectDevicesLoading(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDevices: () => dispatch(actions.playlists.fetchDevices())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesModal);
