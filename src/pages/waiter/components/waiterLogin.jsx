import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { validation_schema_form_b } from "../../../utils/validation_schema";
import { COLLECTIONS } from "../../../utils/firestore-collections";
import {
  where,
  getDocs,
  query,
  collection,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../../config/@firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";
import {
  useCtx,
  LOCAL_STORAGE_BASE,
  WAITER_SIDERBARLINKS_CHEF,
  WAITER_SIDERBARLINKS_NORMAL,
} from "../../../context/Ctx";
import { formatCollectionData } from "../../../utils/formatData";
import { useNavigate } from "react-router";
const { users } = COLLECTIONS;
export function WaiterLogin({ url, type }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: false, error: null });
  const { setAuthenticatedUser, setActiveWaiterTab, setWaiterSidebarLinks } =
    useCtx();
  //Forms Data
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validation_schema_form_b,
    onSubmit: onSubmit,
  });

  async function onSubmit(values, actions) {
    console.log(values);
    try {
      setStatus({ loading: true, error: null });

      const branchData = await getDocs(
        query(
          collection(db, COLLECTIONS.waiters),
          where("username", "==", values.email)
        )
      );
      const formattedData = formatCollectionData(branchData);
      console.log(formattedData);
      if (
        formattedData.length === 1 &&
        formattedData[0].password === values.password
      ) {
        setStatus({ loading: false, error: null });
        if (formattedData[0].subRole === "CHEF") {
          setActiveWaiterTab("Pending Orders");
          setWaiterSidebarLinks(WAITER_SIDERBARLINKS_CHEF);
        }
        if (formattedData[0].subRole === "NORMAL") {
          setActiveWaiterTab("Dine in");
          setWaiterSidebarLinks(WAITER_SIDERBARLINKS_NORMAL);
        }
        localStorage.setItem(
          `${LOCAL_STORAGE_BASE}Data`,
          JSON.stringify(formattedData[0])
        );
        setAuthenticatedUser(formattedData[0]);
        return;
      }
      if (
        formattedData.length === 1 &&
        formattedData[0].password !== values.password
      ) {
        setStatus({
          loading: false,
          error: "Password doesnot match",
        });
        return;
      }
      if (formattedData.length === 0) {
        setStatus({
          loading: false,
          error: "Username doesnot exist",
        });
        return;
      }

      //   navigate(url);
    } catch (e) {
      console.log(e?.message);
      setStatus({
        loading: false,
        error: e?.message ? e?.message : "Error authenticating the user.",
      });
    }
  }

  const reset = (actions) => {
    actions.resetForm({ branchName: "" });
  };
  const formJSX = (
    <div className="bg-gray-50 flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            {type} Login.
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900s"
              >
                Username
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Username"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="my-2">{formik.errors.email}</p>
              ) : (
                ""
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Password
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                type="password"
                placeholder="Password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="my-2">{formik.errors.password}</p>
              ) : (
                ""
              )}
            </div>
            {status.error && (
              <p className="bg-red-400 w-fit rounded-sm px-2 text-white">
                {status.error}
              </p>
            )}
            <div className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-gray-800 active:shadow-none shadow-lg bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 text-white">
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
              <button
                className="relative"
                type="submit"
                disabled={status.loading}
              >
                {status.loading ? "Authenticating" : "Authenticate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  return <div>{formJSX}</div>;
}
