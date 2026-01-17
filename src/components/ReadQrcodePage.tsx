import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate, useParams } from "react-router";

function ReadQrcodePage() {
  const scannerRef = useRef(null);
  const navigate = useNavigate();
  const { conversationId } = useParams();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 30,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("Scanned result:", decodedText);
        try {
          const response = await fetch(decodedText, {
            method: "GET",
            credentials: "include", // ✅ This sends cookies/auth headers
          });

          if (response.ok) {
            navigate(`/chats/${conversationId}`);
          } else {
            console.error("Failed request:", response.status);
          }
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          scanner.clear().catch(() => {});
        }
      },
      (errorMessage) => {
        console.warn("QR scan error:", errorMessage);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [conversationId, navigate]);

  return (
    <div className="p-4 mt-20">
      <h2 className="text-lg font-semibold mb-4">Skanuj kod grupy</h2>
      <div id="qr-reader" ref={scannerRef} />
    </div>
  );
}

export default ReadQrcodePage;
