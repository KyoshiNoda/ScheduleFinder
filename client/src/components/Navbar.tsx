import { Button, Dropdown, Avatar } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="flex justify-between p-4 dark:bg-slate-800">
      <a href="#" className="flex items-center">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          ScheduleFinder
        </span>
      </a>
      {/* Render if user is not logged in */}
      {/* <div className="flex gap-3">
        <a href="#">
          <Button size={'sm'}>Log In</Button>
        </a>
        <a href="#">
          <Button size={'sm'}>Log In</Button>
        </a>
      </div> */}
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar
              alt="User avatar dropdown menu"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded={true}
              size={'md'}
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">John Doe</span>
            <span className="block truncate text-sm font-medium">
              jdoe@flowbite.com
            </span>
          </Dropdown.Header>
          <Link to={'/'}>
            <Dropdown.Item>Home</Dropdown.Item>
          </Link>
          <Dropdown.Item>My Schedule</Dropdown.Item>
          <Link to={'/account'}>
            <Dropdown.Item>Account Settings</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
