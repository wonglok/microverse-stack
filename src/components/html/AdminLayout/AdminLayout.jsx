import { LogoutButton } from "../Menu/LogoutButton";
import { Menu } from "../Menu/Menu";
import { MenuItems } from "../Menu/MenuItems";
import { useRouter } from "next/router";

export function AdminLayout({ children }) {
  let router = useRouter();
  let route = router.asPath;
  return (
    <div className="h-full w-full bg-gradient-to-t from-green-200  to-cyan-900 p-5">
      <div
        style={{ maxWidth: "1680px" }}
        className="rounded-box glass mx-auto h-full w-full bg-opacity-60 text-base-content shadow-lg backdrop-blur-lg"
      >
        <>
          <div className="px-2 pt-2" style={{ height: "4.5rem" }}>
            <div className="navbar rounded-box space-x-1 text-primary-content">
              <div className="ml-3 flex-1 text-2xl">
                {/* <div className='' style={{ width: `18rem` }}></div> */}
                <div className="mr-5 flex items-center rounded-2xl bg-gray-100 px-5 text-black">
                  <div className="breadcrumbs flex text-base shadow-xl">
                    <ul>
                      <li className="">
                        <a
                          href="/"
                          target={"_blank"}
                          referrerPolicy="no-referrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="mr-2 h-4 w-4 stroke-current"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            ></path>
                          </svg>
                          Landing Page
                        </a>
                      </li>
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="mr-2 h-4 w-4 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          ></path>
                        </svg>
                        Admin Portal
                      </li>
                      <li>
                        {/* <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          className='w-4 h-4 mr-2 stroke-current'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                        </svg> */}
                        {MenuItems.find((r) => r.link === route)?.content}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="hidden flex-1 md:flex md:flex-none">
                <div className="form-control">
                  <div className="dropdown">
                    <div tabIndex="0">
                      <input
                        placeholder="Search"
                        className="input-bordered input-ghost input rounded-full text-primary-content placeholder:text-primary-content focus:bg-transparent focus:text-primary-content"
                      />
                    </div>
                    <div tabIndex="0" className="dropdown-content py-2">
                      <div className="card compact rounded-box w-72 bg-neutral-focus text-neutral-content shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title font-extrabold capitalize">
                            Search Result
                          </h2>
                          <p className="text-sm text-neutral-content text-opacity-80">
                            ...
                          </p>
                          <div className="mt-4 flex justify-end">
                            <a className="btn-primary btn-sm btn xl:btn-md">
                              View More
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                aria-label="button component"
                className="mask btn-ghost mask-squircle btn-square btn hidden border-none focus:bg-base-content focus:bg-opacity-50 md:flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
              <div className="dropdown-left dropdown ">
                <div tabIndex="0">
                  <button
                    aria-label="button component"
                    className="mask btn-ghost mask-squircle btn-square btn hidden border-none focus:bg-base-content focus:bg-opacity-50 md:flex"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-6 w-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div
                  tabIndex="0"
                  className="dropdown-content translate-y-12 translate-x-12 py-2"
                >
                  <div className="card compact rounded-box w-72 bg-gray-300 text-black shadow">
                    <div className="card-body">
                      <h2 className="card-title font-extrabold capitalize">
                        Notifications
                      </h2>
                      <p className="text-sm text-black text-opacity-80">{`You'll need a navbar on top of your page`}</p>
                      <div className="mt-4 flex justify-end">
                        <a className="btn-primary btn-sm btn xl:btn-md">More</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dropdown-left dropdown">
                <div tabIndex="0">
                  <button
                    aria-label="navbar component"
                    className="mask btn-ghost mask-squircle btn-square btn hidden border-none focus:bg-base-content focus:bg-opacity-50 md:flex"
                  >
                    <div className="avatar">
                      <div className="mask mask-squircle h-10 w-10">
                        <div className="flex h-full w-full items-center justify-center ">
                          <svg
                            width="24"
                            height="24"
                            xmlns="http://www.w3.org/2000/svg"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            className="stroke-current"
                          >
                            <path
                              fill="white"
                              d="M16 2v7h-2v-5h-12v16h12v-5h2v7h-16v-20h16zm2 9v-4l6 5-6 5v-4h-10v-2h10z"
                            />
                          </svg>
                        </div>
                        {/* <img src='/img/user-image/faces/dog128.png' alt='Avatar Tailwind CSS Component' /> */}
                      </div>
                    </div>
                  </button>
                </div>
                <div
                  tabIndex="0"
                  className="dropdown-content translate-y-12 translate-x-12 py-2"
                >
                  <div className="card compact rounded-box w-72 bg-neutral-focus text-neutral-content shadow-xl">
                    <div className="card-body">
                      <h2 className="daysfont card-title font-extrabold capitalize">
                        {" "}
                        See you around... 🥺 👋🏻
                      </h2>
                      <LogoutButton></LogoutButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full" style={{ height: "calc(100% - 4.5rem)" }}>
            <div className="h-full px-6 pt-2 pb-8">
              <div className="flex h-full">
                <div className="" style={{ width: `17rem` }}>
                  <Menu></Menu>
                </div>
                <div
                  className="ml-5 h-full"
                  style={{ width: `calc(100% - 17rem)` }}
                >
                  <div className="h-full overflow-auto rounded-2xl bg-white p-4 shadow-xl">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <LogoutButton /> */}
        </>
      </div>
    </div>
  );
}
