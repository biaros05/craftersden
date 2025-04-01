//source from https://reactrouter.com/6.28.0/start/tutorial
import { renderMatches, useRouteError } from 'react-router-dom';
import React from 'react';
import './styles/error.css';
import MyVideo from "./assets/OOPS_GOOD_1.gif";

/**
 * Renders a component informing a use of the error that occured.
 * @returns {React.ReactNode} A page component that informs the user of an error.
 */
export default function ErrorPage() {
  const error = useRouteError();
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <img src={MyVideo} width={'100%'} alt="vid" />
      </div>
    );
}