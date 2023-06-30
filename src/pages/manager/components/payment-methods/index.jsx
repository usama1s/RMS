import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { AddPaymentMethod } from "./add-categories";
import { PaymentMethodsListingsItems } from "./payment-methods-listings";
import { Loading } from "../../../../components/loading";
import api from "../../../../config/AxiosBase";

export function PaymentMethods() {
  const { updateModalStatus, apiDone } = useCtx();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState();

  const getPaymentMethods = async () => {
    try {
      setLoading(true);
      const resp = await api.get(
        `/getPaymentMethods/${localStorage.getItem("managerId")}`,
        {
          withCredentials: true,
        }
      );

      setFormattedData(resp.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentMethods();
  }, [apiDone]);

  if (loading)
    return (
      <div className="h-[40vh]">
        <Loading />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between py-4 ">
        <h1 className="font-bold text-2xl">Payment Methods</h1>
        <PlusIcon
          onClick={() => updateModalStatus(true, <AddPaymentMethod />)}
          className="h-8 w-8 font-bold text-gray-900"
        />
      </div>
      <div className="text-2xl">
        <PaymentMethodsListingsItems formattedD={formattedData} />
        {error && (
          <div>
            <h1 className="text-2xl font-normal">
              No Payment Methods right now. Add a payment method to proceed.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
