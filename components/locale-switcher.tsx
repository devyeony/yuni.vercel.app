"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition, useState } from "react";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    const withoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

    startTransition(() => {
      router.replace(`/${newLocale}${withoutLocale}`);
    });

    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
        type="button"
      >
        {currentLocale === "en" ? "English" : "한국어"}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          id="dropdown"
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleChange({ target: { value: "en" } } as any);
                }}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                English
              </Link>
            </li>
            <li>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleChange({ target: { value: "ko" } } as any);
                }}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                한국어
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
