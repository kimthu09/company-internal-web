"use client";

import React, { useEffect, useState } from "react";

const Notes = () => {
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    const existingDataString = localStorage.getItem("myData");
    if (existingDataString) {
      const existingData = JSON.parse(existingDataString);
      setData(existingData);
    }
  }, []);

  return (
    <div className="max-w-4xl px-5">
      <div>
          {data.map((item: any, idx: number) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-4 mb-4">
              <div
                className="ProseMirror whitespace-pre-line  px-6 py-4 rounded-lg"
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Notes;