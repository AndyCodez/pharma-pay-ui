import React, { useState, useEffect } from "react";

function Notification({ message, show, setShow }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timeout);
  });

  return (
    <>
      {show && (
        <div className="fixed bottom-0 right-0 m-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {message}
        </div>
      )}
    </>
  );
}

export default Notification;
