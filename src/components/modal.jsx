import React from 'react';
import { useCtx } from '../context/Ctx';
import { XMarkIcon } from '@heroicons/react/24/solid';

export function Modal({}) {
  const {
    updateModalStatus,
    modalStatus: { jsx },
    updateItemValue,
    updateCategoryValue,
  } = useCtx();
  return (
    <div
      onClick={(event) => {
        if (event.target.classList.contains('modal-shadow')) {
          updateModalStatus(false, null);
          updateCategoryValue(null);
          updateItemValue(null);
        }
      }}
      className="z-10 modal-shadow flex justify-center bg-[rgba(0,0,0,0.5)] items-center overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none"
    >
      <div className="relative my-6 p-4 mx-5 md:mx-auto w-[550px] h-auto bg-white rounded-md">
        <div className="w-fit float-right">
          <XMarkIcon
            className="h-6 w-6 cursor-pointer hover:scale-105 duration-200 ease-in"
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
  );
}
