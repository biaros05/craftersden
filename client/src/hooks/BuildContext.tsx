import React, { createContext, useContext, useState } from "react";

interface BuildContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  build: any;   
}

//React.Dispatch<React.SetStateAction<any>> is a Typescript type for a state setter 
//returned by useState.
interface BuildUpdateContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setBuild: React.Dispatch<React.SetStateAction<any>>; 

}

const BuildContext = createContext<BuildContextType | undefined>(undefined);
const BuildUpdateContext = createContext<BuildUpdateContextType | undefined>(undefined);

/**
 *This function returns the current build.
 * @returns {object} The current build.
 */
export function useBuild(){
  return useContext(BuildContext);
}

/**
 * This function updates the build context.
 * @returns {object} The build update context.
 */
export function useBuildUpdate() {
  const context = useContext(BuildUpdateContext);
  if (!context) {
    throw new Error("useBuildUpdate must be used within a BuildProvider");
  }
  return context;
}


/**
 * Provides the build context. Used to wrap components that need the build context.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The React children that need access to the build context.
 * @returns {React.ReactNode} The build provider component.
 */
export function BuildProvider({ children }) {

  //it is better to specifiy a type.. then use it.. later?
  // interface Build {
  //   buildJSON: object;
  // }

  //<any> allows for any type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [build, setBuild] = useState<any>(null);

  return (
    <BuildContext.Provider value={{ build }}>
      <BuildUpdateContext.Provider value={{ setBuild }}>
      {children}
      </BuildUpdateContext.Provider>
    </BuildContext.Provider>
  );
}

