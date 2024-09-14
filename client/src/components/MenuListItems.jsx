import React from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';

const adminIcons = [
  { icon: HomeIcon, title: "Ana Sayfa", url: "/nobelhizliokuma/admin-dashboard/" },
  { title: "Kullanıcılar", icon: PeopleAltIcon, url: "/nobelhizliokuma/admin-dashboard/kullanicilar" },
  { title: "Sınıflar", icon: ClassIcon, url: "/nobelhizliokuma/admin-dashboard/siniflar" },
  { title: "Ödevler", icon: ArticleIcon, url: "/nobelhizliokuma/admin-dashboard/odevler" },
  { title: "Egzersizler", icon: FitnessCenterIcon, url: "/nobelhizliokuma/admin-dashboard/egzersizler" },
  // { title: "Kurslar", icon: SchoolIcon, url: "/nobelhizliokuma/admin-dashboard/kurslar" },
];

const teacherIcons = [
  { icon: HomeIcon, title: "Ana Sayfa", url: "/nobelhizliokuma/ogretmen-paneli/" },
  { title: "Öğrencilerim", icon: PeopleAltIcon, url: "/nobelhizliokuma/ogretmen-paneli/kullanicilar" },
  { title: "Ödevler", icon: ArticleIcon, url: "/nobelhizliokuma/ogretmen-paneli/odevler" },
  { title: "Egzersizler", icon: FitnessCenterIcon, url: "/nobelhizliokuma/ogretmen-paneli/egzersizler" },
];


const userIcons = [
  { icon: HomeIcon, title: "Ana Sayfa", url: "/nobelhizliokuma/ogrenci-paneli" },
  // { title: "İlerlemeler", icon: TimelineIcon, url: "/nobelhizliokuma/ilerlemeler" },
  { title: "Sınıfım", icon: PeopleAltIcon, url: "/nobelhizliokuma/ogrenci-paneli/sinif" },
  { title: "Ödevler", icon: ArticleIcon, url: "/nobelhizliokuma/ogrenci-paneli/odevler" },
  { title: "Egzersizler", icon: FitnessCenterIcon, url: "/nobelhizliokuma/ogrenci-paneli/egzersizler" },
  // { title: "Kurslar", icon: SchoolIcon, url: "/nobelhizliokuma/kurslar" },
];

const MenuListItems = ({ role }) => {
  const navigate = useNavigate();
  const icons = role === "admin" ? adminIcons : role === "teacher" ? teacherIcons : userIcons;

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
