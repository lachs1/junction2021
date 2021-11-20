import React from 'react';

import './App.css';
import logo from './img/sievo-sustainable-solutions-transparent.png';

import Data from './data/sievo_spend_data_preprocessed.json';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: '',
      from: '',
      to: '',
      quantity: 0,
      data: Data,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let productQuery = this.state.product.toLowerCase();
    const filteredData = this.state.data.filter((row) => {
      return row.Product.toLowerCase().includes(productQuery);
    });
    console.log(filteredData);
  }

  render() {
    //console.log(this.state.data);
    const { product, from, to, quantity } = this.state;

    return (
      <div className='App'>
        <div className='Sidebar'>
          <div className='SidebarButton'>
            ☰<div>More</div>
          </div>
          <div className='SidebarButton'>
            🌿 <div>Vendors</div>
          </div>
          <div className='SidebarButton'>
            🧾 <div>History</div>
          </div>
        </div>
        <div className='Dashboard'>
          <img src={logo} alt='Logo' height={80} />
          <form onSubmit={this.handleSubmit} className='Form'>
            <div className='FormRow'>
              <label htmlFor='product' className='FormLabel'>
                Product
              </label>
              <input
                type='text'
                id='product'
                name='product'
                placeholder='Tomato'
                minLength={1}
                maxLength={30}
                value={product}
                onChange={this.handleChange}
                className='FormInput'
              ></input>
            </div>
            <div className='FormRow'>
              <label htmlFor='from' className='FormLabel'>
                From
              </label>
              <input
                type='text'
                id='from'
                name='from'
                placeholder='Austria'
                minLength={1}
                maxLength={30}
                value={from}
                onChange={this.handleChange}
                className='FormInput'
              ></input>
            </div>
            <div className='FormRow'>
              <label htmlFor='to' className='FormLabel'>
                To
              </label>
              <input
                type='text'
                id='to'
                name='to'
                placeholder='Finland'
                minLength={1}
                maxLength={30}
                value={to}
                onChange={this.handleChange}
                className='FormInput'
              ></input>
            </div>
            <div className='FormRow'>
              <label htmlFor='quantity' className='FormLabel'>
                Quantity (kg)
              </label>
              <input
                type='number'
                id='quantity'
                name='quantity'
                minLength={1}
                maxLength={30}
                value={quantity}
                onChange={this.handleChange}
                className='FormInput'
              ></input>
            </div>
            <div className='FormRow'>
              <input
                className='FormSubmitButton'
                type='submit'
                value='Search'
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
