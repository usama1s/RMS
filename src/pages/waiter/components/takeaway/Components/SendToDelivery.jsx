import { useState } from 'react';
import api from '../../../../../config/AxiosBase';
import printJS from 'print-js';

export const SendToDelivery = ({
  apiDone,
  resetCart,
  updateApiDoneStatus,
  updateModalStatus,
  updateTakeawayCartStatus,
  resetApiCart,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  function convertToReadable(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return dateTime.toLocaleString(undefined, options);
  }

  const handleSendToDelivery = async () => {
    const payload = {
      CustomerName: name,
      PhoneNo: phone,
      Address: address,
      orderId: localStorage.getItem('orderId')?.toString(),
    };

    const resp = await api.patch('/sendToDelivery', payload, {
      withCredentials: true,
    });

    resetCart();
    resetApiCart();

    const printableData = `
      <html>
        <head>
          <style>
            body {margin: 0px;}
            .logo {width: 200px;}
            .header {display: flex; flex-direction: column; align-items: center;}
            h2 { font-size: 20px; font-weight: bold; margin-top: -10px; }
            h2 { font-size: 20px; font-weight: bold; }
            p { font-size: 16px; margin-top: 0px; margin-bottom: 0px; }
            .item-div {display: flex; justify-content: space-between;}
            .item-div p {min-width: 24px; max-width: 105px;text-align: left; font-size: 16px;}
            span {border-top-style: dotted; margin-top: 15px; display: block; display: flex; justify-content: end;}
            .bottom-text {display: flex; flex-direction: column; align-items: center; margin-top: 30px;}
            .main-data {
            display: flex;
            gap: 10px;
            text-align: left;
            }
            .left-side {
              margin-top: 0px;
              margin-bottom: 0px;
              min-width: 80px;
              text-align: right;
            }
            .right-side {
              margin-top: 0px;
              margin-bottom: 0px;
              min-width: 100px;
            }
            </style>
        </head>
        <body>
          <div class="header">
            <img src="/logo.png" class="logo"/>
          </div>
          <h2>Order Details</h2>
            <div class="main-data">
              <p class="left-side">Müşteri adı:</p>
              <p class="right-side">${resp.data.CustomerName}</p>
            </div>
            <div class="main-data">
              <p class="left-side">telefon numarası:</p>
              <p class="right-side">${resp.data.PhoneNo}</p>
            </div>
            <div class="main-data">
              <p class="left-side">adres:</p>
              <p class="right-side">${resp.data.Address}</p>
            </div>
            <div class="main-data">
              <p class="left-side">sipariş verildi:</p>
              <p class="right-side">${convertToReadable(
                resp.data.OrderItems[0].createdAt
              )}</p>
            </div>
          <h3>Items</h3>
          ${resp.data.OrderItems.flatMap((orderItem) =>
            orderItem.items.map(
              (item) =>
                `<div class="item-div"> <p>${item.Qty}</p><p style="margin-right:auto;">${item.Title}</p>  <p>${item.Price}</p></div>`
            )
          ).join('')}
            <span>Genel Toplam: ${resp.data.TotalPrice}</span>
            <div class="bottom-text">
              <p>^TEŞEKKÜRLER^</p>
              <p>* FİNANSAL DEĞERİ YOKTUR *</p>
            </div>
        </body>
      </html>
    `;

    const printOptions = {
      printable: printableData,
      type: 'raw-html',
      silent: true,
    };

    printJS(printOptions);

    updateApiDoneStatus(!apiDone);
    updateModalStatus(false);
    updateTakeawayCartStatus(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Send To Delivery</h1>
      </div>
      <h1 className="font-semibold text-sm">Enter Customer Info</h1>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          Full Name
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
          Phone Number
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="phone"
          type="number"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="Address">
          Address
        </label>
        <textarea
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Address"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button
        className={`w-[200px] items-center justify-center rounded-md bg-gray-900 px-2.5 py-2 text-base font-semibold leading-7 text-white`}
        onClick={() => {
          handleSendToDelivery();
        }}
      >
        Send to delivery
      </button>
    </div>
  );
};
