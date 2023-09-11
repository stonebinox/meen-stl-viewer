import { useState } from "react";
import styled from "styled-components";
import { StlViewer } from "react-stl-viewer";

import Emblem from "./assets/emblem-dark.png";

const Logo = styled.div`
  width: 100%;
  height: 100px;
  background: url(${Emblem}) no-repeat center;
  background-size: contain;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const Viewer = styled(StlViewer)`
  width: 100vw;
  height: calc(100vh - 132px);
`;

const PickerContainer = styled.div`
  width: 100%;
  height: auto;
  position: absolute;
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
  z-index: 99;
  background-color: rgba(255, 255, 255, 0.6);
`;

const ColourContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
  margin-top: 16px;
`;

const Colour = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 2px;
  background-color: ${({ colour }) => colour};
  cursor: pointer;
  margin-left: 4px;
  margin-right: 4px;
`;

const colors = [
  "#990000",
  "#ffa500",
  "#000000",
  "green",
  "yellow",
  "#00ccff",
  "#666666",
];

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [modelColor, setModelColor] = useState(colors[0]);

  return (
    <div>
      <Logo />
      <PickerContainer>
        <input
          type="file"
          onChange={(e) =>
            setSelectedFile(URL.createObjectURL(e.currentTarget.files[0]))
          }
        />
        <ColourContainer>
          {colors.map((color, i) => (
            <Colour
              colour={color}
              key={i}
              onClick={() => setModelColor(color)}
            />
          ))}
        </ColourContainer>
      </PickerContainer>
      {selectedFile && (
        <Viewer
          orbitControls
          shadows
          showAxes
          modelProps={{
            color: modelColor,
          }}
          url={selectedFile}
        />
      )}
    </div>
  );
}

export default App;
