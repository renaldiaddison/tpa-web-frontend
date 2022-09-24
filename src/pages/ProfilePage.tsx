import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState, useContext } from "react";
import { storage } from "../config/firebase-config";
import { useMutation, useQuery } from "@apollo/client";
import {
  GetUserById,
  UpdateBackgroundPicture,
  UpdateProfilePicture,
  UserSuggestion,
  VisitUser,
} from "../queries/UserQueries";
import { UserContext, useUserContext } from "../lib/UserContext";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toastError } from "../script/Toast";
import { CreateEducation, GetUserEducation } from "../queries/EducationQueries";
import { GetUserExperience } from "../queries/ExperienceQueries";
import CreateEducationModal from "../components/CreateEducationModal";
import "../styles/profile.scss";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import CreateExperienceModal from "../components/CreateExperienceModal";
import Education from "../components/Education";
import Experience from "../components/Experience";
import UserInformation from "../components/UserInformation";
import UserSuggestionProfile from "../components/UserSuggestionProfile";

const ProfilePage = () => {
  const p = useParams();

  const [edit, setEdit] = useState(false);
  const [eduModal, setEduModal] = useState(false);
  const [expModal, setExpModal] = useState(false);
  const UserContext = useUserContext();
  let alreadyBlocked: boolean = false;

  const {
    loading,
    error,
    data,
    called,
    refetch: refetchCurrentUser,
  } = useQuery(GetUserById, { variables: { id: p.id }, errorPolicy: "all" });

  const [
    VisitUserMutation,
    { loading: loadingVisit, error: errorVisit, data: dataVisit },
  ] = useMutation(VisitUser);

  const {
    loading: loadingUserSuggestion,
    error: errorUserSuggestion,
    data: dataUserSuggestion,
    refetch: refetchUserSuggestion,
  } = useQuery(UserSuggestion, {
    variables: { userId: UserContext.user.id },
  });

  useEffect(() => {
    if (p.id === UserContext.user.id) {
      setEdit(true);
    }
  }, [UserContext.user.id, p.id]);

  useEffect(() => {
    UserContext.refetchUser();
    refetchCurrentUser();
  }, []);

  useEffect(() => {
    if (dataVisit && data) {
      if (dataVisit.visitUser.length !== data.getUserById.Visits.length) {
        refetchCurrentUser();
      }
    }
  }, [loadingVisit, loading]);

  useEffect(() => {
    if (UserContext.user.id !== p.id) {
      VisitUserMutation({
        variables: {
          id1: UserContext.user.id,
          id2: p.id,
        },
      }).then((e) => {});
    }
  }, []);

  if (loadingVisit) return <p>Loading...</p>;
  if (errorVisit) return <p>Error...</p>;

  if (loading) return <p>Get user data...</p>;
  if (error) return <p>Error...</p>;

  UserContext.user.Block.map((blockData: any) => {
    if (blockData.blockId === data.getUserById.id) {
      alreadyBlocked = true;
    }
  });

  return (
    <div className="white-bg full-screen center-col">
      {eduModal && <CreateEducationModal closeModal={setEduModal} />}

      {expModal && <CreateExperienceModal closeModal={setExpModal} />}

      <Navbar></Navbar>
      <div className="">
        <UserInformation
          currentUser={data.getUserById}
          refetchCurrentUser={refetchCurrentUser}
          edit={edit}
        ></UserInformation>

        {alreadyBlocked ? null : (
          <>
            <div className="sec-profile white-bg">
              <div className="flex-r w-full justify-between">
                <p className="text-black text-l bold m-profile">Education</p>
                {edit === true && (
                  <button
                    className="cursor-pointer button-grey-style bg-white text-white font-bold rounded m-profile border"
                    onClick={() => setEduModal(true)}
                  >
                    <AiOutlinePlus className="logo"></AiOutlinePlus>
                  </button>
                )}
              </div>
              {data.getUserById.Educations.length === 0 && (
                <>
                  <p className="text-black text-s w-full m-desc">-</p>
                  <div className="m-20px"></div>
                </>
              )}
              {data.getUserById.Educations.map((edu: any) => {
                return (
                  <Education
                    key={edu.ID}
                    edit={edit}
                    education={edu}
                  ></Education>
                );
              })}
            </div>
            <div className="sec-profile white-bg">
              <div className="flex-r w-full justify-between">
                <p className="text-black text-l bold m-profile">Experiences</p>
                {edit === true && (
                  <button
                    className="cursor-pointer button-grey-style bg-white text-white font-bold rounded m-profile border"
                    onClick={() => setExpModal(true)}
                  >
                    <AiOutlinePlus className="logo"></AiOutlinePlus>
                  </button>
                )}
              </div>
              {data.getUserById.Experiences.length === 0 && (
                <>
                  <p className="text-black text-s w-full m-desc">-</p>
                  <div className="m-20px"></div>
                </>
              )}
              {data.getUserById.Experiences.map((exp: any) => {
                return (
                  <Experience
                    key={exp.ID}
                    edit={edit}
                    experience={exp}
                  ></Experience>
                );
              })}
            </div>{" "}
          </>
        )}

        <div className="sec-profile white-bg">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">
              User you might know
            </p>
          </div>
          {loadingUserSuggestion ? (
            <p className="text-black text-s w-full m-desc">Loading...</p>
          ) : !errorUserSuggestion ? (
            <>
              <UserSuggestionProfile
                userSuggestionData={dataUserSuggestion.UserSuggestion}
              />
            </>
          ) : (
            <>
              <p className="text-black text-s w-full m-desc">-</p>
              <div className="m-20px"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
