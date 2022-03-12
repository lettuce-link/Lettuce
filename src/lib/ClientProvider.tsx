import LettuceClient from "./LettuceClient";
import React, { ReactChildren, ReactChild, useState } from "react";

export default function ClientProvider({
  children,
}: {
  children: ReactChildren | ReactChild;
}) {
  const [client] = useState(() => new LettuceClient(""));

  return <p>Hello world {children}</p>;
}
