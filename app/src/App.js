import React from 'react';

import './App.css';
import logo from './img/sievo-sustainable-solutions-transparent.png';

import Data from './data/sievo_spend_data_preprocessed.json';

const API_URL = "https://www.distance24.org/route.json"

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: '',
      destination: '',
      quantity: 0,
      data: Data,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  componentDidMount() {
    fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    let productQuery = this.state.product.toLowerCase();
    const filteredData = this.state.data.filter((row) => {
      return row.Product.toLowerCase().includes(productQuery);
    });
    console.log(filteredData);
    console.log(this.state.destination)
  }

  render() {
    //console.log(this.state.data);
    const { product, destination, quantity } = this.state;

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
              <label htmlFor='destination' className='FormLabel'>
                Destination
              </label>
              <input
                type='text'
                id='destination'
                name='destination'
                placeholder='Finland'
                minLength={1}
                maxLength={30}
                value={destination}
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
