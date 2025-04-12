import { AppstoreOutlined } from "@ant-design/icons";
import { MenuDataItem, ProLayout } from "@ant-design/pro-components";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export const ResumeLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logoWithText = (
    <span
      onClick={() => navigate("/dashboard")}
      className="flex items-center gap-2 text-lg font-semibold no-underline text-current cursor-pointer"
    >
      <AppstoreOutlined className="text-xl" />
      {!collapsed && <span className="transition-all">Ultimate Resume</span>}
    </span>
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
        <span onClick={() => item.path && navigate(item.path)}>{dom}</span>
      )}
    >
      <div className="p-6">{children}</div>
    </ProLayout>
  );
};
