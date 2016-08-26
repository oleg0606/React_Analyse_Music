// @flow
/* eslint-disable no-restricted-syntax */
import React, { PropTypes, Component } from 'react';
import Tuna from 'tunajs';

export default class Delay extends Component {
  connectNode: Object;
  static propTypes = {
    bypass: PropTypes.number,
    children: PropTypes.node,
    cutoff: PropTypes.number,
    delayTime: PropTypes.number,
    dryLevel: PropTypes.number,
    feedback: PropTypes.number,
    wetLevel: PropTypes.number,
  };
  static defaultProps = {
    bypass: 0,
    cutoff: 2000,
    delayTime: 150,
    dryLevel: 1,
    feedback: 0.45,
    wetLevel: 0.25,
  };
  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  static childContextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
  };
  constructor(props: Object, context: Object) {
    super(props);

    const tuna = new Tuna(context.audioContext);

    this.connectNode = new tuna.Delay({
      feedback: props.feedback,
      delayTime: props.delayTime,
      wetLevel: props.wetLevel,
      dryLevel: props.dryLevel,
      cutoff: props.cutoff,
      bypass: props.bypass,
    });

    this.connectNode.connect(context.connectNode);
  }
  getChildContext(): Object {
    return {
      ...this.context,
      connectNode: this.connectNode,
    };
  }
  componentWillReceiveProps(nextProps: Object) {
    for (const prop in nextProps) {
      if (this.connectNode[prop]) {
        this.connectNode[prop] = nextProps[prop];
      }
    }
  }
  componentWillUnmount() {
    this.connectNode.disconnect();
  }
  render(): React.Element<any> {
    return <span>{this.props.children}</span>;
  }
}
