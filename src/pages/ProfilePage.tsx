import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState, useContext } from "react";
import { storage } from "../config/firebase-config";
import { useMutation } from "@apollo/client";
import { UpdateProfilePicture } from "../queries/UserQueries";
import stringGen from "../script/helper";
import { UserContext } from "../lib/UserContext";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const p = useParams();

  const [edit, setEdit] = useState(false);
  const { currUser, setCurrUser } = useContext(UserContext);
  const userId = p.id;
  const [updateProfilePicture] = useMutation(UpdateProfilePicture);
  const [image, setImage] = useState<File>();

  useEffect(() => {
    if (userId === currUser.id) {
      setEdit(true);
    }
  }, [userId, currUser]);

  async function uploadImage() {
    if (image === undefined) {
      alert("Input image file");
    } else {
      const stringId = stringGen(20);
      const storageRef = ref(storage, `images/${stringId}`);
      await uploadBytes(storageRef, image);
      getDownloadURL(storageRef).then((url) => {
        console.log(url);
        updateProfilePicture({
          variables: {
            id: currUser.id,
            imageUrl: url,
          },
        }).then((e) => {
          const updatedUser = currUser;
          updatedUser.profile_picture =
            e.data.updateProfilePicture.profile_picture;
          setCurrUser(updatedUser);
        });
      });
    }
  }

  return (
    // <div className="white-bg fullscreen center-col">
    //   {EducationModal === true && (
    //     <CreateEducationModal
    //       refetch={education.refetch}
    //       toggle={toggleCreateEducation}
    //     ></CreateEducationModal>
    //   )}
    //   {ExperienceModal === true && (
    //     <CreateExperienceModal
    //       refetch={experience.refetch}
    //       toggle={toggleCreateExperience}
    //     ></CreateExperienceModal>
    //   )}
    //   <Navbar></Navbar>
    //   <div className="profile">
    //     <label htmlFor="file">
    //       <img
    //         className="profile-picture"
    //         src={User.profile_picture_url}
    //         alt=""
    //       />
    //     </label>
    //     <p className="text-black mv-20 text-xl">
    //       {User.first_name} {User.last_name}
    //     </p>
    //     {UserExperiences.map((experience: any) => {
    //       if (experience.Active) {
    //         return (
    //           <p key={experience.ID} className="text-black mb-20 text-m">
    //             {experience.Description} at {experience.CompanyName}
    //           </p>
    //         );
    //       }
    //     })}
    //     <input
    //       disabled={!MyProfile}
    //       type="file"
    //       name="file"
    //       id="file"
    //       className="invisible"
    //       onChange={(e) => {
    //         handleFileChange(e);
    //       }}
    //     />
    //     {MyProfile != true &&
    //       !User.connect_request.includes(userContext.user.id) &&
    //       !User.connected_user.includes(userContext.user.id) && (
    //         <div>
    //           <button
    //             onClick={() => {
    //               requestConnection({
    //                 variables: { id: userContext.user.id, recepient: User.id },
    //               }).then(() => {
    //                 user.refetch();
    //               });
    //             }}
    //             className="blue-button-smaller text-white"
    //           >
    //             Request Connection
    //           </button>
    //         </div>
    //       )}
    //     {MyProfile != true &&
    //       User.connect_request.includes(userContext.user.id) && (
    //         <div>
    //           <button className="grey-button-smaller text-white">
    //             Requested
    //           </button>
    //         </div>
    //       )}
    //     {MyProfile != true &&
    //       User.connected_user.includes(userContext.user.id) && (
    //         <div>
    //           <button className="white-button-smaller text-white">
    //             Connected
    //           </button>
    //         </div>
    //       )}
    //   </div>

    //   <div className="profile">
    //     <div className="flex-row w-full space-between">
    //       <p className="text-black text-l bold mb-20">Education</p>
    //       {MyProfile === true && (
    //         <button className="add-button" onClick={toggleCreateEducation}>
    //           <AiOutlinePlus className="plus-logo"></AiOutlinePlus>
    //         </button>
    //       )}
    //     </div>
    //     {UserEducations.length === 0 && (
    //       <p className="text-black text-s w-full">Empty</p>
    //     )}
    //     {UserEducations.map((edu: any) => {
    //       return (
    //         <Education
    //           key={edu.ID}
    //           myprofile={MyProfile}
    //           education={edu}
    //           refetch={education.refetch}
    //         ></Education>
    //       );
    //     })}
    //   </div>
    //   <div className="profile">
    //     <div className="flex-row w-full space-between">
    //       <p className="text-black text-l bold mb-20">Experiences</p>
    //       {MyProfile === true && (
    //         <button className="add-button" onClick={toggleCreateExperience}>
    //           <AiOutlinePlus className="plus-logo"></AiOutlinePlus>
    //         </button>
    //       )}
    //     </div>
    //     {UserExperiences.length === 0 && (
    //       <p className="text-black text-s w-full">Empty</p>
    //     )}
    //     {UserExperiences.map((exp: any) => {
    //       return (
    //         <Experience
    //           key={exp.ID}
    //           refetch={experience.refetch}
    //           myprofile={MyProfile}
    //           experience={exp}
    //         ></Experience>
    //       );
    //     })}
    //   </div>
    // </div>
    <></>
  );
};

export default ProfilePage;
