

let API_URL: string;
let WS_API_URL: string;

if (import.meta.env.VITE_NODE_ENV === "production") {
  API_URL = "https://hackforce.onrender.com";
  WS_API_URL = "wss://hackforce.onrender.com";
} else {
  API_URL = "http://localhost:5001";
  WS_API_URL = "ws://localhost:5001";
}

export { API_URL, WS_API_URL };