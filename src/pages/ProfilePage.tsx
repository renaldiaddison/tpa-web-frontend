import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState, useContext } from "react";
import { storage } from "../config/firebase-config";
import { useMutation, useQuery } from "@apollo/client";
import {
  Follow,
  GetUserById,
  RequestConnect,
  Unfollow,
  UpdateBackgroundPicture,
  UpdateProfilePicture,
} from "../queries/UserQueries";
import stringGen from "../script/helper";
import { UserContext } from "../lib/UserContext";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { RefetchContext } from "../lib/RefetchContext";
import { toastError } from "../script/Toast";
import { CreateEducation, GetUserEducation } from "../queries/EducationQueries";
import { GetUserExperience } from "../queries/ExperienceQueries";
import CreateEducationModal from "../components/CreateEducationModal";
import "../styles/profile.scss";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import CreateExperienceModal from "../components/CreateExperienceModal";
import Education from "../components/Education";
import Experience from "../components/Experience";

const ProfilePage = () => {
  const p = useParams();

  const [edit, setEdit] = useState(false);
  const [eduModal, setEduModal] = useState(false);
  const [expModal, setExpModal] = useState(false);
  const [userEducations, setUserEducations] = useState([]);
  const [userExperiences, setUserExperiences] = useState([]);

  const [haveActiveExp, setHaveActiveExp] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const { refetchUser } = useContext(RefetchContext);

  const [currProfile, setCurrProfile] = useState<any>({
    id: "",
    firstName: "",
    lastName: "",
    profile_picture: "",
    background_picture: "",
    request_connect: [],
    connected_user: [],
    followed_user: [],
  });

  const userQuery = useQuery(GetUserById, {
    variables: {
      id: p.id,
    },
  });

  const educationQuery = useQuery(GetUserEducation, {
    variables: {
      userID: p.id,
    },
  });

  const experienceQuery = useQuery(GetUserExperience, {
    variables: {
      userID: p.id,
    },
  });

  const [updateProfilePicture] = useMutation(UpdateProfilePicture);
  const [updateBackgroundPicture] = useMutation(UpdateBackgroundPicture);
  const [requestConnect] = useMutation(RequestConnect);

  const [follow] = useMutation(Follow);
  const [unFollow] = useMutation(Unfollow);

  useEffect(() => {
    if (p.id === user?.id) {
      setEdit(true);
    }
  }, [user, p.id]);

  const handleFileChange = async (e: any) => {
    const image = e.target.files[0];
    if (image === undefined) {
      toastError("Please input png, jpg, or jpeg");
    } else {
      const stringId = stringGen(20);
      const storageRef = ref(storage, `images/${stringId}`);
      uploadBytes(storageRef, image).then(() => {
        getDownloadURL(storageRef).then((url) => {
          updateProfilePicture({
            variables: {
              id: user?.id,
              imageUrl: url,
            },
          }).then(() => {
            userQuery.refetch();
            refetchUser();
          });
        });
      });
    }
  };

  const handleBackgroundChange = async (e: any) => {
    const background = e.target.files[0];
    if (background === undefined) {
      toastError("Please input png, jpg, or jpeg");
    } else {
      const stringId = stringGen(25);
      const imageRef = ref(storage, `background/${stringId}`);
      uploadBytes(imageRef, background).then(() => {
        getDownloadURL(imageRef).then((url) => {
          updateBackgroundPicture({
            variables: {
              id: user?.id,
              imageUrl: url,
            },
          }).then(() => {
            userQuery.refetch();
            refetchUser();
          });
        });
      });
    }
  };

  useEffect(() => {
    refetchUser();
  }, []);

  useEffect(() => {
    if (!userQuery.loading && !userQuery.error) {
      setCurrProfile(userQuery.data.getUserById);
    }
  }, [userQuery.loading, userQuery.data]);

  useEffect(() => {
    if (!educationQuery.loading && !educationQuery.error) {
      setUserEducations(educationQuery.data.userEducation);
    }
  }, [educationQuery.loading, educationQuery.data]);

  useEffect(() => {
    if (!experienceQuery.loading && !experienceQuery.error) {
      setUserExperiences(experienceQuery.data.userExperience);
    }
  }, [experienceQuery.loading, experienceQuery.data]);

  return (
    <div className="white-bg full-screen center-col">
      <Navbar></Navbar>
      <div className="">
        <div className="profile bg-white">
          <div
            className="w-full flex-col bg-white"
            style={{
              backgroundImage: "url(" + currProfile.background_picture + ")",
              backgroundRepeat: "no-repeat",
              borderRadius: "10px 10px 0 0",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full flex-r relative">
              <label htmlFor="background" className="w-fit">
                {edit && (
                  <div className="picture-btn text-bg cover">
                    <AiFillEdit className="logo"></AiFillEdit>
                  </div>
                )}
              </label>
            </div>
            <div className="w-full flex-row">
              <label
                htmlFor="file"
                className={edit === true ? "cursor-pointer" : ""}
              >
                <img
                  className="profile-picture cover m-profile white-bg"
                  src={currProfile.profile_picture}
                ></img>
              </label>
            </div>
          </div>
          <p className="text-black m-profile text-xl mt-5">
            {currProfile.firstName + " " + currProfile.lastName}
          </p>

          {userExperiences.map((experience: any) => {
            if (experience.Active) {
              return (
                <p key={experience.ID} className="text-black text-m m-desc">
                  {experience.Description} at {experience.CompanyName}
                </p>
              );
            }
          })}

          <input
            disabled={!edit}
            type="file"
            name="file"
            id="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              handleFileChange(e);
            }}
          />

          <input
            disabled={!edit}
            type="file"
            name="background"
            id="background"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              handleBackgroundChange(e);
            }}
          />

          {eduModal && (
            <CreateEducationModal
              closeModal={setEduModal}
              refetch={educationQuery.refetch}
            />
          )}

          {expModal && (
            <CreateExperienceModal
              closeModal={setExpModal}
              refetch={experienceQuery.refetch}
            />
          )}

          <div className="w-full flex-r m-20px">
            {!edit &&
              !currProfile.request_connect.includes(user?.id) &&
              !currProfile.connected_user.includes(user?.id) && (
                <div>
                  <button
                    onClick={() => {
                      requestConnect({
                        variables: {
                          id: user?.id,
                          recipientID: currProfile.id,
                        },
                      }).then(() => {
                        userQuery.refetch();
                      });
                    }}
                    className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
                  >
                    Request
                  </button>
                </div>
              )}

            {!edit && currProfile.request_connect.includes(user?.id) && (
              <div>
                <button className="cursor-pointer bg-gray-500 border-gray-500 button-gray-style text-white font-bold rounded-lg text-white px-2 py-1">
                  Requested
                </button>
              </div>
            )}
            {!edit && currProfile.connected_user.includes(user?.id) && (
              <div>
                <button className="cursor-pointer bg-white button-style text-white font-bold rounded-lg text-white px-2 py-1">
                  Connected
                </button>
              </div>
            )}

            <div className="ml-2">
              {!edit && !user.followed_user.includes(currProfile.id) && (
                <div>
                  <button
                    onClick={() => {
                      follow({
                        variables: { id: user.id, followedID: currProfile.id },
                      }).then(() => {
                        refetchUser();
                      });
                    }}
                    className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded-lg text-white px-2 py-1"
                  >
                    Follow
                  </button>
                </div>
              )}
              {!edit && user.followed_user.includes(currProfile.id) && (
                <div>
                  <button
                    onClick={() => {
                      unFollow({
                        variables: {
                          id: user.id,
                          unfollowedID: currProfile.id,
                        },
                      }).then(() => {
                        refetchUser();
                      });
                    }}
                    className="cursor-pointer bg-red-500 border-red-500 button-red-style text-white font-bold rounded-lg text-white px-2 py-1"
                  >
                    Unfollow
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sec-profile white-bg">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">Education</p>
            {edit === true && (
              <button
                className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded m-profile"
                onClick={() => setEduModal(true)}
              >
                <AiOutlinePlus></AiOutlinePlus>
              </button>
            )}
          </div>
          {userEducations.length === 0 && (
            <>
              <p className="text-black text-s w-full m-desc">-</p>
              <div className="m-20px"></div>
            </>
          )}
          {userEducations.map((edu: any) => {
            return (
              <Education
                key={edu.ID}
                edit={edit}
                education={edu}
                refetch={educationQuery.refetch}
              ></Education>
            );
          })}
        </div>
        <div className="sec-profile white-bg">
          <div className="flex-r w-full justify-between">
            <p className="text-black text-l bold m-profile">Experiences</p>
            {edit === true && (
              <button
                className="cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold rounded m-profile"
                onClick={() => setExpModal(true)}
              >
                <AiOutlinePlus></AiOutlinePlus>
              </button>
            )}
          </div>
          {userExperiences.length === 0 && (
            <>
              <p className="text-black text-s w-full m-desc">-</p>
              <div className="m-20px"></div>
            </>
          )}
          {userExperiences.map((exp: any) => {
            return (
              <Experience
                key={exp.ID}
                refetch={experienceQuery.refetch}
                edit={edit}
                experience={exp}
              ></Experience>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
