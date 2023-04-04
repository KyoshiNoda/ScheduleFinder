import ColorsPalette from '../Utils/ColorsPalette';

type Props = {};

function TimeSlotInput({}: Props) {
  const colors: string[] = [
    'slate',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'blue',
    'violet',
    'purple',
    'fuchsia',
    'rose',
  ];
  return (
    <div className="mt-6 flex h-1/4 w-1/2 flex-col rounded-lg bg-slate-50 p-5 dark:bg-black sm:h-1/2">
      <ColorsPalette />
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="BIO130"
          required
        />
      </div>
      <div>
        <label
          htmlFor="days"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Days
        </label>
        <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
          <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
            <div className="flex items-center pl-3">
              <input
                id="vue-checkbox-list"
                type="checkbox"
                value=""
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
              />
              <label
                htmlFor="vue-checkbox-list"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Mon
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
            <div className="flex items-center pl-3">
              <input
                id="react-checkbox-list"
                type="checkbox"
                value=""
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
              />
              <label
                htmlFor="react-checkbox-list"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Tues
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
            <div className="flex items-center pl-3">
              <input
                id="angular-checkbox-list"
                type="checkbox"
                value=""
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
              />
              <label
                htmlFor="angular-checkbox-list"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Wed
              </label>
            </div>
          </li>
          <li className="w-full dark:border-gray-600">
            <div className="flex items-center pl-3">
              <input
                id="laravel-checkbox-list"
                type="checkbox"
                value=""
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
              />
              <label
                htmlFor="laravel-checkbox-list"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Thurs
              </label>
            </div>
          </li>
          <li className="w-full dark:border-gray-600">
            <div className="flex items-center pl-3">
              <input
                id="laravel-checkbox-list"
                type="checkbox"
                value=""
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
              />
              <label
                htmlFor="laravel-checkbox-list"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Fri
              </label>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex gap-12">
        <div className="w-1/2">
          <label
            htmlFor="startTime"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Start Time
          </label>
          <input
            type="text"
            id="title"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="10:30 AM"
            required
          />
        </div>
        <div className="w-1/2">
          <label
            htmlFor="endTime"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            End Time
          </label>
          <input
            type="text"
            id="title"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="12:30 PM"
            required
          />
        </div>
      </div>
      <div className="flex gap-12">
        <div className="w-1/2">
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Whitman Hall"
            required
          />
        </div>
        <div className="w-1/2">
          <label
            htmlFor="professor"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Professor
          </label>
          <input
            type="text"
            id="professor"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Dr. Gerstl"
            required
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-7 grid-rows-2 gap-2 p-2">
          {colors.map((item) => (
            <div
              key={item}
              className={`bg-${item}-400 h-10 w-10 cursor-pointer rounded-full p-1 text-white`}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="w-full rounded-full bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
      >
        Submit
      </button>
    </div>
  );
}

export default TimeSlotInput;
