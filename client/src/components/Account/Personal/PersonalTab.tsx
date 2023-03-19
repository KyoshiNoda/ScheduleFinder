import { Dropdown } from "flowbite-react"
type Props = {}

function PersonalTab({ }: Props) {
  return (
    <form>
      <div className="grid grid-rows-3 grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            First name
          </label>
          <input
            type="text"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John"
            required
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Last name
          </label>
          <input
            type="text"
            id="last_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Doe"
            required
          />
        </div>

        <div>
          <label
            htmlFor="school"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            School
          </label>
          <input
            type="text"
            id="school"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="UCLA"
            required
          />
        </div>
        <div>
          <label
            htmlFor="Major"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Major
          </label>
          <input
            type="text"
            id="Major"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Computer Science"
            required
          />
        </div>
        <div>
          <Dropdown
            label="Gender"
            size="lg"
          >
            <Dropdown.Item>
              Male
            </Dropdown.Item>
            <Dropdown.Item>
              Female
            </Dropdown.Item>
            <Dropdown.Item>
              Binary
            </Dropdown.Item>
            <Dropdown.Item>
              Transgender
            </Dropdown.Item>
            <Dropdown.Item>
              Intersex
            </Dropdown.Item>
            <Dropdown.Item>
              I prefer not to say
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div>
          <label
            htmlFor="birthdate"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="birthdate"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
      </div>
    </form>
  )
}

export default PersonalTab