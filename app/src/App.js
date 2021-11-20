import React from 'react';

import './App.css';
import logo from './img/sievo-sustainable-solutions-transparent.png';

import Data from './data/sievo_spend_data_preprocessed.json';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: '',
      destination: '',
      quantity: 0,
      data: Data,
      filteredData: [],
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
    this.setState({
      filteredData,
    });
    //console.log(filteredData);
  }

  render() {
    //console.log(this.state.data);
    const { product, destination, quantity, data } = this.state;
    let filteredData = [];

    data.forEach((row) => {
      if (row.Product.toLowerCase().includes(product.toLowerCase())) {
        let o = {
          vendor: row.vendor,
          product: row.product,
        };
        let price = row.average_price * quantity;
        let co2_kg_kg = row.CO2_kg_kg * quantity;
        let air = 0.0005 * quantity * row.distance;
        let sea = 0.000025 * quantity * row.distance;
        let truck = 0.0001 * quantity * row.distance;
        let transport = {
          air: air,
          sea: sea,
          truck: truck,
        };
        let airTotal = co2_kg_kg + air;
        let seaTotal = co2_kg_kg + sea;
        let truckTotal = co2_kg_kg + truck;

        let total = {
          air: airTotal,
          sea: seaTotal,
          truck: truckTotal,
        };

        o['price'] = price;
        o['co2_kg_kg'] = co2_kg_kg;
        o['transport'] = transport;
        o['total'] = total;
        o['min'] = Math.min(airTotal, seaTotal, truckTotal);
        filteredData.push(o);
      }
    });

    filteredData = filteredData.sort((a, b) => {
      if (a.min === b.min) {
        return a.price - b.price;
      }
      return a.min - b.min;
    });

    console.log(filteredData);

    const vendorTable = (
      <table className='VendorTable'>
        <tbody>
          <tr>
            <th>Vendor</th>
            <th>Product</th>
            <th>Average price (€)</th>
            <th>Product CO₂ emissions (kg)</th>
            <th>Transport CO₂ emissions (kg)</th>
            <th>Total CO₂ emissions (kg)</th>
          </tr>
          {filteredData.map((row, index) => {
            return (
              <tr key={index}>
                <td>{row.vendor}</td>
                <td>{row.product}</td>
                <td>{row.price.toFixed(1)}</td>
                <td>{row.co2_kg_kg.toFixed(1)}</td>
                <td>
                  <div>Air cargo: {row.transport.air.toFixed(1)}</div>
                  <div>Sea cargo: {row.transport.sea.toFixed(1)}</div>
                  <div>Truck cargo: {row.transport.truck.toFixed(1)}</div>
                </td>
                <td>
                  <div>Air cargo: {row.total.air.toFixed(1)}</div>
                  <div>Sea cargo: {row.total.sea.toFixed(1)}</div>
                  <div>Truck cargo: {row.total.truck.toFixed(1)}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );

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
          <div className='Controls'>
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
            </form>
          </div>
          <div className='VendorData'>{vendorTable}</div>
        </div>
      </div>
    );
  }
}
