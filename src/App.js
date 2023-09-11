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
`;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

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
      </PickerContainer>
      {selectedFile && (
        <Viewer
          orbitControls
          shadows
          showAxes
          modelProps={{
            color: "#ffa500",
          }}
          url={selectedFile}
        />
      )}
    </div>
  );
}

export default App;
