import { routeConfig } from '@/config/routes'
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons'
import { MenuDataItem, ProLayout } from '@ant-design/pro-components'
import React, { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const menuItems: MenuDataItem[] = routeConfig
    .filter((r) => r.menu)
    .reduce<MenuDataItem[]>((acc, { path, menu }) => {
        if (menu?.parent) {
            let parent = acc.find((m) => m.name === menu.parent)
            if (!parent) {
                parent = {
                    name: menu.parent,
                    icon:
                        menu.parent === 'Settings'
                            ? React.createElement(SettingOutlined)
                            : undefined,
                    children: [],
                }
                acc.push(parent)
            }

            parent.children!.push({ name: menu.name, path })
        } else {
            acc.push({ name: menu?.name, path, icon: menu?.icon })
        }

        return acc
    }, [])

export const ResumeLayout = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)

    const logoWithText = (
        <span
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-lg font-semibold no-underline text-current cursor-pointer"
        >
            <AppstoreOutlined className="text-xl" />
            {!collapsed && (
                <span className="transition-all">Ultimate Resume</span>
            )}
        </span>
    )

    return (
        <ProLayout
            title=""
            fixSiderbar
            collapsed={collapsed}
            onCollapse={setCollapsed}
            token={{
                sider: {
                    // colorMenuBackground: '#001529',
                    // colorTextMenuSelected: '#1677ff',
                },
            }}
            logo={logoWithText}
            menuDataRender={() => menuItems}
            menuItemRender={(item, dom) => (
                <span onClick={() => item.path && navigate(item.path)}>
                    {dom}
                </span>
            )}
        >
            <div className="p-6">{children}</div>
        </ProLayout>
    )
}
