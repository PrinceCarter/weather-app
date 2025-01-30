import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "./index.css";
import App from "./App.tsx";

// Dynamically set the GraphQL URI based on environment
const GRAPHQL_URI =
  import.meta.env.VITE_GRAPHQL_URI || "http://localhost:4000/graphql";

console.log(`🔗 Connecting to GraphQL at: ${GRAPHQL_URI}`);

// Create Apollo Client
const client = new ApolloClient({
  uri: GRAPHQL_URI,
  cache: new InMemoryCache(),
});

// Render the App
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
