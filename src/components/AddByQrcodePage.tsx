import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface GetInvitationTokenDto {
  token: string;
  imageUrl: string;
}

function AddByQrcodePage() {
  const [loading, setLoading] = useState(true);
  const { conversationId } = useParams();
  const [qrCodeData, setQrCodeData] = useState<GetInvitationTokenDto | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const totalTime = 10; // 2 minutes in seconds

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch(
          `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}/qrToken`,
          { credentials: "include" }
        );

        if (!response.ok) throw new Error("Failed to fetch QR code");

        const data = await response.json();
        setQrCodeData(data);
      } catch (error) {
        console.error("Error loading QR code:", error);
        setError("Failed to fetch QR code");
      } finally {
        setLoading(false);
      }
    };

    fetchQrCode();
  }, [conversationId]);

  useEffect(() => {
    if (!qrCodeData) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= totalTime) {
          clearInterval(interval);
          return totalTime;
        }
        return prev + 1;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [qrCodeData]);

  const timeLeft = totalTime - elapsedTime;
  const isQrVisible = elapsedTime < totalTime;

  if (loading) return <p>Loading QR code...</p>;

  return (
    <div className="qr-container mt-20 max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Dołącz przez QR
      </h2>

      {qrCodeData && isQrVisible ? (
        <>
          <div className="mb-4 text-center">
            <img
              src={qrCodeData.imageUrl}
              alt="QR Code to join conversation"
              style={{ maxWidth: "100%", height: "auto" }}
              className="mx-auto"
            />
            <p className="mt-2 text-sm text-gray-600">
              Token: <code>{qrCodeData.token}</code>
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Pozostały czas: {timeLeft}s
            </label>
            <input
              type="range"
              min="0"
              max={totalTime}
              value={elapsedTime}
              readOnly
              className="w-full accent-blue-600"
            />
          </div>
        </>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-red-500 text-center font-medium">
          Kod Qr wygasł po 2 minutach.
        </p>
      )}
    </div>
  );
}

export default AddByQrcodePage;
