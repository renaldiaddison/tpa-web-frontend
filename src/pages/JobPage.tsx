import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/css-library.scss";
import "../styles/job.scss";
import { Jobs } from "../queries/JobQueries";
import { useQuery } from "@apollo/client";
import CreateJobModal from "../components/CreateJobModal";
import Job from "../components/Job";

const JobPage = () => {
  const {
    loading: loadingJobs,
    data: dataJobs,
    error: errorJobs,
    refetch: refetchJobs,
  } = useQuery(Jobs);
  const [modalJob, setModalJob] = useState(false);

  if (loadingJobs) <p>Loading</p>;
  if (errorJobs) <p>error</p>;

  return (
    <div className="white-bg full-screen center-col">
      <Navbar></Navbar>

      {modalJob && (
        <CreateJobModal
          closeModal={setModalJob}
          refetchJob={refetchJobs}
        ></CreateJobModal>
      )}

      <div className="job-container flex-c">
        <div className="">
          <button
            onClick={() => setModalJob(true)}
            className="add_button cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
          >
            Create new job
          </button>
        </div>
        <div className="sec-profile white-bg">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">Job List</p>
          </div>
          {dataJobs &&
            dataJobs.Jobs.map((job: any) => {
              return <Job key={job.id} job={job}></Job>;
            })}
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default JobPage;
