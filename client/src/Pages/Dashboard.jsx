import { useEffect, useState } from "react";
import WebsiteTable from "../Components/WebsiteTable";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Loader from "../Components/Loader";

const Dashboard = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [websites, setWebsites] = useState([]);
  const [loadingWebsites, setLoadingWebsites] = useState(true);

  const navigate = useNavigate();
  const init = async () => {
    const rawTokens = localStorage.getItem("tokens");
    if (!rawTokens) {
      setPageLoaded(true);
      navigate("/login");
      return;
    }

    const tokens = JSON.parse(rawTokens);
    const accessToken = tokens.accessToken;
    const aExpiry = new Date(accessToken.expireAt);
    if (new Date() > aExpiry) {
      const res = await fetch(import.meta.env.VITE_API_URL + "/user/newtoken", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: await JSON.stringify({
          refreshToken: tokens?.refreshToken?.token,
        }),
      }).catch((err) => void err);

      if (!res) {
        setPageLoaded(true);
        localStorage.removeItem("tokens");
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (!data || !data.status) {
        setPageLoaded(true);
        localStorage.removeItem("tokens");
        navigate("/login");
        return;
      }

      const newTokens = data.data?.tokens;
      localStorage.setItem("tokens", JSON.stringify(newTokens));
      setPageLoaded(true);
    } else {
      setPageLoaded(true);
    }

    fetchAllWebsites();
  };

  const fetchAllWebsites = async () => {
    const rawToken = localStorage.getItem("tokens");
    const tokens = JSON.parse(rawToken);
    const accessToken = tokens.accessToken.token;

    const res = await fetch(import.meta.env.VITE_API_URL+ "/website", {
      headers: {
        Authorization: accessToken,
      },
    }).catch((err) => void err);
    setLoadingWebsites(false);
    if (!res) {
      return;
    }

    const data = await res.json();
    setWebsites(data.data);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="w-[100%] px-1 items-center ">
      {pageLoaded ? (
        <>
          <Header fetchWeb={fetchAllWebsites} />
          {loadingWebsites ? (
            <div className="flex items-center justify-center min-h-[80vh]">
              <Loader text={"Loading"} />
            </div>
          ) : (
            <WebsiteTable data={websites} fetchWeb={fetchAllWebsites} />
          )}
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader text={"Loading"} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
