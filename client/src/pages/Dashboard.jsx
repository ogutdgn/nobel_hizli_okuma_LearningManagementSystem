import { Fragment, useState } from 'react';
import { Dialog, Transition, Menu } from '@headlessui/react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import useAuthCalls from "../service/useAuthCalls";
import MenuListItems from "../components/MenuListItems";
import nobelimg from "../assets/logos/nobel_dark.png"

const Dashboard = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { logout } = useAuthCalls();

  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-600">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <CloseIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <img src={nobelimg} alt="Your Company" />
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    <MenuListItems role={role} />
                  </nav>
                </div>
               
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-indigo-600">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-600">
              <img src={nobelimg} alt="Your Company" />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <MenuListItems role={role} />
              </nav>
            </div>
            {/* <div className="flex-shrink-0 flex bg-indigo-800 p-4">
              <button
                type="button"
                className="group flex items-center w-full"
                onClick={logout}
              >
                <span className="flex-shrink-0 inline-block h-10 w-10 rounded-full overflow-hidden bg-white-600 group-hover:bg-white-500">
                  <svg className="h-full w-full text-indigo-600 group-hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 0v24H0V0h24zm-4.75 12.25H15V8l-5 4 5 4v-3.25h4.25v-1.5zM12 0a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 24a9 9 0 0 1-9-9h18a9 9 0 0 1-9 9z" />
                  </svg>
                </span>
                <div className="ml-3">
                  <p className="text-base font-medium text-white ">Sign out</p>
                </div>
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow justify-between">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">{role === "admin" ? "Admin Paneli" : "Öğrenci Paneli"}</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">View notifications</span>
                <NotificationsOutlinedIcon/>
                <svg className="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a7 7 0 00-7 7v5a2 2 0 01-2 2h14a2 2 0 01-2-2V9a7 7 0 00-7-7zm0 16a2 2 0 002-2H8a2 2 0 002 2z" />
                </svg>
              </button> */}
              <button><NotificationsOutlinedIcon/></button>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10 mx-4" aria-hidden="true" />
              <Menu as="div" className="relative">
                <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <span className="ml-3 text-gray-900">{user.firstName} {user.lastName}</span>
                  <ArrowDropDownOutlinedIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                    <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate(role === 'admin' ? '/nobelhizliokuma/admin-dashboard/profil' : '/nobelhizliokuma/profil')}
                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                          >
                            Profil
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                          >
                            Çıkış
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">{role === "admin" ? "Admin Paneli" : "Öğrenci Paneli"}</h1>
            </div> */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
