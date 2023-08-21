import { useState } from 'react';
import { useCtx } from '../../../../context/Ctx';
import api from '../../../../config/AxiosBase';

export function EditManager({ branchId, branchNames, branchEmail, names }) {
  const { updateModalStatus, updateApiDoneStatus, apiDone } = useCtx();
  const [status, setStatus] = useState({ loading: false, error: null });
  const [branchName, setBranchName] = useState(branchNames);
  const [managerName, setManagerName] = useState(names);
  const [email, setEmail] = useState(branchEmail);
  const [password, setPassword] = useState('');

  async function onSubmit() {
    if (password || password === '') {
      setStatus({ loading: true, error: null });
      try {
        const payload = {
          branchName,
          email,
          name: managerName,
        };

        if (password !== '') {
          payload.password = password;
        }

        await api.patch(`/editBranch/${branchId}`, payload, {
          withCredentials: true,
        });

        setStatus({ error: null, loading: false });
        updateModalStatus(false, null);
        updateApiDoneStatus(!apiDone);
      } catch (e) {
        setStatus({
          loading: false,
          error: e?.response.data.message
            ? e?.response.data.message
            : 'Error updating the branch.',
        });
      }
    }
  }

  return (
    <>
      <h1 className="font-bold text-2xl py-3">Edit Branch</h1>
      <form>
        <div className="space-y-5">
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Branch Name
            </label>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Branch Name"
                name="branchName"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Manager's Name
            </label>
            <div className="mt-1">
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Manager's Name"
                name="ManagerName"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="" className="text-lg font-medium text-gray-900">
              Email
            </label>
            <div className="mt-1">
              <input
                className="flex  h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {status.error && <h2>{status.error}</h2>}
          <div className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-gray-800 active:shadow-none shadow-lg bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 text-white">
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-36 group-hover:h-20 opacity-10"></span>
            <button
              className="relative z-50"
              type="submit"
              disabled={status.loading}
              onClick={onSubmit}
            >
              {status.loading ? 'Editing...' : 'Edit Branch'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
