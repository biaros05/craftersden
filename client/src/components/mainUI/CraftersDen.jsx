import BuildPlane from "./BuildPlane";
import BlockSelection from "./BlockSelection";

export default function CraftersDen() {
  return (
    <div id="main-ui">
      <h1>Crafter's Den</h1>
      <p>Here you can find all the crafters in the server and their contact information.</p>
      <BuildPlane/>
      <BlockSelection/>
    </div>
  )
}