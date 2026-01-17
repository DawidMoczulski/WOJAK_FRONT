import { useNavigate, useParams } from "react-router";

interface EmailInfoProps {
  header: string;
  content: string;
  buttonText: string;
  isResending?: boolean;
}

function EmailConfirmationPage({
  header,
  content,
  buttonText,
  isResending = false,
}: EmailInfoProps) {
  const navigate = useNavigate();
  const { email } = useParams();

  async function onResendEmail() {
    try {
      const response = await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/account/resendConfirmationEmail/${email}`,
        {
          credentials: "include",
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Sending email failed!");
      }
    } catch (err) {
      console.log(err);
    }
  }
  function onRedirect() {
    navigate("/login");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-8">{header}</h2>
        <p className="text-gray-700 mb-6">{content}</p>
        <button
          onClick={isResending ? onResendEmail : onRedirect}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default EmailConfirmationPage;
