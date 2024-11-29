import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const UserDetails = (props) => {
  console.log("UserDetails");

  const { user } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {

      const theData = {
        fullName: user.fullName,
        emailAddress: user.emailAddresses[0]?.emailAddress,
        id: user.id,
        imageUrl: user.imageUrl,
      };

      console.log("Setting user data:", theData);
      setUserData(theData);
      props.onData(theData);
    } else {
      console.log("No user available");
    }
  }, [user, props]);

  // Optional: Render a loading state or user info
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>User Details</h3>
      <p>
        <strong>Full Name:</strong> {userData.fullName}
      </p>
      <p>
        <strong>Email:</strong> {userData.emailAddress}
      </p>
      <p>
        <strong>User ID:</strong> {userData.id}
      </p>
      <p>
        <strong>Profile Image:</strong>
      </p>
      <img src={userData.imageUrl} alt="User Avatar" width={100} />
    </div>
  );
};

export default UserDetails;
