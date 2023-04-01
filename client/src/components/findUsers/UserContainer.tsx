import { useState, useEffect } from 'react';
import { Spinner, Button } from 'flowbite-react';
import User from './User';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  photoURL: string;
  email: string;
  password: string;
  gender: string;
  school: string;
  major: string;
};

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
  const [users, setUsers] = useState<User[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paginate, setPaginate] = useState<number>(12);

  const filterUsers = (users: User[]) => {
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

    const filteredByMajor = filteredByName.filter((user) =>
      user.major
        .toLowerCase()
        .replace(/[^a-zA-Z]+/g, '')
        .includes(majorSearch.toLowerCase().replace(/[^a-zA-Z]+/g, ''))
    );

    return filteredByMajor;
  };

  const loadMore = () => {
    setPaginate((prevState) => (prevState += 12));
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section>
      {isLoading && (
        <div className="text-center">
          <Spinner aria-label="Center-aligned spinner example" />
        </div>
      )}
      {filterUsers?.length === 0 && (
        <span className="block text-center text-3xl dark:text-white">
          No users found
        </span>
      )}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {users &&
          filterUsers(users)
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
      <Button onClick={loadMore} size="lg" className="mx-auto my-10 uppercase">
        load more
      </Button>
    </section>
  );
};

export default UserContainer;
