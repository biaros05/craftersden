//source from https://reactrouter.com/6.28.0/start/tutorial
import { useRouteError } from 'react-router-dom';
import React from 'react';

/**
 * Renders a component informing a use of the error that occured.
 * @returns {React.ReactNode} A page component that informs the user of an error.
 */
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}