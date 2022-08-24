import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { storage } from '../config/firebase-config';
import { useLocalStorage } from '../hooks/LocalStorage';
import { useMutation } from '@apollo/client';
import { UpdateProfilePicture } from '../queries/userQueries';
import stringGen from '../script/helper';
import { UserContext } from '../lib/UserContext';

const ProfilePage = () => {
    const {user, setUser} = useContext(UserContext)
    const [updateProfilePicture] = useMutation(UpdateProfilePicture);
    const [image, setImage] = useState<File>();;

    async function uploadImage() {
        if (image === undefined) {
            alert("Input image file");
        } else {
            const stringId = stringGen(20)
            const storageRef = ref(storage, `images/${stringId}`);
            await uploadBytes(storageRef, image);
            getDownloadURL(storageRef).then((url) => {
                console.log(url)
                updateProfilePicture({
                    variables: {
                        id: user.id,
                        imageUrl: url
                    }
                }).then((e) => {
                    const updatedUser = user
                    updatedUser.profile_picture = e.data.updateProfilePicture.profile_picture
                    setUser(updatedUser)
                })
            })
        }
    }

    return (
        <div>
            <Navbar></Navbar>
            <div>
                <input type="file" accept="jpg,png,jpeg" onChange={(e) => { setImage((e.target.files as FileList)[0] as File) }}></input>
                <button onClick={uploadImage}>upload</button>
            </div>
        </div>
    );
}

export default ProfilePage