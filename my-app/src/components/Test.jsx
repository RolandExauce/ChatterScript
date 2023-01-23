import React from "react";
import { useEffect } from "react";

const Test = () => {


  useEffect(() => {
    return () => {
      window.addEventListener("beforeunload", function (e) {
        let confirmationMessage = "o/";
        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        console.log("logout !");
        return confirmationMessage; //Webkit, Safari, Chrome
      });
    };
  });


  

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
};
export default Test;
