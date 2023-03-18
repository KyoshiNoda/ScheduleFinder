import {useState,useRef} from 'react';

type Props = {
  getTab : (tab : string | null ) => void;
};

function Tab(props: Props): JSX.Element {
  const [tab,setTab] = useState<string | null>("")
  const tabHandler = (event : React.MouseEvent<HTMLDivElement>) =>{
    setTab(event.currentTarget.textContent);
    props.getTab(tab);
  }

  return (
    <div className="flex justify-center text-lg font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
      <li className="mr-10">
          <div
            className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500"
            aria-current="page"
            onClick={tabHandler}
          >
            Profile
          </div>
        </li>
        <li className="mr-10">
          <div
            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            onClick={tabHandler}
          >
            Password
          </div>
        </li>
        <li className="mr-10">
          <div
            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            onClick={tabHandler}
          >
            Personal
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Tab;
