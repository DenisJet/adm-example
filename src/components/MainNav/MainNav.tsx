"use client";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import {
  BookOutlined as BookOutlinedIcon,
  Article as ArticleIcon,
  Groups as GroupsIcon,
  LocationCity as LocationCityIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import * as SC from "./MainNav.style";
import { ROUTES } from "@/constants/routes.constants";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";

const DRAWER_WIDTH = 100;

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  {
    path: ROUTES.base,
    icon: <Image src="/book.png" width={22} height={26} alt="База знаний" />,
    label: "База знаний",
  },
  {
    path: ROUTES.tasks,
    icon: <Image src="/file.png" width={18} height={24} alt="Заявки" />,
    label: "Заявки",
  },
  {
    path: ROUTES.staff,
    icon: <Image src="/staff.png" width={25} height={17} alt="Сотрудники" />,
    label: "Сотрудники",
  },
  {
    path: ROUTES.clients,
    icon: <Image src="/city.png" width={25} height={26} alt="Клиенты" />,
    label: "Клиенты",
  },
  {
    path: ROUTES.assets,
    icon: <Image src="/analytics.png" width={26} height={24} alt="Активы" />,
    label: "Активы",
  },
  {
    path: ROUTES.settings,
    icon: <Image src="/settings.png" width={25} height={24} alt="Настройки" />,
    label: "Настройки",
  },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
        }}
      >
        <SC.StyledToolBar>
          <SC.StyledInput endAdornment={<SearchIcon htmlColor="gray" />} />
        </SC.StyledToolBar>
      </AppBar>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <SC.StyledList>
          <SC.StyledListItem
            sx={{
              backgroundColor: pathname === ROUTES.home ? "#0c4a6e" : "",
            }}
          >
            <SC.StyledLink href={ROUTES.home}>
              <Image
                src="/logo.png"
                width={52}
                height={44}
                alt="logo"
                priority
              />
            </SC.StyledLink>
          </SC.StyledListItem>

          {navItems.map((item) => (
            <SC.StyledListItem
              key={item.path}
              sx={{
                backgroundColor: pathname === item.path ? "#0c4a6e" : "",
              }}
            >
              <SC.StyledLink href={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </SC.StyledLink>
            </SC.StyledListItem>
          ))}
        </SC.StyledList>
      </Drawer>
    </>
  );
}
