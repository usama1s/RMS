import { RiTakeawayFill } from 'react-icons/ri';
import { MdOutlineDinnerDining } from 'react-icons/md';

export default function DineinTakeawayTabs({ handleTabClick, selectedTab }) {
  const tabsItems = [
    {
      id: 1,
      icon: (
        <MdOutlineDinnerDining
          className={`w-4 h-4 mr-2  group-hover:text-gray-500 ${
            selectedTab == 1 ? 'text-teal-400' : 'text-gray-400'
          }`}
        />
      ),
      title: 'Dine in',
    },
    {
      id: 2,
      icon: (
        <RiTakeawayFill
          className={`w-4 h-4 mr-2  group-hover:text-gray-500 ${
            selectedTab == 2 ? 'text-teal-400' : 'text-gray-400'
          }`}
        />
      ),
      title: 'Takeaway',
    },
  ];

  return (
    <div className="border-b border-gray-200">
      <ul className="flex">
        {tabsItems.map((item) => (
          <li className="mr-2" key={item.id}>
            <div
              className={`cursor-pointer inline-flex items-center justify-center p-4 border-b-2 ${
                selectedTab === item.id
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-600 group'
              } rounded-t-lg`}
              onClick={() => handleTabClick(item.id)}
            >
              {item.icon}
              <p className="text-gray-900 font-semibold mb-0">{item.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
