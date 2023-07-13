import React, { useState } from "react";
import { useFormik } from "formik";
import { validation_schema_admin_add_managers } from "../../../../utils/validation_schema";
import { useCtx } from "../../../../context/Ctx";
import api from "../../../../config/AxiosBase";

export function AdminAddManagers() {
  const [status, setStatus] = useState({ loading: false, error: null });
  const { updateModalStatus, updateApiDoneStatus, apiDone } = useCtx();

  const formik = useFormik({
    initialValues: {
      branchName: "",
      managerName: "",
      email: "",
      password: "",
    },
    validationSchema: validation_schema_admin_add_managers,
    onSubmit: onSubmit,
  });

  async function onSubmit(values, actions) {
    setStatus({ loading: true, error: null });
    try {
      let data = {
        branchName: values.branchName,
        name: values.managerName,
        email: values.email,
        password: values.password,
        role: "MANAGER",
      };

      await api.post("/branch-register", data, {
        withCredentials: true,
      });
      setStatus({ error: null, loading: false });
      updateModalStatus(false, null);
      updateApiDoneStatus(!apiDone);
    } catch (e) {
      console.log(e);
      setStatus({
        loading: false,
        error: e ? e?.response.data.error : "Error creating the user.",
      });
    }
  }

  const reset = (actions) => {
    actions.resetForm({ branchName: "" });
  };
  const formJSX = (
    <div>
      <h1 className="font-bold text-2xl py-3">Add Branches</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Branch Name
            </label>
            <div className="mt-1">
              <input
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Branch Name"
                name="branchName"
                onChange={formik.handleChange}
                value={formik.values.title}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.branchName && formik.errors.branchName ? (
                <p className="my-2 text-red-500">{formik.errors.branchName}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Manager's Name
            </label>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Manager Name"
                name="managerName"
                onChange={formik.handleChange}
                value={formik.values.managerName}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.managerName && formik.errors.managerName ? (
                <p className="my-2 text-red-500">{formik.errors.managerName}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Email
            </label>
            <div className="mt-1">
              <input
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.email && formik.errors.email ? (
                <p className="my-2 text-red-500">{formik.errors.email}</p>
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
                <p className="my-2 text-red-500">{formik.errors.password}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          {status.error && <h2>{status.error}</h2>}
          <div className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-gray-800 active:shadow-none shadow-lg bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 text-white">
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-36 group-hover:h-20 opacity-10"></span>
            <button
              className="relative"
              type="submit"
              disabled={status.loading}
            >
              {status.loading ? "Adding..." : "Add Branch"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
  return <div>{formJSX}</div>;
}
