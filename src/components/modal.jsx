import React from "react";
import { useCtx } from "../context/Ctx";
import { XMarkIcon } from "@heroicons/react/24/solid";
export function Modal({}) {
  const {
    updateModalStatus,
    modalStatus: { jsx },
    updateItemValue,
    updateCategoryValue,
  } = useCtx();
  return (
    <>
      <div
        onClick={(event) => {
          if (event.target.classList.contains("modal-shadow")) {
            updateModalStatus(false, null);
            updateCategoryValue(null);
            updateItemValue(null);
          }
        }}
        className="modal-shadow flex justify-center bg-[rgba(0,0,0,0.5)] items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[2000] outline-none focus:outline-none"
      >
        <div className="relative my-6 p-4 mx-auto w-96 min-h-[20vh] bg-white rounded-md">
          <div className="w-fit float-right">
            <XMarkIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => {
                updateModalStatus(false, null);
                updateCategoryValue(null);
                updateItemValue(null);
              }}
            />
          </div>
          {jsx}
        </div>
      </div>
    </>
  );
}
