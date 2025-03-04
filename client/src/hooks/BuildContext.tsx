import React, { createContext, useContext, useState } from "react";

interface BuildContextType {
  build: any; 
}

//React.Dispatch<React.SetStateAction<any>> is a Typescript type for a state setter 
//returned by useState.
interface BuildUpdateContextType {
  setBuild: React.Dispatch<React.SetStateAction<any>>;
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);
const BuildUpdateContext = createContext<BuildUpdateContextType | undefined>(undefined);

export function useBuild(){
  return useContext(BuildContext);
}

export function useBuildUpdate(){
  return useContext(BuildUpdateContext);
}

export function BuildProvider({ children }) {

  //it is better to specifiy a type.. then use it.. later?
  // interface Build {
  //   buildJSON: object;
  // }

  //<any> allows for any type.
  const [build, setBuild] = useState<any>(null);

  return (
    <BuildContext.Provider value={{ build }}>
      <BuildUpdateContext.Provider value={{ setBuild }}>
      {children}
      </BuildUpdateContext.Provider>
    </BuildContext.Provider>
  );
}

