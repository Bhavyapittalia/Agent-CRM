import React from "react";

export const checkStatus = (status) => {
  switch (status) {
    case "Active":
      return <div className='bg-green-100 rounded-xl w-[50%] ml-9 '>Active</div>;

    case "Lapsed":
      return <div className='bg-red-100 rounded-xl w-[50%] ml-9'>Lapsed</div>;

    case "Matured":
      return <div className='bg-blue-100 rounded-xl w-[50%] ml-9'>Matured</div>;

    case "Claimed":
      return <div className='bg-orange-100 rounded-xl w-[50%] ml-9'>Claimed</div>;

    default:
      return <div className='bg-gray-100 rounded-xl w-[50%] ml-9'>Unknown</div>;
  }
};