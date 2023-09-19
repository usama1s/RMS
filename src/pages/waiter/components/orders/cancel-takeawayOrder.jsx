import api from '../../../../config/AxiosBase';
import { useCtx } from '../../../../context/Ctx';
import { useCartCtx } from '../../../../context/CartCtx';

const CancelTakeawayOrder = () => {
  const {
    updateCartStatus,
    apiItemsOfCart,
    resetApiCart,
    updateTakeawayCartStatus,
  } = useCartCtx();
  const { updateModalStatus, updateApiDoneStatus, apiDone } = useCtx();

  const cancelOrderHandler = async () => {
    await api.patch(`/cancelTakeawayOrder/${apiItemsOfCart[0].slug}`, {
      withCredentials: true,
    });

    resetApiCart();
    updateApiDoneStatus(!apiDone);
    updateCartStatus(false);
    updateTakeawayCartStatus(false);
    updateModalStatus(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold text-gray-900">Cancel Order</h1>
      <p>Are you sure you want to cancel this order.</p>
      <div className="flex gap-2">
        <button
          className="w-20 items-center justify-center rounded-md bg-green-500 hover:bg-green-600 px-2.5 py-2 text-base font-semibold leading-7 text-white"
          onClick={cancelOrderHandler}
        >
          Yes
        </button>
        <button
          className="w-20 items-center justify-center rounded-md bg-gray-900 hover:bg-gray-950 px-2.5 py-2 text-base font-semibold leading-7 text-white"
          onClick={() => {
            updateCartStatus(false);
            updateModalStatus(false);
            updateApiDoneStatus(!apiDone);
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default CancelTakeawayOrder;
