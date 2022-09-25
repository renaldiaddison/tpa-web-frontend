import React from "react";

const Job = ({ job }: any) => {
  return (
    <div className="card">
      <div className="flex relative w-full m-desc">
        <div className="w-full">
          <p className="text-black text-base">{job.title}</p>
          <p className="text-black text-sm">
            {job.companyName}, {job.employmentType}
          </p>
          <p className="text-black text-sm">
            {job.city}, {job.country}, {job.workplace}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Job;
