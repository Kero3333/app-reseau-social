import { useEffect } from "react";

export const Network = ({ network }) => {
  useEffect(() => {
    console.log(network);
  }, [network]);
  return (
    <div className="network">
      <h2>Network</h2>
      <div className="network-content">
        {network.map((person) => {
          return <div className="person"></div>;
        })}
      </div>
    </div>
  );
};
