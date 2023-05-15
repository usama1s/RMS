import { useCtx } from "../../../../../context/Ctx";
export function ClockOut({ clockOut, disabled, loading }) {
  const { updateModalStatus } = useCtx();
  return (
    <div>
      <h2>Confirm to clock out</h2>
      {loading ? (
        <h2>Clocking Out..</h2>
      ) : (
        <div>
          <button
            onClick={() => {
              clockOut();
              updateModalStatus(false, null);
            }}
            disabled={disabled}
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => updateModalStatus(false, null)}
            className="bg-black text-base font-semibold text-white rounded-md py-2 px-4  mr-2"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}
