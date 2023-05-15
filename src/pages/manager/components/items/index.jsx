import { formatCollectionData } from "../../../../utils/formatData";
import { db } from "../../../../config/@firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";

import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { ManagerAddItem } from "./add-items";
import { ManagerItemsListingItems } from "./manager-items-listings-items";
import { Loading } from "../../../../components/loading";
const { food_items } = COLLECTIONS;
export function ManagerItems() {
  const { updateModalStatus, authenticatedUser } = useCtx();
  const [value, loading, error] = useCollection(
    query(
      collection(db, food_items),
      where("branchId", "==", authenticatedUser.branchId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const formattedData = formatCollectionData(value);
  // console.table(formattedData);
  if (error)
    return (
      <h1 className="text-xl font-semibold">Error fetching menu items..</h1>
    );
  if (loading)
    return (
      <div className="h-[40vh]">
        <Loading />
      </div>
    );
  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <PlusIcon
          onClick={() => updateModalStatus(true, <ManagerAddItem />)}
          className="h-8 w-8 text-gray-900 cursor-pointer"
        />
      </div>
      <div className="text-2xl flex flex-col gap-2">
        {formattedData?.length > 0 &&
          formattedData?.map((data) => (
            <ManagerItemsListingItems key={data.slug} {...data} />
          ))}
        {formattedData?.length === 0 && (
          <div>
            <h1 className="text-2xl font-normal">
              No Menu items right now. Add menu items to proceed.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
