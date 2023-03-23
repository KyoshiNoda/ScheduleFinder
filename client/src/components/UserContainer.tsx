import { useState, useEffect } from 'react';
import { Spinner } from 'flowbite-react';
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
};

const UserContainer = () => {
  const [users, setUsers] = useState<User[]>();
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {users &&
          users.map((user) => (
            <User
              key={user._id}
              photoURL={user.photoURL}
              firstName={user.firstName}
              lastName={user.lastName}
            />
          ))}
      </div>
    </section>
  );
};

export default UserContainer;
