import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../components/Logo";
import { GetResetLink } from "../queries/ForgotPasswordLinkQueries";
import { ResetPassword } from "../queries/UserQueries";
import { toastError, toastSuccess } from "../script/Toast";
import ErrorPage from "./ErrorPage";

const ResetPasswordPage = () => {
  const p = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GetResetLink, {
    variables: {
      id: p.id,
    },
  });
  const [resetPassword] = useMutation(ResetPassword);

  if (loading) return null;

  if (error)
    return (
      <ErrorPage errorCode="404" errorDefinition="Page Not Found"></ErrorPage>
    );

  function handleSubmit(e: any) {
    e.preventDefault();

    const newPass = (document.getElementById("password") as HTMLInputElement)
      .value;
    const confNewPass = (
      document.getElementById("confPassword") as HTMLInputElement
    ).value;

    if (newPass === "") {
      toastError("Error: Password cannot be empty");
    } else if (newPass !== confNewPass) {
      toastError("Error: Password doesn't match");
    } else {
      resetPassword({
        variables: {
          email: data.getResetLink.email,
          newPassword: newPass,
        },
      })
        .then(() => {
          toastSuccess("Success: Reset Password Success!");
          navigate("/");
        })
        .catch((err) => {
          toastError(String(err));
        });
    }
  }

  return (
    <div className="h-screen">
      <Logo />
      <div className="h-full flex justify-center items-center">
        <div className="w-full max-w-sm border-2 items-center shadow-md rounded-lg">
          <div className="pb-1 border-b-2">
            <p className="px-8 text-2xl font-bold justify-between items-center">
              Reset Password
            </p>
            <p className="px-8 text-sm justify-between items-center mt-minus-1">
              Reset password with one single click
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg px-8 pt-6 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="password"
                id="password"
                type="password"
                placeholder="New Password"
              ></input>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confPassword"
              >
                Confirm New Password
              </label>
              <input
                className="shadow appearance-none border box-border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus-outline-none"
                name="confPassword"
                id="confPassword"
                type="password"
                placeholder="Confirm New Password"
              ></input>
            </div>
            <div className="items-center justify-between mb-10">
              <button
                className="w-full cursor-pointer bg-blue-500 border-blue-500 button-style text-white font-bold py-2 px-4 rounded-lg"
                type="submit"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
