import React from "react";

const Error403 = () => {
  return (
    <div className="signup-background" style={{ zIndex: 6, position: "fixed" }}>
      <div
        className="login-register-wrapper"
        style={{ textAlign: "center", padding: 40 }}
      >
        <h1>403</h1>
        <p>You are not allowed to view this page</p>
      </div>
    </div>
  );
};

export default Error403;
