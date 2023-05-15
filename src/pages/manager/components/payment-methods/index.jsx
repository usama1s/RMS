import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { AddPaymentMethod } from "./add-categories";
import { PaymentMethodsListingsItems } from "./payment-methods-listings";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "../../../../config/@firebase";
import { formatCollectionData } from "../../../../utils/formatData";
import { Loading } from "../../../../components/loading";
const { categories } = COLLECTIONS;
export function PaymentMethods() {
  const { updateModalStatus, authenticatedUser } = useCtx();
  const [value, loading, error] = useCollection(
    query(
      collection(db, COLLECTIONS.paymentMethods),
      where("branchId", "==", authenticatedUser.branchId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const formattedData = formatCollectionData(value);
  if (error)
    return (
      <h1 className="text-xl font-semibold">
        Error fetching payment methods..
      </h1>
    );
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
        {formattedData?.length > 0 &&
          formattedData?.map((data) => (
            <PaymentMethodsListingsItems key={data.slug} {...data} />
          ))}
        {formattedData?.length === 0 && (
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
