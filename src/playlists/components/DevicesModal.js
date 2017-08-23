import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableHighlight, View, Button, ListView } from 'react-native';
import R from 'ramda';

import * as actions from '../actions';
import * as selectors from '../selectors';
import styles from '/styles';

class DevicesModal extends Component {
  static propTypes = {
    onFetchDevices: PropTypes.func.isRequired,
    selectedDevice: PropTypes.object,
    onChangedDevice: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true//(r1 !== r2)
    });
    this.state = {
      open: false,
      dataSource: dataSource.cloneWithRows(this.props.devices),
    };
  }

  componentWillReceiveProps(nextProps) {
    const selectedDeviceChanged =
      !R.eqProps('selectedDevice', nextProps, this.props);

    const deviceListChanged =
      (nextProps.devices && !R.eqProps('devices', nextProps, this.props));

    if (selectedDeviceChanged || deviceListChanged) {
      this.updateListView(nextProps.devices);
    }
  }

  updateListView = devices => {
    console.log('updateListView');
    this.setState(prevState => ({
      dataSource: prevState.dataSource.cloneWithRows(devices)
    }));
  }

  handleClose = () => this.setState(() => ({open: false}));
  handleOpen = () => {
    this.props.onFetchDevices();
    this.setState(() => ({
      open: true
    }));
  };

  getTitle = () => {
    const {selectedDevice} = this.props;
    if (selectedDevice) {
      return `Selected Device: ${selectedDevice.name}`;
    } else {
      return 'Tap here to select a device to play on';
    }
  }

  handleDeviceSelected(deviceData) {
    this.props.onChangedDevice(deviceData);
  }

  renderRow = deviceData => (
    <TouchableHighlight
      underlayColor={'white'}
      activeOpacity={0.3}
      onPress={() => this.handleDeviceSelected(deviceData)}
    >
      <View style={styles.deviceListItem}>
        <Text>{deviceData.name}</Text>
        {this.props.selectedDevice && deviceData.id === this.props.selectedDevice.id &&
          <Text style={styles.deviceListItemCheckmark}>✅</Text>
        }
      </View>
    </TouchableHighlight>
  );

  renderSeparator = (sectionId, rowId) => {
    return <View key={rowId} style={styles.listSeperator}/>;
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
          <Text style={{
            textAlign: 'center',
            margin: 20,
            fontSize: 24,
            fontWeight: 'bold'
          }}>
            Select Device
          </Text>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderSeparator={this.renderSeparator}
          />
          {this.props.loading && <Text>Loading Devices...</Text>}
          <Button
            title={'Dismiss'}
            onPress={this.handleClose}
          />
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
    fetchDevices: () => dispatch(actions.devices.fetchDevices())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesModal);
