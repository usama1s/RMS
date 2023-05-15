import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import { useCtx } from "../../../../context/Ctx";
import { ManagerAddLobbies } from "./add-lobbies";
import { ManagerLobbiesListingsItems } from "./manager-lobbies-listings-items";
import { COLLECTIONS } from "../../../../utils/firestore-collections";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "../../../../config/@firebase";
import { formatCollectionData } from "../../../../utils/formatData";
import { Loading } from "../../../../components/loading";
const { lobbies } = COLLECTIONS;

export function Lobbies() {
  const { updateModalStatus, authenticatedUser } = useCtx();
  const [value, loading, error] = useCollection(
    query(
      collection(db, lobbies),
      where("branchId", "==", authenticatedUser.branchId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const formattedData = formatCollectionData(value);

  if (error)
    return (
      <h1 className="text-xl font-semibold">Error fetching categories..</h1>
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
        <h1 className="text-2xl font-bold">Lobbies</h1>
        <PlusIcon
          className="h-8 w-8 text-gray-900 cursor-pointer"
          onClick={() => updateModalStatus(true, <ManagerAddLobbies />)}
        />
      </div>
      <div className="text-2xl">
        {formattedData?.length > 0 &&
          formattedData?.map((data) => (
            <ManagerLobbiesListingsItems key={data.slug} {...data} />
          ))}
        {formattedData?.length === 0 && (
          <div>
            <h1 className="text-2xl font-normal ">
              No Lobbies right now. Add Lobbies to proceed.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
