import User from './User';
import LoadingUser from './LoadingUser';
import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { User as UserType } from '../../types';
import { useGetScheduleQuery } from '../../redux/services/auth/authService';

type UserContainerProps = {
  schoolSearch: string;
  nameSearch: string;
  majorSearch: string;
};

const UserContainer = ({
  schoolSearch,
  nameSearch,
  majorSearch,
}: UserContainerProps) => {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  // This is used to get the ID of the user that is currently logged in and filter it out
  // of the array of users that are displayed in the FindUser page because it doesn't make
  // sense that the user sees themselves when they are trying to find a user.
  let loggedUserId: string = '';
  if (!isFetching) loggedUserId = data[0].user_id;

  const [users, setUsers] = useState<UserType[]>([]);
  const [paginate, setPaginate] = useState<number>(9);

  const filterUsers = (users: UserType[]) => {
    const filteredBySchool = users.filter((user) =>
      user.school
        .toLowerCase()
        .replace(/[^a-zA-Z]+/g, '')
        .includes(schoolSearch.toLowerCase().replace(/[^a-zA-Z]+/g, ''))
    );

    const filteredByName = filteredBySchool.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .replace(/[^a-zA-Z]+/g, '')
        .includes(nameSearch.toLowerCase().replace(/[^a-zA-Z]+/g, ''))
    );

    const filteredByMajor = filteredByName.filter((user) => {
      if (!user.major) return user;
      return user.major
        .toLowerCase()
        .replace(/[^a-zA-Z]+/g, '')
        .includes(majorSearch.toLowerCase().replace(/[^a-zA-Z]+/g, ''));
    });
    return filteredByMajor;
  };

  const loadMore = () => {
    setPaginate((prevState) => (prevState += 9));
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const loadingUsers = [0, 0, 0, 0, 0, 0];

  return (
    <section>
      {isFetching && filterUsers?.length === 0 && (
        <span className="block text-center text-3xl dark:text-white">
          No users found
        </span>
      )}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {isFetching && loadingUsers.map((user) => (
          <LoadingUser />
        ))}
        {users &&
          filterUsers(users)
            .filter((user) => user._id !== loggedUserId)
            .slice(0, paginate)
            .map((user) => (
              <User
                key={user._id}
                id={user._id}
                photoURL={user.photoURL}
                firstName={user.firstName}
                lastName={user.lastName}
                school={user.school}
                major={user.major}
              />
            ))}
      </div>
      {/* This condition checks that the "load more" butotn will only be displayed if there 
      are any users left to be rendered. */}
      {paginate < users.length && paginate < filterUsers(users).length && (
        <Button
          onClick={loadMore}
          size="lg"
          className="mx-auto my-10 uppercase"
        >
          load more
        </Button>
      )}
    </section>
  );
};

export default UserContainer;
