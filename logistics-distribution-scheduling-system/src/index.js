import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "./router";
import { memoryUtils } from "./utils";
import { operationUserStorage } from "./utils";
import "./index.css";

memoryUtils.user = operationUserStorage.getUser();

ReactDOM.render(<AppRouter />, document.getElementById("root"));
