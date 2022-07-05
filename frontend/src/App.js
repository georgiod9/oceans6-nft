import React from "react"
import './App.scss';
import NavBar from "./components/NavBar";
import MintingPage from "./pages/MintingPage";
import CommingSoonPage from "./pages/CommingSoonPage";
import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [isWalletList, setIsWalletList] = React.useState(false);
  const [dueNFTPayment, setDueNFTPayment] = React.useState(false);

  return (
    <Router>
      <div className="App">
        <NavBar 
          dueNFTPayment={dueNFTPayment}
          setDueNFTPayment={setDueNFTPayment}
          isWalletList = {isWalletList}
          setIsWalletList = {setIsWalletList}
        />
        <Routes>
          <Route exact path='/' element={
            <MintingPage 
              dueNFTPayment={dueNFTPayment}
              setDueNFTPayment={setDueNFTPayment}
              isWalletList={isWalletList}
              setIsWalletList={setIsWalletList}
            />
          }></Route>
          <Route exact path='coming-soon' element={
            <CommingSoonPage />
          }></Route>
        </Routes>
        
      </div> 
    </Router>
    
  );
}

export default App;
