import ResumeRouters from "@/routes/routes";
import { AppstoreOutlined } from "@ant-design/icons";
import { MenuDataItem, ProLayout } from "@ant-design/pro-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const menuItems: MenuDataItem[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/resume",
    name: "Resume",
  },
  {
    path: "/settings",
    name: "Settings",
    children: [
      { path: "/settings/profile", name: "Profile" },
      { path: "/settings/enable-2fa", name: "Enable 2FA" },
    ],
  },
  {
    path: "/logout",
    name: "Logout",
  },
];

export const ResumeLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logoWithText = (
    <Link
      to="/dashboard"
      className="flex items-center gap-2 text-lg font-semibold no-underline text-current"
    >
      <AppstoreOutlined className="text-xl" />
      {!collapsed && <span className="transition-all">Ultimate Resume</span>}
    </Link>
  );

  return (
    <ProLayout
      title=""
      fixSiderbar
      collapsed={collapsed}
      onCollapse={setCollapsed}
      logo={logoWithText}
      menuDataRender={() => menuItems}
      menuItemRender={(item, dom) => (
        <a onClick={() => item.path && navigate(item.path)}>{dom}</a>
      )}
    >
      <div className="p-6">
        <ResumeRouters />
      </div>
    </ProLayout>
  );
};
