import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { CrmLayout } from "./crm/CrmLayout";
import "./crm/crm.css";
import { ensureUserSeedData } from "./crm/store";

export default function Dashboard({ user, onLogout }) {
  useEffect(() => {
    if (user?.email) {
      ensureUserSeedData(user.email);
    }
  }, [user?.email]);

  return (
    <CrmLayout user={user} onLogout={onLogout}>
      <Outlet />
    </CrmLayout>
  );
}
