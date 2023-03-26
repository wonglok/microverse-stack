import { useEffect, useState } from "react";

export function Admin({ getter = () => import("../AdminLayout/AdminLayout") }) {
  let [compos, setCompos] = useState(null);
  useEffect(() => {
    getter()
      .then((r) => r.AdminLayout)
      .then((Fnc) => {
        setCompos(<Fnc></Fnc>);
      });
  }, []);
  return <>{compos}</>;
}
