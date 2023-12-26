/* eslint-disable react/prop-types */

import WebsiteCard from "./WebsiteCard";

const WebsiteTable = (props) => {
  const data = props.data;

  return (
    <div>
      <div className="bg-white flex justify-center  pb-4   rounded-md w-full">
        {!data.length ? (
          <img
            className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 max-h-[80vh]"
            src="/assets/empty.svg"
            alt=""
          />
        ) : (
          ""
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2 justify-center xl:grid-cols-4   ">
          {data.map((i) => {
            return <WebsiteCard fetchWeb={props.fetchWeb} key={i._id} i={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default WebsiteTable;
