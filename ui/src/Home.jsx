/* eslint-disable linebreak-style */
/* eslint linebreak-style: ["error","windows"] */
/* eslint "react/react-in-jsx-scope": "off" */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "no-alert": "off" */
import React from 'react';

import {
  Label,
  Panel,
} from 'react-bootstrap';

import ProductTable from './ProductTable.jsx';
import ProductAdd from './ProductAdd.jsx';
import Toast from './Toast.jsx';

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      products: [],
      toastVisible: false,
      toastMessage: ' ',
      toastType: 'success',
    };

    this.createProduct = this.createProduct.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  async createProduct(product) {
    const newProduct = product;

    const query = `mutation productAdd($newProduct: ProductInputs!) {
        productAdd(product: $newProduct) {
            _id
        }
    }`;
    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { newProduct } }),
    }).then(() => {
      this.toastMessage = ' ';
    }).catch((err) => {
      alert(`Error in sending data to server: ${err.message}`);
    });
  }


  showSuccess(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'success',
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { state } = this;
    const {
      toastVisible,
      toastMessage,
      toastType,
    } = this.state;

    return (
      <div title="Inner Div">
        <h1 className="headerClass"><Label>CS 648 Products Inventory</Label></h1>
        <br />
        <br />
        <h2 className="headerClass">Home Page</h2>

        <br />
        <br />
        <Panel>
          <Panel.Heading>
            <Panel.Title className="headerClass">Create New Product</Panel.Title>
          </Panel.Heading>
          <hr />
          <Panel.Body>
            <ProductAdd createProduct={this.createProduct} />
          </Panel.Body>
        </Panel>
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
      </div>
    );
  }
}
