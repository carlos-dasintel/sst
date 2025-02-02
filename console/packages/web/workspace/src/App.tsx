import "@fontsource/ibm-plex-mono/latin.css";

import { Component, For } from "solid-js";
import { Link, Route, Router, Routes } from "@solidjs/router";
import { AuthProvider, useAuth } from "./data/auth";
import { createSubscription } from "./data/replicache";
import { UserStore } from "./data/user";
import { WorkspaceStore } from "./data/workspace";
import { Workspace } from "./pages/workspace";
import { Connect } from "./pages/connect";
import { Debug } from "./pages/debug";

console.log(import.meta.env.VITE_API_URL);
export const App: Component = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="" component={Header} />
          <Route path="debug" component={Debug} />
          <Route path="connect" component={Connect} />
          <Route path=":accountID/:workspaceID/*" component={Workspace} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

function Header() {
  const auth = useAuth();

  return (
    <For each={Object.values(auth)}>
      {(entry) => {
        const users = createSubscription(
          UserStore.list,
          [],
          () => entry.replicache
        );
        return (
          <ol>
            <li>{users()[0]?.email}</li>
            <ol>
              <For each={users()}>
                {(user) => {
                  const workspace = createSubscription(
                    () => WorkspaceStore.fromID(user.workspaceID),
                    undefined,
                    () => entry.replicache
                  );
                  return (
                    <li>
                      <Link
                        href={`/${entry.token.accountID}/${workspace()?.id}`}
                      >
                        {" "}
                        Workspace: {workspace()?.slug}
                      </Link>
                    </li>
                  );
                }}
              </For>
            </ol>
          </ol>
        );
      }}
    </For>
  );
}

// App
// -> look for any login tokens
// -> redirect to default
// -> if none found, redirect to login
// Workspace
// -> make sure the login token exists + works
// -> otherwise redirect to login
