import { Button } from 'flowbite-react';
const HobbiesTab = () => {
  const dummyTags: string[] = ['Soccer', 'Valorant', 'Gym', 'Cooking'];
  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="rounded-xl  p-4">
        <p className="text-center text-2xl dark:text-white">New Hobby</p>
        <div className="mb-4">
          <label htmlFor="default-input" className="block text-lg font-medium text-gray-900 dark:text-white">
            Name
          </label>
          <input
            type="text"
            id="default-input"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Soccer"
          />
        </div>
        <button
          type="button"
          className="w-full rounded bg-green-400 px-8 py-3 text-lg font-semibold text-white hover:bg-green-600 dark:bg-green-700 hover:dark:bg-green-800"
        >
          Add
        </button>
      </div>

      <div className="rounded-xl bg-blue-400 dark:bg-white">
        <div className="flex h-32 flex-wrap justify-center gap-2 rounded-xl p-4">
          {dummyTags.map((hobby) => (
            <Button color="blue" pill className="w-20">
              {hobby}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HobbiesTab;
