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
    icon: <BookOutlinedIcon fontSize="large" htmlColor="white" />,
    label: "База знаний",
  },
  {
    path: ROUTES.tasks,
    icon: <ArticleIcon fontSize="large" htmlColor="white" />,
    label: "Заявки",
  },
  {
    path: ROUTES.staff,
    icon: <GroupsIcon fontSize="large" htmlColor="white" />,
    label: "Сотрудники",
  },
  {
    path: ROUTES.clients,
    icon: <LocationCityIcon fontSize="large" htmlColor="white" />,
    label: "Клиенты",
  },
  {
    path: ROUTES.assets,
    icon: <BarChartIcon fontSize="large" htmlColor="white" />,
    label: "Активы",
  },
  {
    path: ROUTES.settings,
    icon: <SettingsIcon fontSize="large" htmlColor="white" />,
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
                width={55}
                height={50}
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
