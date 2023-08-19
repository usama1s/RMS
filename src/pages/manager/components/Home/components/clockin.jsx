import { useCtx } from '../../../../../context/Ctx';

export function ClockIn({ clockIn, disabled, loading }) {
  const { updateModalStatus } = useCtx();

  return (
    <div className="flex flex-col">
      <span className=" font-semibold">Clock In Confirmation</span>
      <h2 className="mt-2 mb-4">
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
