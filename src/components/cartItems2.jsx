import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid';
import { useCartCtx } from '../context/CartCtx';
import { useCtx } from '../context/Ctx';
import { BsFillTrashFill } from 'react-icons/bs';

export function CartItems2({ title, slug, price, qty }) {
  const { onItemDelete, onCartItemAdd, onCartItemRemove, onApiItemDelete } =
    useCartCtx();
  const { updateModalStatus } = useCtx();

  return (
    <div className="flex flex-col text-red-500 my-2">
      <div className="flex justify-between items-center w-full p-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate break-words pb-1 text-md font-bold">
            {title}
          </h2>
          <p className="truncate break-words text-base">
            {price} x {qty} ={price * qty}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex space-x-2  py-2">
            <MinusCircleIcon
              onClick={() => onCartItemRemove({ slug })}
              className="h-6 w-6 cursor-pointer text-gray-900"
            />
            <span className="text-sm font-normal">{qty}</span>
            <PlusCircleIcon
              onClick={() => onCartItemAdd({ slug })}
              className="h-6 w-6 cursor-pointer text-gray-900"
            />
          </div>
          <BsFillTrashFill
            className="text-xl text-gray-900"
            onClick={() =>
              updateModalStatus(
                true,
                <DeleteCartItemJSX
                  slug={slug}
                  onItemDelete={onItemDelete}
                  updateModalStatus={updateModalStatus}
                  onApiItemDelete={onApiItemDelete}
                />
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

function DeleteCartItemJSX({
  updateModalStatus,
  onItemDelete,
  onApiItemDelete,
  slug,
}) {
  return (
    <div>
      <h2 className="text-2xl text-center font-bold py-4">
        Confirm to delete...
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onItemDelete(slug);
            onApiItemDelete(slug);
            updateModalStatus(false, null);
          }}
          className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
        >
          Yes
        </button>
        <button
          onClick={() => {
            updateModalStatus(false, null);
          }}
          className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
        >
          No
        </button>
      </div>
    </div>
  );
}
