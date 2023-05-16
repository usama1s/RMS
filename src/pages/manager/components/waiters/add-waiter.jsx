import React, { useRef, useState, useEffect } from "react";
import { useCtx } from "../../../../context/Ctx";
import { useFormik } from "formik";
// import { db } from "../../../../config/@firebase";
// import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
// import { COLLECTIONS } from "../../../../utils/firestore-collections";
// import { formatCollectionData } from "../../../../utils/formatData";
import { validation_schema_manager_add_waiters } from "../../../../utils/validation_schema";
export function AddWaiters() {
  const [status, setStatus] = useState({ loading: false, error: null });
  const { updateModalStatus, authenticatedUser } = useCtx();

  //Form Data
  const formik = useFormik({
    initialValues: {
      waiterName: "",
      subRole: "LEAD",
      username: "",
      password: "",
    },
    validationSchema: validation_schema_manager_add_waiters,
    onSubmit: onSubmit,
  });
  // useEffect(() => {}, []);

  async function onSubmit(values, actions) {
    setStatus({ loading: true, error: null });
    try {
      let data = {
        name: waiterName,
        waiterRole: subRole,
        userName: userName,
        password: password,
        role: "WAITER",
      };

      await api.post("/waiter-register", data, {
        withCredentials: true,
      });

      updateModalStatus(false, null);
      setStatus({ loading: false, error: null });
    } catch (e) {
      console.log(e);
      setStatus({ loading: false, error: e?.message ? e?.message : null });
    }
  }

  const formJSX = (
    <div>
      <h1 className="font-bold text-2xl py-3">Add Waiters.</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Waiter Name
            </label>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Waiter Name"
                name="waiterName"
                onChange={formik.handleChange}
                value={formik.values.waiterName}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.waiterName && formik.errors.waiterName ? (
                <p className="my-2">{formik.errors.waiterName}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Waiter's Role
            </label>
            <div className="mt-1">
              <select
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Waiter's Role"
                name="subRole"
                onChange={formik.handleChange}
                value={formik.values.subRole}
                onBlur={formik.handleBlur}
              >
                <option value="LEAD">Head Waiter</option>
                <option value="ChEF">CHEF</option>
                <option value="NORMAL">Regular Waiter</option>
              </select>
              {formik.touched.subRole && formik.errors.subRole ? (
                <p className="my-2">{formik.errors.subRole}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Username
            </label>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Username"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.username && formik.errors.username ? (
                <p className="my-2">{formik.errors.username}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Password
            </label>
            <div className="mt-1">
              <input
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.password && formik.errors.password ? (
                <p className="my-2">{formik.errors.password}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          {status.error && <h2>{status.error}</h2>}
          <div>
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-gray-900/100 px-3.5 py-2.5  font-regular leading-7 text-white  text-xl"
            >
              {status.loading ? "Adding..." : "Add an item."}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
  return <div>{formJSX}</div>;
}
