import React, { useState, useEffect } from 'react';
import { useCtx } from '../../../../context/Ctx';
import api from '../../../../config/AxiosBase';
import Select from 'react-select';
import { BsCheckLg } from 'react-icons/bs';

export function ManagerEditWaiter({
  waiterId,
  wr_userName,
  wr_name,
  wr_role,
  wr_lobbyAssigned,
  wr_serviceTypes,
}) {
  const id = localStorage.getItem('managerId');
  const [status, setStatus] = useState({ loading: false, error: null });
  const { updateApiDoneStatus, updateModalStatus, apiDone } = useCtx();
  const [name, setName] = useState(wr_name);
  const [waiterRole, setWaiterRole] = useState(wr_role);
  const [userName, setUserName] = useState(wr_userName);
  const [password, setPassword] = useState('');
  const [lobbiesData, setLobbiesData] = useState();
  const [lobbyAssigned, setLobbyAssigned] = useState(wr_lobbyAssigned);
  const initialDineInChecked = wr_serviceTypes.includes('Dine-In')
    ? true
    : false;
  const [isDineInChecked, setIsDineInChecked] = useState(initialDineInChecked);
  const initialTakeawayChecked = wr_serviceTypes.includes('Takeaway')
    ? true
    : false;
  const [isTakeawayChecked, setIsTakeawayChecked] = useState(
    initialTakeawayChecked
  );

  const handleDineInChange = () => {
    setIsDineInChecked(!isDineInChecked);
  };

  const handleTakeawayChange = () => {
    setIsTakeawayChecked(!isTakeawayChecked);
  };

  const getLobbies = async () => {
    try {
      const resp = await api.get(`/getLobbies/${id}`, {
        withCredentials: true,
      });

      setLobbiesData(resp.data.data);
    } catch (err) {
      console.log(err);
      setLobbiesData();
    }
  };

  useEffect(() => {
    getLobbies();
  }, [apiDone]);

  async function onSubmit() {
    if (password || password === '') {
      setStatus({ loading: true, error: null });

      const serviceTypes = (isDineInChecked ? ['Dine-In'] : []).concat(
        isTakeawayChecked ? ['Takeaway'] : []
      );

      try {
        const payload = {
          name,
          waiterRole,
          userName,
          lobbyAssigned,
          serviceTypes,
        };

        if (password !== '') {
          payload.password = password;
        }

        await api.patch(`/editWaiters/${waiterId}`, payload, {
          withCredentials: true,
        });

        setStatus({ error: null, loading: false });
        updateModalStatus(false, null);
        updateApiDoneStatus(!apiDone);
      } catch (e) {
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: `Error updating the waiter.`,
        }));
      }
    }
  }

  const options = lobbiesData?.map((item) => ({
    value: item._id,
    name: item.lobbyName,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold">Update Waiter</h1>
      <form className="mt-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Waiter Name
            </label>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Waiter Name"
                name="waiterName"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Waiter's Role
            </label>
            <div className="mt-1">
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Waiter's Role"
                name="subRole"
                onChange={(e) => setWaiterRole(e.target.value)}
                value={waiterRole}
              >
                <option value="" disabled defaultValue="Head Waiter">
                  Select a category
                </option>
                <option value="Head Waiter">Head Waiter</option>
                <option value="Chef">CHEF</option>
                <option value="Regular Waiter">Regular Waiter</option>
              </select>
            </div>
          </div>
          {waiterRole === 'Regular Waiter' && (
            <div className="flex gap-4">
              <label className="flex cursor-pointer select-none items-center text-sm font-semibold text-gray-800">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isDineInChecked}
                    onChange={handleDineInChange}
                  />
                  <div className="box mr-1 flex h-5 w-5 items-center justify-center rounded border border-gray-800">
                    <span
                      className={`opacity-${isDineInChecked ? '100' : '0'}`}
                    >
                      <BsCheckLg
                        className="w-4 h-4 text-green-600"
                        style={{ strokeWidth: '2' }}
                      />
                    </span>
                  </div>
                </div>
                Dine In
              </label>
              <label className="flex cursor-pointer select-none items-center text-sm font-semibold text-gray-800">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isTakeawayChecked}
                    onChange={handleTakeawayChange}
                  />
                  <div className="box mr-1 flex h-5 w-5 items-center justify-center rounded border border-gray-800">
                    <span
                      className={`opacity-${isTakeawayChecked ? '100' : '0'}`}
                    >
                      <BsCheckLg
                        className="w-4 h-4 text-green-600"
                        style={{ strokeWidth: '2' }}
                      />
                    </span>
                  </div>
                </div>
                Takeaway
              </label>
            </div>
          )}
          {waiterRole === 'Regular Waiter' && isDineInChecked && (
            <div>
              <label
                htmlFor="lobbyAssigned"
                className="text-lg font-medium text-gray-900"
              >
                Assign Lobby
              </label>
              <div className="mt-1">
                <div className="flex flex-wrap">
                  <Select
                    className="w-full active:shadow-none"
                    closeMenuOnSelect={false}
                    isMulti
                    options={options}
                    value={lobbyAssigned}
                    onChange={(e) => {
                      setLobbyAssigned(e);
                    }}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.value}
                  />
                </div>
              </div>
            </div>
          )}
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Username
            </label>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Username"
                name="username"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
              />
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Password
            </label>
            <div className="mt-1">
              <input
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>
          {status.error && <p className="text-red-500">{status.error}</p>}
          <button
            type="submit"
            disabled={status.loading}
            className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 text-base font-semibold leading-7 text-white"
            onClick={() => {
              onSubmit();
            }}
          >
            {status.loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}
