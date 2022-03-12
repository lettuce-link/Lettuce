import LettuceClient from "./LettuceClient";
import React, { ReactChildren, ReactChild, useState } from "react";

export default function ClientProvider({
  children,
}: {
  children: ReactChildren | ReactChild;
}) {
  const host = process.env.NEXT_PUBLIC_LEMMY_EXTERNAL_HOST;
  const url = `ws://${host}/api/v3/ws`;
  console.log(url);

  const [client] = useState(() => new LettuceClient(url));

  return <p>Hello world {children}</p>;
}
