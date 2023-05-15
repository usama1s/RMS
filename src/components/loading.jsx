import React from "react";
import { PulseLoader } from "react-spinners";
export function Loading() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <PulseLoader color="black" />
    </div>
  );
}
