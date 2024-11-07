import { useState } from "react";


const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);


  return { authenticated, setAuthenticated };
};

export default useAuth;
