import React from 'react';

import './App.css';
import logo from './img/sievo-sustainable-solutions-transparent.png';
import Data from './data/sievo_spend_data_preprocessed.json';

import { Pie } from 'react-chartjs-2';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: 'tomato',
      quantity: 10,
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
  }

  render() {
    const { product, quantity, data } = this.state;
    let filteredData = [];
    let vendorTable;
    let chartData;

    if (product && quantity > 0) {
      data.forEach((row) => {
        if (row.Product.toLowerCase().includes(product.toLowerCase())) {
          let o = {
            vendor: row.vendor,
            vendor_country: row.vendor_country,
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
          o['min'] = Math.min(air, sea, truck);
          o['minTotal'] = Math.min(airTotal, seaTotal, truckTotal);
          filteredData.push(o);
        }
      });

      filteredData = filteredData.sort((a, b) => {
        if (a.minTotal === b.minTotal) {
          return a.price - b.price;
        }
        return a.minTotal - b.minTotal;
      });

      vendorTable = (
        <table className='VendorTable' cellSpacing='1' cellPadding='1'>
          <tbody>
            <tr className='VendorTableHeader'>
              <th>Product</th>
              <th>Vendor</th>
              <th>Vendor country</th>
              <th>Price estimate (€)</th>
              <th>Product CO₂ emissions (kg)</th>
              <th>Transport CO₂ emissions (kg)</th>
              <th>Total CO₂ emissions (kg)</th>
            </tr>
            {filteredData.map((row, index) => {
              return (
                <tr
                  key={index}
                  className={index === 0 ? 'VendorTableBest' : ''}
                >
                  <td>{row.product}</td>
                  <td>{row.vendor}</td>
                  <td className='VendorTableCenter'>{row.vendor_country}</td>
                  <td className='VendorTableCenter'>{row.price.toFixed(1)}</td>
                  <td className='VendorTableCenter'>
                    {row.co2_kg_kg.toFixed(1)}
                  </td>
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
      chartData = {
        labels: [
          'Product CO₂ emissions (kg)',
          'Minimum Transport CO₂ emissions (kg)',
        ],
        datasets: [
          {
            data: [filteredData[0].co2_kg_kg, filteredData[0].min],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
      };
    } else {
      vendorTable = (
        <div className='Error'>Please select a product and quantity.</div>
      );
    }

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
                <select
                  name='destination'
                  id='destination'
                  className='FormInput'
                >
                  <option value='finland'>Helsinki, Finland</option>
                  <option value='more'>More coming soon...</option>
                </select>
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
          {product && quantity && (
            <div className='BestVendorData'>
              <Pie
                data={chartData}
                width={'30%'}
                options={{ maintainAspectRatio: false }}
              ></Pie>
            </div>
          )}
        </div>
      </div>
    );
  }
}
