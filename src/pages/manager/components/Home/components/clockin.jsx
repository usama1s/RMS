import { useCtx } from "../../../../../context/Ctx";
export function ClockIn({ clockIn, disabled, loading }) {
  const { updateModalStatus } = useCtx();
  return (
    <div className="flex flex-col">
      <span className=" font-semibold">Clock In Confirmation</span>
      <h2 className="my-2">
        Are you sure you want to clock in? Please note that once you clock in,
        Waiters work session will be be started.
      </h2>
      {loading ? (
        <h2>Clockign In</h2>
      ) : (
        <div>
          <button
            onClick={() => {
              clockIn();
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
