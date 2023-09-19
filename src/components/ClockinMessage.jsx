import { BsInfoCircleFill } from 'react-icons/bs';

const ClockinMessage = () => {
  return (
    <div className="rounded p-2 bg-yellow-500 mt-2 shadow-md">
      <p className="m-2 text-black text-base leading-7">
        Please <span className="font-semibold">Clock In</span> to start today’s
        session.
        <span className="flex items-center gap-2">
          <BsInfoCircleFill />
          Make sure you start the session only once in a day to avoid confusions
          later on in the stats and sales management.
        </span>
        <span className="flex  items-center gap-2 flex-wrap">
          <BsInfoCircleFill />
          <span className="font-semibold">Clock In</span> once you are going to
          start the sales in the morning and{' '}
          <span className="font-semibold">Clock Out</span> after you end your
          work day in the night.
        </span>
      </p>
    </div>
  );
};

export default ClockinMessage;
