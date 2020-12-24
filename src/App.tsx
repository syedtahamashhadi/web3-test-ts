import React from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import weenuInterface from './weenuInterface'



declare global {
  interface Window {
      // FB:any;
      web3: any;
      ethereum: any;
  }
}
let weenuInst : any 

// let web3 : object
// let web3 : object
// let window : Window


console.log('Window > ' , window.web3)

if(window.web3){
  weenuInst = window.web3.eth.contract(weenuInterface).at('0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA')
  console.log('Weenu Inst >> ' , weenuInst)
}





function App() {
  // let isDone : boolean = true
  // let isNotDone : boolean = false
  // let initailState : null = null
// let weenuInst : object 



  const [isConnected,setConnected] = React.useState(false)
  const [balance,setBalance] = React.useState(0)
  const [weenuBalance,setWeenuBalance] = React.useState(0)
  const [sendTo,setSendTo] = React.useState(null)
  const [sendAmount,setSendAmount] = React.useState(0)
  const [trxhash,setTrxHash] = React.useState(false)
  const [trxStatus,setTrxStatus] = React.useState(false)




  const connect = () =>{
    // console.log('TypeScript >> >> >> ')
    if (window.ethereum) {
      console.log('TEst',window)
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      return true;
    }else {
      alert ('Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!')
      return false
    }
  }


  const onAccountChanged = () =>{
    console.log('Hurray >>> ' ,window.web3.e )
    window.web3.eth.getAccounts(function(err:any, accounts:any){
      if (err != null) console.error("An error occurred: "+err);
      else if (accounts.length == 0){
        setConnected(false)
      } 
      else{
        setConnected(accounts[0])
      } 
    });
  }

  const getEtherBalance = () =>{
    console.log('Ether Balace is Fired >> ')
    window.web3.eth.getBalance(isConnected,(err: any,bal:any)=>{
      if(err){
        console.log('err is >> ' , err)
      }else{
        console.log('Ammount >>> ', window.web3 , bal)
        bal.c && setBalance(window.web3.fromWei(bal,"ether").c[0])
        // bal.c && setBalance(bal.c[0])
      }
    })
  }

  const getWeenuBalance = () =>{
    weenuInst.balanceOf(isConnected,(err:any,balance:any)=>{
      if(err){
        console.log('Weenu Balance Error > ' , err)
      }else{
        console.log('Weenu Balance > ' , balance)
        balance.c && balance.c[0] > 1 && setWeenuBalance(balance.c[0])
      }
    })
  }

  const sendTransaction =  () =>{
    console.log('TO > ' , sendTo , 'Amount >' , sendAmount ,)
    if(sendTo && sendAmount){
      let trxObject : object = {
        to: sendTo,
        value: window.web3.toWei(sendAmount,'ether')
      }

      // let trx = await window.web3.eth.sendTransaction(trxObject)
      // console.log('Trx >> ' , trx)
      window.web3.eth.sendTransaction(trxObject,(err: any,val : any)=>{
        if(err){
          console.log('Trx Failed > ' ,err)
        }else{
          console.log('Trx Success > ' ,val)
          setTrxHash(val)
          setTrxStatus(false)
        }
      })
    }
  }

  React.useEffect(()=>{
    if(trxhash && trxStatus == false){
      let socket = setInterval(()=>{
        window.web3.eth.getTransactionReceipt(trxhash,(err: string,rec: any)=>{
          if(err){
            console.log('Reciept Err' , err)
          }else{
            console.log('Reciept is here > ' , rec)
            if(rec){
              setTrxStatus(true)
              getEtherBalance()
              clearInterval(socket)
            }
          }
        })
      },3000)
    }
  },[trxhash,trxStatus])

  React.useEffect(()=>{
    if(isConnected){
      getEtherBalance()
      getWeenuBalance()
    }
  },[isConnected])

  window.ethereum && window.ethereum.on('accountsChanged',onAccountChanged)





  return (
    <div className="App">
     <h2>ETHER</h2>
      <button onClick={connect}>Connect MetaMask</button>
      {/* <button onClick={connect}>Disconnect MetaMask</button> */}

      <h3>{isConnected ? 'Your Account is Connected' : 'Kindly Connect Your Account'}</h3>
      {
        isConnected && (
        <>
         <h3> {isConnected}</h3>
        <h3>ETH : {balance} </h3> 
        <h3>Weenu : {weenuBalance} </h3> 
        <input onChange={(e:any)=>setSendAmount(e.target.value)} placeholder='Amount'/>
        <input onChange={(e:any)=>setSendTo(e.target.value)} placeholder='To'/>

        <button onClick={sendTransaction}>Send</button>

        {trxhash && <h4>{trxhash}  </h4>    }
        {trxhash && trxStatus !== false && <h4 style={{color:'green'}}>Confirmed</h4> }
         { trxhash && trxStatus == false &&  <h4 style={{color:'red'}}>Pending</h4> } 
        </>
        )
      }
    </div>
  );
}

export default App;
