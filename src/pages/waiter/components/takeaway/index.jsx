import React from "react";
import { WaiterOrder } from "../orders";
import { PendingTakeawayOrders } from "./PendingTakeawayOrders";
export function TakeAway() {
  return (
    <div>
      <PendingTakeawayOrders />
      <h1 className="text-xl font-bold">Take away</h1>
      <WaiterOrder />
    </div>
  );
}
