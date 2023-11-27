import React from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
const OAUthRedirect = () => {
  const { login } = useAuth();

  // Get user info from URL
  const [searchParams] = useSearchParams();
  const userInfo = {
    id: searchParams.get("id"),
    firstName: searchParams.get("firstName"),
    lastName: searchParams.get("lastName"),
    email: searchParams.get("email"),
    picture: searchParams.get("picture"),
  };
  if (userInfo.picture === "undefined") {
    userInfo.picture = undefined;
  }
  login(userInfo, searchParams.get("accessToken"));
  return (
    <div>
      <LoadingSpinner />
    </div>
  );
};

export default OAUthRedirect;
