/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Header = (props) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("tokens");
    navigate("/login");
  };

  const [inputUrl, setInputUrl] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const addWebsite = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setErrorMsg("Empty fields!");
      return;
    }

    setErrorMsg("");
    const rawToken = localStorage.getItem("tokens");
    const tokens = JSON.parse(rawToken);
    const accessToken = tokens.accessToken.token;
    setSubmitButtonDisabled(true);
    const res = await fetch(import.meta.env.VITE_API_URL + "/website/create", {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "content-type": "application/json",
      },
      body: await JSON.stringify({
        url: inputUrl,
      }),
    }).catch((err) => void err);

    setSubmitButtonDisabled(false);

    if (!res) {
      setErrorMsg("Error creating website");
      return;
    }
    const data = await res.json();
    
    if (!data.status) {
      setErrorMsg(data.message);
      return;
    }
    setInputUrl("");
    props.fetchWeb();
  };

  return (
    <>
      <div className=" bg-gray-200  rounded-lg mt-1 mb-2 text-white text-center py-2  px-2 border  font-semibold flex justify-between items-center">
        <div>
          <form onSubmit={addWebsite} id="">
            <div className=" flex gap-1 text-sm font-normal">
              <input
                onChange={(event) => {
                  setInputUrl(event.target.value);
                }}
                value={inputUrl}
                type="text"
                className="block w-full cursor-text  rounded-md border text-black py-1 px-3 text-sm outline-none "
                id="url"
                name="url"
                placeholder="Add new website"
                autoFocus=""
              />

              {!submitButtonDisabled ? (
                <button className=" font-bold text-center text-lg group bg-green-500 hover:bg-green-600 py-1 cursor-pointer px-2 rounded-md ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              ) : (
                <Loader/>
              )}
            </div>
          </form>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 border justify-center items-center gap-1 flex py-1.5  text-sm px-2 rounded-md font-normal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
          <span className="font-semibold hidden md:block">LOGOUT</span>
        </button>
      </div>

      {errorMsg ? (
        <div className="px-2 pb-1 text-red-600 text-sm">{errorMsg}</div>
      ) : (
        ""
      )}
    </>
  );
};

export default Header;
