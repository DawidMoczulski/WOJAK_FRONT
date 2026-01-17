import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { MdDeleteOutline, MdStraighten, MdNavigation } from "react-icons/md";
import { LuMapPinPlus } from "react-icons/lu";
import { RiPinDistanceLine } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { createRoot } from "react-dom/client";
import Pin from "../../Types/Pin";
import NavButton2 from "../NavButton2";
import { ConversationParticipant } from "../../Types/ConversationParticipant";
import maplibregl, { MapMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type RouteData = {
  type: "Feature";
  geometry: {
    type: "LineString" | "MultiLineString";
    coordinates: number[][][] | number[][];
  };
  properties: {
    distance: number;
    distance_units: string;
    time: number;
    units: string;
    mode: string;
    waypoints: number[];
  };
};

function MapComponent() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [users, setUsers] = useState<ConversationParticipant[]>([]);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [newPin, setNewPin] = useState<{ lng: number; lat: number } | null>(
    null
  );
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [pinName, setPinName] = useState("");
  const [selectedType, setSelectedType] = useState<
    "wróg" | "sojusznik" | "obiekt" | null
  >(null);

  // Stan dla współrzędnych kursora i kompasu
  const [cursorCoords, setCursorCoords] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [rotation, setRotation] = useState(0);

  // Stan dla funkcji pomiaru
  const [measurementPoints, setMeasurementPoints] = useState<
    [number, number][]
  >([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const measurementLayerId = "measurement-line";
  const measurementMarkerRef = useRef<maplibregl.Marker | null>(null);
  //const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const currentPath = location.pathname; // np. "/maps/f1a3830b-87d9-4cc5-01f1-08dda04f7a7d"
  const chatRoute = currentPath.replace("/maps/", "/chats/");

  const [isAddingPin, setIsAddingPin] = useState(false);
  const [isAddingStretch, setIsAddingStretch] = useState(false);
  const fromMarkerRef = useRef<maplibregl.Marker | null>(null);
  const toMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [fromWaypoint, setFromWaypoint] = useState<[number, number] | null>(
    null
  );
  const [toWaypoint, setToWaypoint] = useState<[number, number] | null>(null);
  const [routeLayerId, setRouteLayerId] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [route, setRoute] = useState<RouteData | null>(null);

  // Funkcje obsługi zdarzeń mapy
  const handleMouseMove = (e: MapMouseEvent) => {
    setCursorCoords({ lng: e.lngLat.lng, lat: e.lngLat.lat });
  };

  const handleRotate = () => {
    if (map.current) {
      setRotation(map.current.getBearing() * -1);
    }
  };

  const handleAddPinModeToggle = () => {
    setIsAddingPin((prev) => !prev);
    setIsAddingStretch(false);
    setIsMeasuring(false);
  };

  const handleAddStretchModeToggle = () => {
    setIsAddingStretch((prev) => !prev);
    setIsAddingPin(false);
    setIsMeasuring(false);
  };

  const handleMapClick = (e: MapMouseEvent) => {
    if (!map.current || !isMeasuring) return;

    const { lng, lat } = e.lngLat;
    const newPoint: [number, number] = [lng, lat];

    if (measurementPoints.length === 0) {
      if (measurementMarkerRef.current) {
        measurementMarkerRef.current.remove();
      }

      measurementMarkerRef.current = new maplibregl.Marker({
        color: "#ff0000",
        scale: 0.8,
      })
        .setLngLat([lng, lat])
        .addTo(map.current);
    }

    setMeasurementPoints((prev) => [...prev, newPoint]);
  };

  // Inicjalizacja mapy
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=7bd0c51be31947789f9bd402a8ba263b",
      center: [18.054, 53.122],
      zoom: 12,
      doubleClickZoom: false,
    });

    // Nasłuchiwanie zdarzeń
    map.current.on("mousemove", handleMouseMove);
    map.current.on("rotate", handleRotate);

    // Czyszczenie
    return () => {
      if (map.current) {
        map.current.off("click", handleMapClick);
        map.current.off("mousemove", handleMouseMove);
        map.current.off("rotate", handleRotate);
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    const handleMapClick = (e: maplibregl.MapMouseEvent & maplibregl.Event) => {
      if (!isAddingStretch || !map.current) return;

      const { lng, lat } = e.lngLat;

      if (clickCount === 0) {
        // Ustaw pierwszy punkt (zielony marker)
        setFromWaypoint([lng, lat]);
        setClickCount(1);

        // Usuń poprzedni marker jeśli istnieje
        fromMarkerRef.current?.remove();

        // Dodaj nowy zielony marker
        fromMarkerRef.current = new maplibregl.Marker({ color: "green" })
          .setLngLat([lng, lat])
          .addTo(map.current);
      } else {
        // Ustaw drugi punkt (czerwony marker)
        setToWaypoint([lng, lat]);
        setClickCount(0); // Zresetuj licznik kliknięć

        // Usuń poprzedni marker jeśli istnieje
        toMarkerRef.current?.remove();

        // Dodaj nowy czerwony marker
        toMarkerRef.current = new maplibregl.Marker({ color: "red" })
          .setLngLat([lng, lat])
          .addTo(map.current);
        setIsAddingStretch(false);
      }
    };

    map.current.on("click", handleMapClick);

    return () => {
      map.current?.off("click", handleMapClick);
    };
  }, [isMeasuring, isAddingPin, isAddingStretch, fromWaypoint, toWaypoint]);

  useEffect(() => {
    if (!fromWaypoint || !toWaypoint || !map.current) return;

    const myAPIKey = "7bd0c51be31947789f9bd402a8ba263b";
    const fromWaypointLngLat = [fromWaypoint[1], fromWaypoint[0]];
    const toWaypointLngLat = [toWaypoint[1], toWaypoint[0]];

    const geoapifyUrl = `https://api.geoapify.com/v1/routing?waypoints=${fromWaypointLngLat.join(
      ","
    )}|${toWaypointLngLat.join(",")}&mode=drive&apiKey=${myAPIKey}`;

    if (routeLayerId) {
      if (map.current.getLayer(routeLayerId)) {
        map.current.removeLayer(routeLayerId);
      }
      if (map.current.getSource(routeLayerId)) {
        map.current.removeSource(routeLayerId);
      }
    }

    fetch(geoapifyUrl)
      .then((res) => res.json())
      .then((result) => {
        const newRoute = result.features[0];
        setRoute(newRoute);
        console.log(newRoute);
        console.log("Route geometry type:", newRoute.geometry.type);
        console.log(
          "Route geometry coordinates (should be [lng, lat]):",
          newRoute.geometry.coordinates
        );

        // Normalizujemy do pojedynczej tablicy współrzędnych
        const coords =
          newRoute.geometry.type === "LineString"
            ? newRoute.geometry.coordinates
            : newRoute.geometry.type === "MultiLineString"
            ? newRoute.geometry.coordinates[0]
            : [];

        if (coords.length === 0) {
          console.error("No route coordinates found!");
          return;
        }

        const id = `route-${Date.now()}`;
        map.current!.addSource(id, {
          type: "geojson",
          data: newRoute,
        });

        map.current!.addLayer({
          id,
          type: "line",
          source: id,
          paint: {
            "line-color": "#1489ff",
            "line-width": 5,
          },
        });

        const bounds = coords.reduce(
          (b: maplibregl.LngLatBounds, coord: [number, number]) =>
            b.extend(coord),
          new maplibregl.LngLatBounds(
            newRoute.geometry.coordinates[0],
            newRoute.geometry.coordinates[1]
          )
        );

        map.current!.fitBounds(bounds, { padding: 100 });

        setRouteLayerId(id);
        setIsAddingStretch(false);
      })

      .catch((err) => console.error("Routing fetch error:", err));
  }, [fromWaypoint, toWaypoint]);

  const clearRoute = () => {
    if (!map.current) return;

    // Usuwanie warstwy i źródła trasy
    try {
      map.current.getStyle().layers?.forEach((layer) => {
        if (layer.id.startsWith("route-") && map.current?.getLayer(layer.id)) {
          map.current.removeLayer(layer.id);
        }
      });

      // Usuń źródła związane z trasami
      Object.keys(map.current.getStyle().sources).forEach((sourceId) => {
        if (sourceId.startsWith("route-") && map.current?.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }
      });
    } catch (error) {
      console.error("Error removing route layers/sources:", error);
    }

    // Usuwamy markery
    fromMarkerRef.current?.remove();
    toMarkerRef.current?.remove();
    fromMarkerRef.current = null;
    toMarkerRef.current = null;

    // Czyścimy linie pomiarowe
    if (measurementMarkerRef.current) {
      measurementMarkerRef.current.remove();
      measurementMarkerRef.current = null;
    }

    try {
      if (map.current.getLayer(measurementLayerId)) {
        map.current.removeLayer(measurementLayerId);
      }
      if (map.current.getSource(measurementLayerId)) {
        map.current.removeSource(measurementLayerId);
      }
    } catch (error) {
      console.error("Error removing measurement layer:", error);
    }

    setFromWaypoint(null);
    setToWaypoint(null);
    setRouteLayerId(null);
    setMeasurementPoints([]);
    setIsAddingStretch(false);
  };

  useEffect(() => {
    if (!map.current) return;

    const handleMapClick = (e: maplibregl.MapMouseEvent & maplibregl.Event) => {
      if (!isMeasuring && isAddingPin) {
        const { lng, lat } = e.lngLat;
        setNewPin({ lng, lat });
        setSelectedType(null);
        setShowInput(false);
        setIsAddingPin(false); // wyłącz tryb po kliknięciu
      }
    };

    map.current.on("click", handleMapClick);

    return () => {
      map.current?.off("click", handleMapClick);
    };
  }, [isAddingPin, isMeasuring]);

  // Obsługa trybu pomiaru
  useEffect(() => {
    if (!map.current) return;

    if (isMeasuring) {
      map.current.on("click", handleMapClick);
    } else {
      map.current.off("click", handleMapClick);
    }

    return () => {
      map.current?.off("click", handleMapClick);
    };
  }, [isMeasuring]);

  // Aktualizacja linii pomiarowej
  useEffect(() => {
    if (!map.current) return;

    if (measurementPoints.length === 1) return;

    if (measurementPoints.length >= 2) {
      clearMeasurementLayer();

      map.current.addSource(measurementLayerId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: measurementPoints,
          },
          properties: {},
        },
      });

      map.current.addLayer({
        id: measurementLayerId,
        type: "line",
        source: measurementLayerId,
        layout: {},
        paint: {
          "line-color": "#ff0000",
          "line-width": 3,
        },
      });

      // Dodanie popupu z odległością
      const lastPoint = measurementPoints[measurementPoints.length - 1];
      const prevPoint = measurementPoints[measurementPoints.length - 2];
      const distance = calculateDistance(prevPoint, lastPoint);

      const popupNode = document.createElement("div");
      popupNode.innerHTML = `
        <div class="p-2 bg-white rounded shadow">
          Odcinek: ${distance.toFixed(2)} km
          ${
            measurementPoints.length > 2
              ? `<br>Suma: ${calculateTotalDistance(measurementPoints).toFixed(
                  2
                )} km`
              : ""
          }
        </div>
      `;

      new maplibregl.Popup()
        .setLngLat(lastPoint)
        .setDOMContent(popupNode)
        .addTo(map.current);
    }
  }, [measurementPoints]);

  // Funkcje pomocnicze
  const toggleMeasurement = () => {
    setIsMeasuring((prev) => !prev);
    setIsAddingStretch(false);
    setIsAddingPin(false);
    if (!isMeasuring) {
      setMeasurementPoints([]);
      clearMeasurementLayer();
      if (measurementMarkerRef.current) {
        measurementMarkerRef.current.remove();
        measurementMarkerRef.current = null;
      }
    }
  };

  const clearMeasurementLayer = () => {
    if (!map.current) return;
    if (map.current.getLayer(measurementLayerId)) {
      map.current.removeLayer(measurementLayerId);
    }
    if (map.current.getSource(measurementLayerId)) {
      map.current.removeSource(measurementLayerId);
    }
  };

  const calculateDistance = (
    point1: [number, number],
    point2: [number, number]
  ) => {
    const R = 6371;
    const dLat = (point2[1] - point1[1]) * (Math.PI / 180);
    const dLon = (point2[0] - point1[0]) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1[1] * (Math.PI / 180)) *
        Math.cos(point2[1] * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateTotalDistance = (points: [number, number][]) => {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      total += calculateDistance(points[i - 1], points[i]);
    }
    return total;
  };

  async function handleAddPin() {
    if (!newPin || pinName.trim() === "" || !selectedType) return;

    const pinData = {
      latitude: newPin.lat,
      longitude: newPin.lng,
      type: selectedType,
      description: pinName.trim(),
    };

    try {
      const response = await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}/pins`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pinData),
        }
      );

      const pinId = await response.json();

      const newCreatedPin: Pin = { ...pinData, id: pinId, userId: "" };

      const updatedPins = [...pins, newCreatedPin];

      setPins(updatedPins);
      navigate(location.pathname, {
        replace: true,
        state: updatedPins,
      });

      setNewPin(null);
      setShowInput(false);
      setSelectedType(null);
      setPinName("");
    } catch (err) {
      console.error(err);
    }
  }

  ///////// USUWANIE PINEZEK //////////////////

  async function pinDelete(pinId: number) {
    try {
      const response = await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}/pins/${pinId}`,
        {
          headers: { "content-type": "application/json" },
          credentials: "include",
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Delete failed");

      const updatedPins = pins.filter((pin) => pin.id !== pinId);
      setPins(updatedPins);

      navigate(location.pathname, {
        replace: true,
        state: updatedPins,
      });
    } catch (err) {
      console.log(err);
    }
  }

  ///////////////////////////////////////////////////////////

  const getPins = async (pins: Pin[]) => {
    if (!map.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    pins.forEach((pin) => {
      let color = "#e74c3c";
      if (pin.type === "sojusznik") color = "#27ae60";
      if (pin.type === "obiekt") color = "#3498db";

      const marker = new maplibregl.Marker({ color })
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(map.current!);

      const popupNode = document.createElement("div");
      console.log(users, "users");
      const user = users.find((user) => pin.userId === user.id);
      console.log(user, "user in map");
      // Pole nad pinezką - opis ///
      const PopupComponent = () => (
        <div className="p-2 max-w-[200px] flex items-center justify-between space-x-2">
          <div>
            <p className="text-base font-semibold text-green-700">
              {user?.username}{" "}
            </p>
            <p className="text-sm font-medium text-gray-800">
              {pin.description}
            </p>
          </div>

          {pin.id && (
            <MdDeleteOutline
              className="text-red-500 w-5 h-5 cursor-pointer hover:text-red-600 transition duration-200"
              onClick={() => pinDelete(pin.id!)}
            />
          )}
        </div>
      );

      createRoot(popupNode).render(<PopupComponent />);
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
      }).setDOMContent(popupNode);
      marker.setPopup(popup);
      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (location.state.pins) {
      console.log("Ustawiam pinezki z location.state", location.state.pins);
      setPins(location.state.pins);
    }
    console.log(location.state.users, "location.state.users");
    if (location.state.users) {
      console.log("users in map", location.state.users);
      setUsers(location.state.users);
    }
    loadBackendPins();
  }, []);

  useEffect(() => {
    getPins(pins);
  }, [pins]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadBackendPins();
    }, 10000);

    return () => clearInterval(interval); // czyścimy po odmontowaniu
  }, [conversationId]);

  // Wczytujemy z Backendu listę pinezek
  async function loadBackendPins() {
    try {
      const response = await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}/pins`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setPins(data);
      navigate(location.pathname, {
        replace: true,
        state: pins,
      });

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="relative w-full h-screen rounded-2xl overflow-hidden shadow-lg m-0 p-0 top-0">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Współrzędne kursora */}
      {cursorCoords && (
        <div className="fixed top-20 left-2 bg-white bg-opacity-80 p-2 rounded shadow z-50">
          <div className="text-black">
            <div className="font-medium">
              <span className="font-bold">longitude:</span>{" "}
              {cursorCoords.lng.toFixed(6)}
            </div>
            <div className="font-medium">
              <span className="font-bold">latitude:</span>{" "}
              {cursorCoords.lat.toFixed(6)}
            </div>
          </div>
        </div>
      )}
      {route && (
        <div className="fixed bottom-4 left-4 bg-white p-2 rounded shadow z-50 text-sm font-medium">
          Długość trasy: {(route.properties.distance / 1000).toFixed(2)} km
        </div>
      )}

      {/* Kompas */}
      <div className="fixed top-38 left-2 bg-white bg-opacity-80 p-2 rounded-full shadow z-50">
        <div style={{ transform: `rotate(${rotation}deg)` }}>
          <MdNavigation size={30} className="text-red-500" />
        </div>
      </div>
      <div className="fixed top-20 right-0 z-50">
        <NavButton2 route={chatRoute} content="Chat" />
      </div>

      {/* Przycisk pomiaru odległości i dodanie pinezki */}
      <button
        className={`fixed top-35 right-4 p-3 rounded-full shadow-lg z-50 ${
          isMeasuring ? "bg-red-500 text-white" : "bg-white text-gray-800"
        }`}
        onClick={toggleMeasurement}
        title="Pomiar odległości"
      >
        <MdStraighten size={20} />
      </button>

      <button
        onClick={handleAddPinModeToggle}
        className={`fixed top-50 right-4 p-3 rounded-full shadow-lg z-50 ${
          isAddingPin ? "bg-[#71806b] text-white" : "bg-[#595c58] text-black"
        }`}
      >
        {isAddingPin ? <LuMapPinPlus size={20} /> : <LuMapPinPlus size={20} />}
      </button>

      <button
        onClick={handleAddStretchModeToggle}
        className={`fixed top-65 right-4 p-3 rounded-full shadow-lg z-50 ${
          isAddingStretch
            ? "bg-[#81d4c5] text-white"
            : "bg-[#7bb5aa] text-black"
        }`}
      >
        {isAddingStretch ? (
          <RiPinDistanceLine size={20} />
        ) : (
          <RiPinDistanceLine size={20} />
        )}
      </button>

      <button
        className="fixed top-80 right-4 p-3 rounded-full shadow-lg bg-red-300 hover:bg-red-500 hover:scale-110 transition-all duration-200 z-50"
        onClick={clearRoute}
      >
        <AiFillDelete />
      </button>

      {/* Formularz dodawania pinezki */}
      {newPin && !selectedType && (
        <div className="absolute top-23 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-sm bg-white p-4 rounded shadow-lg z-50">
          <h2 className="text-lg font-semibold mb-3">
            Wybierz typ oznaczenia:
          </h2>
          <div className="flex flex-col sm:flex-col gap-2 sm:gap-4 mb-4">
            <button
              className="flex items-center space-x-2 px-4 py-2 border rounded text-red-600 hover:bg-red-50"
              onClick={() => {
                setSelectedType("wróg");
                setShowInput(true);
              }}
            >
              <span className="w-3 h-3 rounded-full bg-red-600" />
              <span>Zagrożenie</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 border rounded text-green-600 hover:bg-green-50"
              onClick={() => {
                setSelectedType("sojusznik");
                setShowInput(true);
              }}
            >
              <span className="w-3 h-3 rounded-full bg-green-600" />
              <span>Członek Drużyny</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 border rounded text-blue-600 hover:bg-blue-50"
              onClick={() => {
                setSelectedType("obiekt");
                setShowInput(true);
              }}
            >
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>Obiekt</span>
            </button>
          </div>
          <div className="text-center">
            <button
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => {
                setNewPin(null); // lub setShowInput(false), jeśli to odpowiednie
              }}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Formularz nazwy pinezki */}
      {showInput && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg z-50">
          <h2 className="text-lg font-semibold mb-2">Podaj nazwę pinezki</h2>
          <input
            type="text"
            className="border p-2 rounded w-full mb-2"
            value={pinName}
            onChange={(e) => setPinName(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => {
                setShowInput(false);
                setSelectedType(null);
                setPinName("");
                setNewPin(null);
              }}
            >
              Anuluj
            </button>
            <button
              className="bg-[#7a9a6e] text-white px-4 py-2 rounded hover:bg-[#678a5f]"
              onClick={handleAddPin}
            >
              Stwórz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapComponent;
