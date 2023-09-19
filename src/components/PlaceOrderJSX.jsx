import { useEffect, useState } from 'react';
import api from '../config/AxiosBase';
import printJS from 'print-js';

export const PlaceOrderJSX = ({
  apiDone,
  TotalPriceOfCart,
  orderData,
  resetCart,
  updateApiDoneStatus,
  updateModalStatus,
  updateTakeawayCartStatus,
  resetApiCart,
}) => {
  const [resp, setResp] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(TotalPriceOfCart);
  const LobbyName = localStorage.getItem('seletedLobby');
  const TableNo = localStorage.getItem('seletedTable');

  const getPaymentMethods = async () => {
    setLoading(true);
    const resp = await api.get(
      `/getPaymentMethods/${localStorage.getItem('managerId')}`,
      { withCredentials: true }
    );
    if (resp.data.status !== 'success') {
      setError(true);
    }

    setSelectedItem(resp.data.data[0].title);
    setResp(resp.data.data);
    setLoading(false);
  };

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
  };

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

  const placeOrder = async () => {
    const payload = {
      LobbyName: orderData.lobby || localStorage.getItem('seletedLobby'),
      LobbyId: localStorage.getItem('selectedLobbyId')?.toString(),
      TableNo: orderData.table || localStorage.getItem('seletedTable') * 1,
      PaymentMethod: selectedItem,
      Price: selectedAmount,
      orderId: localStorage.getItem('orderId')?.toString(),
    };

    const resp = await api.patch('/makeDineInOrder', payload, {
      withCredentials: true,
    });

    localStorage.removeItem('seletedTable');
    localStorage.removeItem('seletedLobby');
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
              <p class="left-side">Bölüm:</p>
              <p class="right-side">${resp.data.LobbyName}</p>
            </div>
            <div class="main-data">
              <p class="left-side">Masa:</p>
              <p class="right-side">${resp.data.TableNo}</p>
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

  useEffect(() => {
    getPaymentMethods();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Receive Payment</h1>
        <p>
          {LobbyName} - {TableNo}
        </p>
        <span />
      </div>
      <div>
        <label className="mr-4 font-semibold">Total Bill</label>
        <input
          className="border px-2 py-1 rounded-md"
          type="number"
          value={selectedAmount}
          onChange={(e) => setSelectedAmount(e.target.value)}
        />
      </div>
      <div>
        <label className="mr-4 font-semibold">Choose a payment method:</label>
        <select
          value={selectedItem}
          onChange={handleSelectChange}
          className="border px-2 py-1 rounded-md"
        >
          {resp
            ?.sort((a, b) => {
              if (a.title === 'Cash') {
                return -1;
              } else if (b.title === 'Cash') {
                return 1;
              } else {
                return a.title.localeCompare(b.title);
              }
            })
            .map((item) => (
              <option key={item._id} value={item.title}>
                {item.title}
              </option>
            ))}
        </select>
      </div>
      <button
        className={`w-[200px] items-center justify-center rounded-md bg-black px-2.5 py-2 text-base font-semibold leading-7 text-white`}
        onClick={() => {
          placeOrder();
        }}
      >
        Receive Payment
      </button>
    </div>
  );
};
