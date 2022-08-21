import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { GetLink } from "../queries/activationLinkQueries";
import { ActivateAccount, GetAllUsers } from "../queries/userQueries";
import ErrorPage from "./ErrorPage";

const AccountVerificationPage = () => {
  const p = useParams();
  const navigate = useNavigate();

  const [activateAccount] = useMutation(ActivateAccount);

  const { loading, error, data } = useQuery(GetLink, {
    variables: {
      id: p.id
    }
  })

  if (loading) return null

  if (error) return <ErrorPage errorCode ="404" errorDefinition = "Page Not Found"></ErrorPage>

  console.log(data.getLink.userId)

  const handleVerify = (e: any) => {
    e.preventDefault();
    activateAccount({
      variables: {
        id: data.getLink.userId,
      },
    })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log("err" + err);
      });
  };

  return (
    <div
      aria-hidden="true"
      className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-white bg-opacity-30 h-full center-all "
    >
      <div className="fixed p-4 w-full max-w-2xl h-full md:h-auto center-all">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700 border-2 relative">
          <div className="py-6 px-6 lg:px-8">
            <p className="mb-3 text-center">
              {"Click the button below to activate your account"}
            </p>
            <div className="addWorkspace space-y-3">
              <button
                onClick={handleVerify}
                className="w-full cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold py-2 px-4 rounded-lg"
                // className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationPage;
