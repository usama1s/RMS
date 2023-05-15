import { PlusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { AddWaiters } from "./add-waiter";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../../../config/@firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Loading } from "../../../../components/loading";
import { formatCollectionData } from "../../../../utils/formatData";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
export function ManagersWaiterSection() {
  const { updateModalStatus, authenticatedUser } = useCtx();
  const [value, loading, error] = useCollection(
    query(
      collection(db, COLLECTIONS.waiters),
      where("branchId", "==", authenticatedUser.branchId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const formattedData = formatCollectionData(value);
  console.log(formattedData);
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
        <h1 className="text-2xl font-bold">Waiter</h1>
        <PlusIcon
          className="h-8 w-8 text-gray-900 cursor-pointer"
          onClick={() => updateModalStatus(true, <AddWaiters />)}
        />
      </div>
      <div className="w-full flex flex-col gap-5">
        {" "}
        {formattedData?.length <= 0 && (
          <h1 className="font-bold text-xl">
            No Waiters right now. Add waiters to proceed.
          </h1>
        )}
        {formattedData?.length > 0 &&
          formattedData.map((data) => (
            <div
              key={data.slug}
              className="flex bg-[#FBFBFB] shadow-md rounded-md relative p-4 w-full"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">
                    Username:{" "}
                    <span className="font-semibold">{data.username}</span>
                  </h2>
                  <p className="text-sm font-normal">
                    <span className="font-bold">Name:</span> {data.waiterName}
                  </p>
                  <p className="text-sm font-normal">
                    <span className="font-bold">Role:</span> {data.subRole}
                  </p>
                </div>
                <div className="flex mr-1">
                  <TrashIcon
                    // onClick={() =>
                    //   updateModalStatus(
                    //     true,
                    //     <DeleteItemJSX
                    //       updateModalStatus={updateModalStatus}
                    //       slug={data.slug}
                    //     />
                    //   )
                    // }
                    className="h-6 w-6 mr-4 text-gray-900 cursor-pointer hover:scale-110 duration-200"
                  />
                  <PencilIcon
                    onClick={() => {}}
                    className="h-6 w-6 mr-2 text-gray-900 cursor-pointer hover:scale-110 duration-200"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
