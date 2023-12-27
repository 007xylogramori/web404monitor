import { useState } from "react";
import Loader from "./Loader";

/* eslint-disable react/prop-types */

const WebsiteCard = (props) => {
  const i = props.i;
  const [deletingWebsite, setDeletingWebsite] = useState("");
  const [updatingWebsite, setUpdatingWebsite] = useState("");
  
  const deleteWebsite = async (id) => {
    if (deletingWebsite) return;

    const rawToken = localStorage.getItem("tokens");
    const tokens = JSON.parse(rawToken);
    const accessToken = tokens.accessToken.token;

    setDeletingWebsite(id);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/website/delete?webId=${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: accessToken,
        },
      }
    ).catch((err) => void err);
    setDeletingWebsite("");

    if (!res) return;

    props.fetchWeb();
  };
  const ToggleMonitor = async (id,isMonitoring) => {
    if (updatingWebsite) return;

    const rawToken = localStorage.getItem("tokens");
    const tokens = JSON.parse(rawToken);
    const accessToken = tokens.accessToken.token;

    setUpdatingWebsite(id);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/website/update?webId=${id}&isMonitoring=${!isMonitoring?"true":"false"}`,
      {
        method: "PATCH",
        headers: {
          Authorization: accessToken,
        },
      }
    ).catch((err) => void err);
    setUpdatingWebsite("");

    if (!res) return;

    props.fetchWeb();
  };
  console.log(i);
  return (
    <div
      key={i._id}
      className=" hover:bg-gray-100 border-2 border-gray-200  rounded-lg pt-1.5  max-w-[100vh] "
    >
      <div className="px-4 break-all">{i.url.slice(0,100)+"..."}</div>
      {i.isMonitoring?"":<button className=" text-white font-medium text-xs bg-red-600 px-1.5 rounded-lg cursor-default ml-2  py-0.5">MONITORING OFF</button>}
      {i.isMonitoring?<div className="px-4 py-1 text-md ">
        STATUS :
        {i.isActive ? (
          <button className="text-white text-xs font-medium bg-green-600 px-3 cursor-default rounded-lg ml-2  py-0.5">
            {" "}
            ACTIVE
          </button>
        ) : (
          <button className=" text-white font-medium text-xs bg-red-600 px-1.5 rounded-lg cursor-default ml-2  py-0.5">
            {" "}
            INACTIVE
          </button>
        )}
      </div>:""}
      <div className="px-4 flex flex-row gap-3 relative pt-1 pb-4 ">
        {/* delete button */}

        <div
          onClick={() => {
            deleteWebsite(i._id);
          }}
        >
          {!(deletingWebsite === i._id) ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 border-2 py-2 h-10 hover:text-red-500 peer hover:border-red-500 transition-all duration-200 rounded-md"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>

              <div className="bg-black absolute -bottom-1  text-[12px]  hidden peer-hover:flex rounded-md px-1 text-white">
                Delete
              </div>
            </>
          ) : (
            <Loader text={"deleting"} />
          )}
        </div>

        
          {/* update monitor status button */}
        <div  
        onClick={() => {
            ToggleMonitor(i._id,i.isMonitoring);
          }}>

          {!(updatingWebsite===i._id)?<> <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="peer hover:text-red-500 hover:border-red-500 w-10 h-10 py-2  border-2 rounded-md"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>

          <div className="bg-black absolute -bottom-1  text-[12px]  hidden peer-hover:flex rounded-md px-2 text-white">
            {i.isMonitoring?"Stop":"Start"}
          </div></>:<Loader text={"Updating"} />}
         
        </div>
      </div>
    </div>
  );
};

export default WebsiteCard;
