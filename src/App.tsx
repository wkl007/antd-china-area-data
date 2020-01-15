import React from 'react'
import { Cascader } from 'antd'
import logo from './logo.svg'
import './App.css'
import options from './generateData.json'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Ant Design 省市区三级联动示例
        </p>
        <Cascader options={options}/>
      </header>
    </div>
  )
}

export default App
