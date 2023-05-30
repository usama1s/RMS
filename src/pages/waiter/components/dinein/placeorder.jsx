import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useCartCtx } from "../../../../context/CartCtx";
import { useCtx } from "../../../../context/Ctx";
import { Loading } from "../../../../components/loading";
import api from "../../../../config/AxiosBase";

export function PlaceOrderDinein() {
  const formik = useFormik({
    initialValues: {
      name: "",
      tableNo: 0,
      lobby: "",
    },
    onSubmit: onSubmit,
  });
  const [formattedData, setFormattedData] = useState();
  // const [status, setStatus] = useState({ loading: false, error: null });
  const { itemsOfCart, resetCart } = useCartCtx();
  const { activeWaiterTab, paymentMethod } = useCtx();

  const getLobbies = async () => {
    const resp = await api.get("/getLobbies", {
      withCredentials: true,
    });
    if (resp.data.status !== "success") {
      setError(true);
    }
    setFormattedData(resp.data.data.doc);
  };

  useEffect(() => {
    getLobbies();
  }, []);

  async function onSubmit(values) {
    const payload = {
      Name: values.name,
      LobbyName: values.lobby,
      TableNo: values.tableNo,
      Qty: itemsOfCart[0].qty,
      PaymentMethod: paymentMethod,
      Price: itemsOfCart[0].price,
      Title: itemsOfCart[0].title,
    };

    if (activeWaiterTab === "Take away") {
      const resp = await api.post("/makeTakeAwayOrder", payload, {
        withCredentials: true,
      });
      console.log(resp);
    } else {
      const resp = await api.post("/makeDineInOrder", payload, {
        withCredentials: true,
      });
      console.log(resp);
    }

    resetCart();
  }

  const formJSX = (
    <div>
      <h1 className="font-bold text-3xl py-3">Place your order.</h1>
      <form onSubmit={formik.handleSubmit} className="mt-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-xl font-medium text-gray-900">
              Name
            </label>
            <div className="mt-2.5">
              <input
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-xl font-medium text-gray-900">
              Lobby
            </label>
            <div className="mt-2.5">
              <select
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Lobby"
                name="lobby"
                onChange={formik.handleChange}
                value={formik.values.lobby}
              >
                {formattedData?.length > 0 &&
                  formattedData?.map((item, index) => (
                    <option key={index + 1}>{item.lobbyName}</option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="" className="text-xl font-medium text-gray-900">
                Table Number
              </label>
            </div>
            <div className="mt-2.5">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 "
                type="number"
                placeholder="Table Number"
                name="tableNo"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
            </div>
          </div>
          <div>
            <button
              className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5  font-regular leading-7 text-white  text-xl"
              type="submit"
            >
              {/* {status.loading ? "Wait..." : "Place an order"} */}
              Place an order
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  // if (lobbyLoading)
  //   return (
  //     <div>
  //       <Loading />
  //     </div>
  //   );
  // if (lobbyError) return <h1>Error</h1>;
  return formJSX;
}
