import { MenuItems } from "./MenuItems";
import { Link, useHref } from "react-router-dom";

export function Menu() {
  let href = useHref();
  let getLinkClass = ({ path }) => {
    if (href === path) {
      return `mb-2 text-black bg-teal-300 rounded-xl`;
    } else {
      return `mb-2 text-black bg-white rounded-xl`;
    }
  };

  return (
    <ul className="w-full px-2 pt-2 shadow-xl first-letter:p-2 menu bg-base-100 rounded-box">
      <li className="flex items-center py-3 mb-2 text-3xl text-center bg-gray-200 rounded-lg daysfont">
        AGAPE
      </li>

      {MenuItems.map((it) => {
        return (
          <li key={it.id} className={getLinkClass({ path: it.link })}>
            <Link href={it.link}>{it.content}</Link>
          </li>
        );
      })}
    </ul>
  );
}
