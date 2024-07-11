import React from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';

const adminIcons = [
  { icon: HomeIcon, title: "Ana Sayfa", url: "/nobelhizliokuma/admin-dashboard/" },
  { title: "Öğrenciler", icon: PeopleAltIcon, url: "/nobelhizliokuma/admin-dashboard/ogrenciler" },
  { title: "Ödevler", icon: ArticleIcon, url: "/nobelhizliokuma/admin-dashboard/odevler" },
  { title: "Egzersizler", icon: FitnessCenterIcon, url: "/nobelhizliokuma/admin-dashboard/egzersizler" },
  { title: "Kurslar", icon: SchoolIcon, url: "/nobelhizliokuma/admin-dashboard/kurslar" },
  // { title: "Profil", icon: AccountBoxIcon, url: "/nobelhizliokuma/admin-dashboard/profil" },
];

const userIcons = [
  { icon: HomeIcon, title: "Ana Sayfa", url: "/nobelhizliokuma/" },
  { title: "İlerlemeler", icon: TimelineIcon, url: "/nobelhizliokuma/ilerlemeler" },
  { title: "Ödevler", icon: ArticleIcon, url: "/nobelhizliokuma/odevler" },
  { title: "Egzersizler", icon: FitnessCenterIcon, url: "/nobelhizliokuma/egzersizler" },
  // { title: "Kurslar", icon: SchoolIcon, url: "/nobelhizliokuma/kurslar" },
  // { title: "Profil", icon: AccountBoxIcon, url: "/nobelhizliokuma/profil" },
];

const MenuListItems = ({ role }) => {
  const navigate = useNavigate();
  const icons = role === "admin" ? adminIcons : userIcons;

  return (
    <ul className="space-y-1">
      {icons.map((item, index) => (
        <li key={index}>
          <a
            href={item.url}
            className="group flex items-center px-2 py-2 text-sm font-medium text-indigo-100 rounded-md hover:bg-indigo-700 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              navigate(item.url);
            }}
          >
            <item.icon className="mr-3 h-6 w-6 text-indigo-100" aria-hidden="true" />
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default MenuListItems;
