import { useEffect, useState } from "react";

export function LazyLoad({
  children,
  lazy = () => import("../AdminLayout/AdminLayout"),
  ...itemProps
}) {
  let [compos, setCompos] = useState(null);
  useEffect(() => {
    lazy().then((Fnc) => {
      setCompos(<Fnc {...itemProps}>{children}</Fnc>);
    });
  }, []);
  return <>{compos}</>;
}
