import { useCtx } from '../../../../../context/Ctx';

export function ClockOut({ clockOut, disabled, loading }) {
  const { updateModalStatus } = useCtx();

  return (
    <div className="flex flex-col">
      <span className=" font-semibold">Clock Out Confirmation: </span>
      <h2 className="mt-2 mb-4">
        Are you sure you want to clock out? Please note that once you clock out,
        Waiters work session will be ended, and you won't be able to perform any
        further tasks.
      </h2>
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
            className="bg-green-900 hover:bg-green-950 text-base font-semibold text-white rounded-md py-2 px-4 mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => updateModalStatus(false, null)}
            className="bg-gray-900 hover:bg-gray-950 text-base font-semibold text-white rounded-md py-2 px-4 mr-2"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}
