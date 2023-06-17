import React, { useState } from "react";
import { useFormik } from "formik";
import { validation_schema_expenses } from "../../../../utils/validation_schema";
import { useCtx } from "../../../../context/Ctx";
import api from "../../../../config/AxiosBase";

export const AddExpense = () => {
  const { updateModalStatus, updateApiDoneStatus, apiDone } = useCtx();
  const [status, setStatus] = useState({ loading: false, error: null });

  const formik = useFormik({
    initialValues: {
      title: "",
      amount: 0,
    },
    validationSchema: validation_schema_expenses,
    onSubmit: onSubmit,
  });

  async function onSubmit(values, actions) {
    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await api.post(
        "/addExpense",
        {
          title: values.title,
          amount: values.amount,
        },
        {
          withCredentials: true,
        }
      );

      updateApiDoneStatus(!apiDone);
      updateModalStatus(false, null);
    } catch (e) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: `Error adding the item.`,
      }));
    } finally {
      reset(actions);
    }
  }

  const reset = (actions) => {
    actions.resetForm({ title: "" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Add an Expense</h1>
      <form className="mt-2 " onSubmit={formik.handleSubmit}>
        <div className="space-y-5">
          <div>
            <label className="text-lg font-medium text-gray-900">
              Enter Expense Title.
            </label>
            <div className="mt-1">
              <input
                className="flex w-full h-10 mb-2 rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Title"
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title ? (
                <p className="my-2 text-red-500">{formik.errors.title}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          {status.error && <p className="text-red-500">{status.error}</p>}
          <div>
            <label className="text-lg font-medium text-gray-900">
              Enter Expense Amount.
            </label>
            <div className="mt-1">
              <input
                className="flex w-full h-10 mb-2 rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="amount"
                name="amount"
                onChange={formik.handleChange}
                value={formik.values.amount}
                onBlur={formik.handleBlur}
              />
              {formik.touched.amount && formik.errors.amount ? (
                <p className="my-2 text-red-500">{formik.errors.amount}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          {status.error && <p className="text-red-500">{status.error}</p>}
          <div>
            <button
              type="submit"
              disabled={status.loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-gray-900/100 px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
            >
              {status.loading ? "Adding..." : "Add an expense."}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
